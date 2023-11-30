import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync } from 'fs';
import htmlMinifier from 'html-minifier';
import { join } from 'path';
import { createServer } from 'vite';

import { getFallbackMetricsFromFontFile } from './font';

const appDir = process.cwd();

const vite = await createServer({
  server: {
    middlewareMode: true
  },
  appType: 'custom'
});

// const renderPreloadLink = (file) => {
//   if (file.endsWith('.js')) return `<script defer nomodule src="${file}">`;
// };

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

  // Optimize Fonts
  const fontFallback = getFallbackMetricsFromFontFile(
    join(process.cwd(), 'fonts', 'SofiaProSoftReg-webfont.woff2'),
    'sans-serif'
  );
  $('head').prepend(
    `<style> @font-face { font-family: _font_fallback; src: local('${fontFallback.fallbackFont}'); ascent-override: ${fontFallback.ascentOverride}; descent-override: ${fontFallback.descentOverride}; line-gap-override: ${fontFallback.lineGapOverride}; size-adjust: ${fontFallback.sizeAdjust}; } </style>`
  );

  // Add preloads
  // const manifest = JSON.parse(
  //   readFileSync(join(appDir, 'dist', '.vite', 'ssr-manifest.json'), 'utf8')
  // );
  // const seen = new Set();
  // $('[href*=".js"]').each((i, el) => {
  //   seen.add($(el).attr('href'));
  // });
  // $('[src*=".js"]').each((i, el) => {
  //   seen.add($(el).attr('src'));
  // });
  // for (let o of new Set(Object.values(manifest).flat())) {
  //   if (!seen.has(o)) {
  //     const tmp = renderPreloadLink(o);
  //     if (tmp) $('body').append(tmp);
  //   }
  // }

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
