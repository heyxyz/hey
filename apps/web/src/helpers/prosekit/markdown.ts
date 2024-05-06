import { remarkLinkProtocol } from '@helpers/prosekit/remarkLinkProtocol';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

export const markdownFromHTML = (html: string): string => {
  return unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkLinkProtocol)
    .use(remarkStringify)
    .processSync(html)
    .toString();
};

export const htmlFromMarkdown = (markdown: string): string => {
  return unified()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
};
