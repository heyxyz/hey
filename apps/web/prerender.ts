import * as cheerio from 'cheerio';
import { openSync } from 'fontkit';
import { readFileSync, writeFileSync } from 'fs';
import htmlMinifier from 'html-minifier';
import { join, relative } from 'path';
import { createServer } from 'vite';

import {
  getFallbackMetricsFromFontFile,
  getFontType
} from './src/lib/font/font';
import { pickFontFileForFallbackGeneration } from './src/lib/font/pick-font-file-for-fallback-generation';
import { heyFont } from './src/lib/heyFont';

const appDir = process.cwd();

const vite = await createServer({
  server: {
    middlewareMode: true
  },
  appType: 'custom'
});

const prerender = async () => {
  const { renderBody, renderHead } = await vite.ssrLoadModule(
    join(appDir, 'src', 'entry-server.tsx')
  );
  const buffer = readFileSync(join(appDir, 'dist', 'index.html'));
  const $ = cheerio.load(buffer);

  // Insert Meta Head
  const headRendered = renderHead();
  $('head').prepend(headRendered.title.toString());
  $('head').prepend(headRendered.meta.toString());
  $('head').prepend(headRendered.link.toString());
  $('[data-react-helmet]').removeAttr('data-react-helmet');
  $('#root').html(renderBody());

  // Fallback Font Tag
  const { metadata } = pickFontFileForFallbackGeneration(
    heyFont.src.map((i) => ({
      style: i.style,
      weight: i.weight,
      metadata: openSync(i.path)
    }))
  );
  const fallbackFont = getFallbackMetricsFromFontFile(
    metadata,
    heyFont.fallback
  );

  // Set font-family and fallback font on HTML
  $('head').prepend(
    `<style> body { font-family: ${fallbackFont.fontName}, _font_fallback, ${heyFont.fallback}; } @font-face { font-family: _font_fallback; size-adjust: ${fallbackFont.sizeAdjust}; src: local('${fallbackFont.fallbackFont}'); ascent-override: ${fallbackFont.ascentOverride}; descent-override: ${fallbackFont.descentOverride}; line-gap-override: ${fallbackFont.lineGapOverride}; }</style>`
  );

  // Prepend all fonts
  for (const i of heyFont.src) {
    $('head').prepend(
      `<style> @font-face { font-style: ${i.style}; font-weight: ${
        i.weight
      }; font-display: ${heyFont.display}; font-family: ${
        fallbackFont.fontName
      }; src: url(/${relative(
        join(process.cwd(), 'public'),
        i.path
      )}); } </style>`
    );
  }

  // If preload is enabled, insert preload scripts
  if (heyFont.preload) {
    for (const i of heyFont.src) {
      $('head').prepend(
        `<link as="font" crossorigin="anonymous" type="font/${getFontType(
          i.path
        )}" rel="preload" href="/${relative(
          join(process.cwd(), 'public'),
          i.path
        )}" />`
      );
    }
  }

  // Prerendered HTML
  writeFileSync(
    join(appDir, 'dist', 'index.html'),
    htmlMinifier.minify($.html(), {
      collapseWhitespace: true
    }),
    'utf8'
  );
  vite.close();
};

prerender();
