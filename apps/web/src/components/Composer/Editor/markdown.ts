import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { remarkLinkProtocol } from './remarkLinkProtocol';

export const markdownFromHTML = (html: string): string => {
  return unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkLinkProtocol)
    .use(remarkStringify)
    .processSync(html)
    .toString();
};

export const htmlFromMarkdown = (markdown: string): string => {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
};
