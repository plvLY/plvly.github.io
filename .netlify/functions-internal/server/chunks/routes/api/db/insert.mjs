import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
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

const insert = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  if (!body.msg || typeof body.msg !== "string" || body.msg.length > 500) {
    throw createError({ statusCode: 400, statusMessage: "\u65E0\u6548\u7559\u8A00" });
  }
  try {
    const store = getStore("plv-blog");
    const messages = await store.get("messages", { type: "json" }) || [];
    messages.unshift({
      id: crypto.randomUUID(),
      msg: body.msg.trim(),
      ip: (_a = body.ip) != null ? _a : "",
      date: (_b = body.date) != null ? _b : "",
      addr: (_c = body.addr) != null ? _c : ""
    });
    await store.setJSON("messages", messages);
    return { rows: messages };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "\u7559\u8A00\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"
    });
  }
});

export { insert as default };
//# sourceMappingURL=insert.mjs.map
