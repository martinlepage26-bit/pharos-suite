const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const frontendRoot = path.resolve(__dirname, '..');

const TARGET_FILES = [
  'README.md',
  'compassai/README.md',
  'aurorai/README.md',
  'compassai/frontend/README.md',
  'aurorai/frontend/README.md',
  'docs/pharos-product-boundaries.md',
  'docs/cloudflare-pages.md',
  'docs/free-first-architecture.md',
  'docs/public-backend-plan.md',
  'frontend/public/sitemap.xml',
  'frontend/public/pharos-transparency.json'
].map((relativePath) => path.join(repoRoot, relativePath));

const TARGET_DIRS = [
  path.join(frontendRoot, 'src', 'pages'),
  path.join(frontendRoot, 'src', 'components')
];

const TARGET_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const TEXT_SCAN_EXCLUSIONS = new Set([
  path.join(frontendRoot, 'src', 'App.js'),
  path.join(frontendRoot, 'src', 'App.smoke.test.js')
]);

const HISTORICAL_MARKERS = [
  /boundary-validator:\s*ignore-historical/i,
  /status:\s*historical/i,
  /historical document/i,
  /historical note/i
];

const findings = [];

function toRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function walkFiles(directory) {
  if (!exists(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function isHistoricalDocument(text) {
  return HISTORICAL_MARKERS.some((pattern) => pattern.test(text));
}

function lineColumnAt(text, index) {
  const before = text.slice(0, index);
  const lines = before.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

function getLine(text, lineNumber) {
  return text.split('\n')[lineNumber - 1] || '';
}

function addFinding(filePath, index, rule, message) {
  const { line, column } = lineColumnAt(readText(filePath), index);
  findings.push({
    file: toRelative(filePath),
    line,
    column,
    rule,
    message,
    snippet: getLine(readText(filePath), line).trim()
  });
}

function addFindingFromText(filePath, text, index, rule, message) {
  const { line, column } = lineColumnAt(text, index);
  findings.push({
    file: toRelative(filePath),
    line,
    column,
    rule,
    message,
    snippet: getLine(text, line).trim()
  });
}

function hasTechnicalAuroraiContext(line) {
  return /\/home\/|repos\/AurorAI|platform-status|same machine as the PHAROS backend/.test(line);
}

function hasStandaloneNegativeContext(line) {
  return /do not claim|not yet|not a runnable standalone|not a proven runnable standalone app|unless that is separately validated|remain under|until .* standalone|staged work|compatibility route|not .* production/i.test(line);
}

function requireText(filePath, pattern, rule, message) {
  const text = readText(filePath);
  if (!pattern.test(text)) {
    findings.push({
      file: toRelative(filePath),
      line: 1,
      column: 1,
      rule,
      message,
      snippet: '(missing expected route or compatibility behavior)'
    });
  }
}

function forbidText(filePath, pattern, rule, message) {
  const text = readText(filePath);
  const match = text.match(pattern);
  if (match && typeof match.index === 'number') {
    addFindingFromText(filePath, text, match.index, rule, message);
  }
}

function scanTextSurface(filePath) {
  const text = readText(filePath);
  if (isHistoricalDocument(text)) return;

  const auroraiPattern = /\bAurorAI\b/g;
  for (const match of text.matchAll(auroraiPattern)) {
    const { line } = lineColumnAt(text, match.index);
    const lineText = getLine(text, line);
    if (hasTechnicalAuroraiContext(lineText)) {
      continue;
    }

    addFindingFromText(
      filePath,
      text,
      match.index,
      'aurora-spelling',
      'User-facing or boundary-truth text should use "Aurora", not "AurorAI".'
    );
  }

  const siblingPatterns = [
    /\bAurora\s+(?:and|&)\s+CompassAI\s+are\b/g,
    /\bCompassAI\s+(?:and|&)\s+Aurora\s+are\b/g,
    /\bAurora\s+(?:and|&)\s+CompassAI\s+(?:remain|stay)\b/g,
    /\bCompassAI\s+(?:and|&)\s+Aurora\s+(?:remain|stay)\b/g
  ];

  for (const pattern of siblingPatterns) {
    for (const match of text.matchAll(pattern)) {
      addFindingFromText(
        filePath,
        text,
        match.index,
        'sibling-boundary',
        'Aurora should be described as inside CompassAI, not as a sibling product to CompassAI.'
      );
    }
  }

  if (text.includes('/portal/aurorai')) {
    const compatibilityContext = /compatibilit|redirect|legacy Aurora portal compatibility route|\"from\"\s*:\s*\"\/portal\/aurorai\"/i.test(text);
    if (!compatibilityContext) {
      addFindingFromText(
        filePath,
        text,
        text.indexOf('/portal/aurorai'),
        'aurora-route-canonical',
        'Use /portal/compassai/aurora as the canonical Aurora route. /portal/aurorai is compatibility-only.'
      );
    }
  }

  const standaloneClaimPatterns = [
    /\b(?:Aurora|CompassAI)\b.{0,80}\b(?:is|are|has|have|runs|ships|serves)\b.{0,80}\bstandalone\b.{0,80}\b(?:production\s+)?(?:frontend|browser surface|web surface|app)\b/g,
    /\bstandalone\b.{0,80}\b(?:production\s+)?(?:frontend|browser surface|web surface|app)\b.{0,80}\b(?:is|are|has|have)\b.{0,80}\b(?:Aurora|CompassAI)\b/g
  ];

  for (const pattern of standaloneClaimPatterns) {
    for (const match of text.matchAll(pattern)) {
      const { line } = lineColumnAt(text, match.index);
      const lineText = getLine(text, line);
      if (hasStandaloneNegativeContext(lineText)) {
        continue;
      }

      addFindingFromText(
        filePath,
        text,
        match.index,
        'standalone-frontend-claim',
        'Do not claim Aurora or CompassAI already have standalone production frontends.'
      );
    }
  }

  const governIdentityPatterns = [
    /\bcanonical\b.{0,80}\bgovern-ai(?:\.ca)?\b/gi,
    /\bcanonical\b.{0,80}\bgovernai(?:\.ca)?\b/gi,
    /\bgovern-ai(?:\.ca)?\b.{0,80}\b(?:is|remains|serves as)\b.{0,40}\b(?:canonical|primary|public)\b/gi,
    /\bgovernai(?:\.ca)?\b.{0,80}\b(?:is|remains|serves as)\b.{0,40}\b(?:canonical|primary|public)\b/gi
  ];

  for (const pattern of governIdentityPatterns) {
    for (const match of text.matchAll(pattern)) {
      addFindingFromText(
        filePath,
        text,
        match.index,
        'legacy-identity',
        'Do not present govern-ai/governai as the canonical PHAROS public identity.'
      );
    }
  }
}

function scanRouteMechanics() {
  const appJs = path.join(frontendRoot, 'src', 'App.js');
  requireText(
    appJs,
    /path="\/portal\/compassai\/aurora"/,
    'route-canonical-present',
    'App.js must define the canonical /portal/compassai/aurora route.'
  );
  requireText(
    appJs,
    /path="\/portal\/aurorai"[\s\S]*?<Navigate to="\/portal\/compassai\/aurora" replace \/>/,
    'route-compatibility-redirect',
    'App.js must keep /portal/aurorai as a compatibility redirect to /portal/compassai/aurora.'
  );

  const redirectsFile = path.join(frontendRoot, 'public', '_redirects');
  requireText(
    redirectsFile,
    /^\/portal\/aurorai \/portal\/compassai\/aurora 301$/m,
    'redirect-compatibility-301',
    '_redirects must 301 /portal/aurorai to /portal/compassai/aurora.'
  );
  requireText(
    redirectsFile,
    /^\/portal\/compassai\/aurora \/portal\/compassai\/aurora\/index\.html 200$/m,
    'redirect-canonical-static-page',
    '_redirects must serve /portal/compassai/aurora from its static route page.'
  );

  const staticRoutesFile = path.join(frontendRoot, 'scripts', 'generate-static-route-pages.cjs');
  requireText(
    staticRoutesFile,
    /path:\s*'\/portal\/compassai\/aurora'/,
    'static-route-canonical',
    'Static route generation must include /portal/compassai/aurora.'
  );
  forbidText(
    staticRoutesFile,
    /path:\s*'\/portal\/aurorai'/,
    'static-route-legacy-canonical',
    'Static route generation should not treat /portal/aurorai as a canonical generated page.'
  );

  const smokeFile = path.join(frontendRoot, 'src', 'App.smoke.test.js');
  requireText(
    smokeFile,
    /\['\/portal\/compassai\/aurora',\s*'portal-aurorai-page'\]/,
    'smoke-canonical-route',
    'Smoke tests must cover /portal/compassai/aurora as the canonical Aurora route.'
  );
  requireText(
    smokeFile,
    /window\.history\.pushState\(\{\},\s*'',\s*'\/portal\/aurorai'\)/,
    'smoke-compatibility-route',
    'Smoke tests must keep a compatibility check for /portal/aurorai.'
  );
}

function scanPublicMetadata() {
  const sitemapFile = path.join(frontendRoot, 'public', 'sitemap.xml');
  requireText(
    sitemapFile,
    /https:\/\/pharos-ai\.ca\/portal\/compassai\/aurora/,
    'sitemap-canonical-route',
    'Sitemap must include /portal/compassai/aurora as the canonical Aurora route.'
  );
  forbidText(
    sitemapFile,
    /https:\/\/pharos-ai\.ca\/portal\/aurorai/,
    'sitemap-legacy-canonical',
    'Sitemap should not publish /portal/aurorai as a canonical Aurora URL.'
  );

  const transparencyFile = path.join(frontendRoot, 'public', 'pharos-transparency.json');
  const transparency = JSON.parse(readText(transparencyFile));

  if (!Array.isArray(transparency.public_routes) || !transparency.public_routes.includes('/portal/compassai/aurora')) {
    findings.push({
      file: toRelative(transparencyFile),
      line: 1,
      column: 1,
      rule: 'transparency-canonical-route',
      message: 'pharos-transparency.json must list /portal/compassai/aurora in public_routes.',
      snippet: '(missing /portal/compassai/aurora in public_routes)'
    });
  }

  if (Array.isArray(transparency.public_routes) && transparency.public_routes.includes('/portal/aurorai')) {
    findings.push({
      file: toRelative(transparencyFile),
      line: 1,
      column: 1,
      rule: 'transparency-legacy-public-route',
      message: 'pharos-transparency.json should not list /portal/aurorai as a canonical public route.',
      snippet: JSON.stringify(transparency.public_routes)
    });
  }

  const compatibilityRoutes = Array.isArray(transparency.compatibility_routes) ? transparency.compatibility_routes : [];
  const auroraCompatibility = compatibilityRoutes.find((entry) => entry && entry.from === '/portal/aurorai' && entry.to === '/portal/compassai/aurora');

  if (!auroraCompatibility) {
    findings.push({
      file: toRelative(transparencyFile),
      line: 1,
      column: 1,
      rule: 'transparency-compatibility-route',
      message: 'pharos-transparency.json must document the /portal/aurorai -> /portal/compassai/aurora compatibility route.',
      snippet: JSON.stringify(compatibilityRoutes)
    });
  }
}

function main() {
  const files = new Set(TARGET_FILES.filter(exists));
  for (const directory of TARGET_DIRS) {
    for (const filePath of walkFiles(directory)) {
      if (!TEXT_SCAN_EXCLUSIONS.has(filePath)) {
        files.add(filePath);
      }
    }
  }

  for (const filePath of files) {
    scanTextSurface(filePath);
  }

  scanRouteMechanics();
  scanPublicMetadata();

  if (findings.length === 0) {
    console.log('PASS validate-product-boundaries');
    console.log('Checked PHAROS/CompassAI/Aurora naming, boundary, and canonical Aurora route drift.');
    process.exit(0);
  }

  console.error('FAIL validate-product-boundaries');
  console.error('');

  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line}:${finding.column} [${finding.rule}] ${finding.message}`);
    console.error(`  ${finding.snippet}`);
  }

  process.exit(1);
}

main();
