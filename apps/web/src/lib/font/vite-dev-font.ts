import { join, relative } from 'path';

import { heyFont } from '../heyFont';

export default {
  name: 'dev-font',
  transformIndexHtml: (html: string) => {
    for (const j of heyFont) {
      const fontName = '__dev_font_' + new Date().getTime();
      html = html.replace(
        'head>',
        `head><style>
        ${j.selector} {
          font-family: ${fontName};
        }
      </style>`
      );
      for (const i of j.src) {
        html = html.replace(
          'head>',
          `head><style> @font-face { font-style: ${i.style}; font-weight: ${
            i.weight
          }; font-display: ${
            j.display
          }; font-family: ${fontName}; src: url(/${relative(
            join(process.cwd(), 'public'),
            i.path
          )}); } </style>`
        );
      }
    }
    return html;
  }
};
