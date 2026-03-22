export const normalizeAdminText = (text) => {
  if (typeof text !== 'string') return '';

  return text
    .replace(/\r\n?/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<\/?p>/gi, '')
    .replace(/<(?!\/?u\b)[^>]*>/gi, '')
    .trim();
};

const stripInlineFormatting = (text) => text
  .replace(/<u>(.*?)<\/u>/gi, '$1')
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/\*(.*?)\*/g, '$1')
  .replace(/_(.*?)_/g, '$1');

export const getAdminTextBlocks = (text) => {
  const normalized = normalizeAdminText(text);

  if (!normalized) return [];

  const blocks = [];
  let paragraphLines = [];
  let listType = null;
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length || !listType) return;
    blocks.push({ type: listType, items: [...listItems] });
    listItems = [];
    listType = null;
  };

  normalized.split('\n').forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const unorderedMatch = line.match(/^\s*[-*•]\s+(.+)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (unorderedMatch) {
      flushParagraph();
      if (listType !== 'unordered') {
        flushList();
        listType = 'unordered';
      }
      listItems.push(unorderedMatch[1]);
      return;
    }

    if (orderedMatch) {
      flushParagraph();
      if (listType !== 'ordered') {
        flushList();
        listType = 'ordered';
      }
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
};

export const formatAdminTextForDisplay = (text) => {
  if (typeof text !== 'string') return text;

  return stripInlineFormatting(normalizeAdminText(text))
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .trim();
};
