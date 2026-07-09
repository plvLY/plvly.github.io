import { d as defineEventHandler } from '../../../_/nitro.mjs';
import { getStore } from '@netlify/blobs';
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
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const query = defineEventHandler(async () => {
  try {
    const store = getStore("plv-blog");
    const raw = await store.get("messages", { type: "json" });
    return { rows: raw != null ? raw : [] };
  } catch (error) {
    return { rows: [], error: "\u7559\u8A00\u52A0\u8F7D\u5931\u8D25" };
  }
});

export { query as default };
//# sourceMappingURL=query.mjs.map
