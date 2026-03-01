export const formatAdminTextForDisplay = (text) => {
  if (typeof text !== 'string') return text;

  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .trim();
};
