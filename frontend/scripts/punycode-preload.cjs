const Module = require('module');

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'punycode') {
    return originalLoad.call(this, 'punycode/', parent, isMain);
  }

  return originalLoad.call(this, request, parent, isMain);
};
