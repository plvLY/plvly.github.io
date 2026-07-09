import { d as defineEventHandler, $ as $fetch } from '../../_/nitro.mjs';
import 'unified';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'detab';
import 'micromark-util-sanitize-uri';
import 'hast-util-to-string';
import 'github-slugger';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@netlify/blobs';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'node:crypto';

let cached = null;
let cacheTime = 0;
const CACHE_TTL = 6e4;
const ipUtils = defineEventHandler(async () => {
  if (cached && Date.now() - cacheTime < CACHE_TTL) {
    return cached;
  }
  try {
    const address = await $fetch("https://webapi-pc.meitu.com/common/ip_location", {
      retry: 1,
      retryDelay: 500
    });
    cached = address;
    cacheTime = Date.now();
    return address;
  } catch {
    return null;
  }
});

export { ipUtils as default };
//# sourceMappingURL=ip-utils.mjs.map
