const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCK_PATH = path.join(ROOT, 'style-lock.json');

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function hashText(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function loadLockFile() {
  return JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
}

function walkCssFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCssFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectCssState(lockFile) {
  const ignoreSet = new Set(lockFile.ignoredFiles || []);
  const allCssFiles = walkCssFiles(path.join(ROOT, 'src'))
    .map((filePath) => toPosixPath(path.relative(ROOT, filePath)))
    .filter((relativePath) => !ignoreSet.has(relativePath))
    .sort();

  const fileHashes = {};
  for (const relativePath of allCssFiles) {
    const absolutePath = path.join(ROOT, relativePath);
    fileHashes[relativePath] = hashBuffer(fs.readFileSync(absolutePath));
  }

  return {
    files: allCssFiles,
    hashes: fileHashes
  };
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function checkLock() {
  const lockFile = loadLockFile();
  const currentState = collectCssState(lockFile);
  const lockedFiles = Object.keys(lockFile.files || {}).sort();

  const addedFiles = currentState.files.filter((file) => !lockedFiles.includes(file));
  const removedFiles = lockedFiles.filter((file) => !currentState.files.includes(file));
  const changedFiles = currentState.files.filter(
    (file) => lockFile.files[file] && lockFile.files[file] !== currentState.hashes[file]
  );

  if (addedFiles.length || removedFiles.length || changedFiles.length) {
    const sections = [
      'PHAROS style lock blocked the command.',
      ''
    ];

    if (addedFiles.length) {
      sections.push('Added CSS files:');
      sections.push(formatList(addedFiles));
      sections.push('');
    }

    if (removedFiles.length) {
      sections.push('Removed CSS files:');
      sections.push(formatList(removedFiles));
      sections.push('');
    }

    if (changedFiles.length) {
      sections.push('Changed CSS files:');
      sections.push(formatList(changedFiles));
      sections.push('');
    }

    sections.push('To intentionally accept CSS changes, run:');
    sections.push("PHAROS_STYLE_LOCK_PASSWORD='<password>' npm run style:lock:update");

    fail(sections.join('\n'));
  }

  console.log(`PHAROS style lock OK: ${lockedFiles.length} CSS files match ${path.basename(LOCK_PATH)}.`);
}

function verifyPassword(lockFile) {
  const password = process.env.PHAROS_STYLE_LOCK_PASSWORD;
  if (!password) {
    fail('PHAROS style lock update requires PHAROS_STYLE_LOCK_PASSWORD.');
  }

  const suppliedHash = Buffer.from(hashText(password), 'hex');
  const expectedHash = Buffer.from(lockFile.passwordSha256, 'hex');

  if (
    suppliedHash.length !== expectedHash.length ||
    !crypto.timingSafeEqual(suppliedHash, expectedHash)
  ) {
    fail('PHAROS style lock password rejected.');
  }
}

function updateLock() {
  const lockFile = loadLockFile();
  verifyPassword(lockFile);

  const currentState = collectCssState(lockFile);
  const nextLockFile = {
    ...lockFile,
    generatedAt: new Date().toISOString(),
    files: currentState.hashes
  };

  fs.writeFileSync(LOCK_PATH, `${JSON.stringify(nextLockFile, null, 2)}\n`, 'utf8');
  console.log(`PHAROS style lock updated for ${currentState.files.length} CSS files.`);
}

const command = process.argv[2] || 'check';

if (command === 'check') {
  checkLock();
} else if (command === 'update') {
  updateLock();
} else {
  fail(`Unknown command "${command}". Use "check" or "update".`);
}
