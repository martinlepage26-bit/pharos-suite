import { Fragment } from 'react';
import { getAdminTextBlocks } from '../lib/textFormat';

const INLINE_TOKEN_PATTERN = /(<u>.*?<\/u>|\*\*.*?\*\*|\*[^*]+\*|_[^_]+_)/g;

const renderInlineText = (text, keyPrefix) => {
  const segments = String(text || '').split(INLINE_TOKEN_PATTERN).filter(Boolean);

  return segments.map((segment, index) => {
    const key = `${keyPrefix}-${index}`;

    if (/^<u>.*<\/u>$/i.test(segment)) {
      return <u key={key}>{segment.replace(/^<u>|<\/u>$/gi, '')}</u>;
    }

    if (/^\*\*.*\*\*$/.test(segment)) {
      return <strong key={key}>{segment.slice(2, -2)}</strong>;
    }

    if (/^\*.*\*$/.test(segment)) {
      return <em key={key}>{segment.slice(1, -1)}</em>;
    }

    if (/^_.*_$/.test(segment)) {
      return <em key={key}>{segment.slice(1, -1)}</em>;
    }

    return <Fragment key={key}>{segment}</Fragment>;
  });
};

const renderParagraph = (text, keyPrefix) => text.split('\n').map((line, index, lines) => (
  <Fragment key={`${keyPrefix}-line-${index}`}>
    {renderInlineText(line, `${keyPrefix}-inline-${index}`)}
    {index < lines.length - 1 ? <br /> : null}
  </Fragment>
));

const RichTextContent = ({
  text,
  className = '',
  paragraphClassName = '',
  listClassName = '',
  itemClassName = ''
}) => {
  const blocks = getAdminTextBlocks(text);

  if (!blocks.length) return null;

  return (
    <div className={`rich-text-content ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (block.type === 'unordered') {
          return (
            <ul key={`block-${index}`} className={`rich-text-list ${listClassName}`.trim()}>
              {block.items.map((item, itemIndex) => (
                <li key={`block-${index}-item-${itemIndex}`} className={itemClassName}>
                  {renderInlineText(item, `block-${index}-item-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ordered') {
          return (
            <ol key={`block-${index}`} className={`rich-text-list rich-text-list-ordered ${listClassName}`.trim()}>
              {block.items.map((item, itemIndex) => (
                <li key={`block-${index}-item-${itemIndex}`} className={itemClassName}>
                  {renderInlineText(item, `block-${index}-item-${itemIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`block-${index}`} className={paragraphClassName}>
            {renderParagraph(block.text, `block-${index}`)}
          </p>
        );
      })}
    </div>
  );
};

export default RichTextContent;
