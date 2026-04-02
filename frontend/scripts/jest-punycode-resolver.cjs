module.exports = (request, options) => {
  if (request === 'punycode') {
    return options.defaultResolver('punycode/', options);
  }

  return options.defaultResolver(request, options);
};
