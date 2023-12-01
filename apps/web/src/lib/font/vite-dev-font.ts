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
      </style>
      <script>
        const showErrorOverlay = err => {
          const ErrorOverlay = customElements.get('vite-error-overlay')
          if (!ErrorOverlay) { return }
          console.log(err)
          const overlay = new ErrorOverlay(err)
          document.body.appendChild(overlay)
        }
        window.addEventListener('error', showErrorOverlay)
      </script>
      `
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
