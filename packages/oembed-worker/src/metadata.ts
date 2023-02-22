import * as cheerio from 'cheerio/lib/slim';

type Meta = { [key: string]: string | undefined };

const readMetatag = (el: any, name: string) => {
  const prop = el.attr('name') || el.attr('property') || el.attr('itemprop');
  return prop == name ? el.attr('content') : null;
};

const getMetaTags = async (url: string, requestInit?: Request | RequestInit | undefined) => {
  if (!/(^http(s?):\/\/[^\s#$.?].\S*)/i.test(url)) {
    return {};
  }

  const response = await fetch(url, requestInit);
  const body = await response.text();
  const $ = cheerio.load(body);
  let og: Meta = {};

  const metas: any = $('meta');
  for (const el of metas) {
    for (const s of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
      const val = readMetatag($(el), s);
      if (val) {
        og[s.split(':')[1]] = val;
      }
    }
  }

  return { og };
};

export default getMetaTags;
