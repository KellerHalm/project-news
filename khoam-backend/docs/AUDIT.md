# Backend audit

Проверено после последнего изменения:

- public news/category endpoints remain unauthenticated;
- JWT Bearer authentication is used consistently;
- editor ownership is checked on editor news operations;
- blocked editors cannot publish;
- admin can change any news status;
- category deletion is blocked while a news item references it;
- `content` is optional;
- `excerpt` max length is 5000;
- `medias` max length is 8;
- Channel model/references are removed;
- local uploaded files are tracked through `MediaAsset`;
- uploaded media can be explicitly deleted;
- media deletion checks ownership and refuses deletion while the file is still referenced;
- removed local media is automatically cleaned up when no longer referenced;
- deleting a news item cleans its local media;
- deleting editor drafts cleans their local media;
- external media URLs are never deleted;
- upload filenames are generated from MIME type instead of the client filename;
- uploaded static files are served with `X-Content-Type-Options: nosniff`;
- pagination values are normalized to finite integers;
- Postman collection contains media deletion request and `mediaId` variable.

Runtime note: dependency installation could not complete in the execution environment because `npm install` timed out, and MongoDB was not available here. TypeScript parsing was checked with the installed global compiler; the remaining compiler diagnostics are dependency/type-package resolution errors caused by missing `node_modules`, not reported runtime results.
