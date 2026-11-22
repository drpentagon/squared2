---
description: Pull the live database down over the local one, apply any changes, then push database and code back up to Railway
---

Release squared2. The deployed app is edited in the browser, so the live database is normally the newer side. There is no merge anywhere in this flow — only copying, and whichever side is written second wins.

## 1. Pull the live database down

Back up both sides first, timestamped. This is the only thing that recovers a wrong-direction copy.

```
cp server/data/squared2.db ~/railway-backups/squared2-lokal-$(date +%Y%m%d-%H%M%S).db
railway volume files --volume squared-volume download /data/squared2.db ~/railway-backups/squared2-railway-$(date +%Y%m%d-%H%M%S).db
```

`--volume` belongs on `files`, not on the subcommand.

Verify the download before trusting it: `PRAGMA integrity_check`, the level count, and the chain order. Then compare against the local one and report what differs, so Martin sees which side had unreleased work.

Stop the local server before replacing the file, and restart it afterwards:

```
pkill -f "tsx watch src/app.ts"
cp <downloaded file> server/data/squared2.db
npm run server
```

## 2. Apply database changes

Whatever this release needs. Often nothing. If a schema change is involved it belongs in `server/src/db.ts`, which runs its migrations at startup.

## 3. Push database and code up

Commit and push first, so what is live corresponds to a commit. Straight to main.

Upload the database **before** deploying:

```
railway volume files --volume squared-volume upload server/data/squared2.db /data/squared2.db --overwrite
railway up --detach
```

Then wait for the deploy and verify.

## Why the order matters

**Stop the local server before swapping its file.** better-sqlite3 holds the database open. Writing over it leaves the running process reading the deleted inode, so it keeps serving the old levels with no error at all.

**Upload before deploying.** The old container holds its own open handle, and the restart that the deploy performs is what makes the uploaded file take effect. Uploading after a deploy means the new file is ignored until something else restarts the service.

**Compare content, not checksums.** The file changes as soon as a server opens it, because `db.ts` runs migrations at startup. Level count and chain order from `/api/levels` are what actually tell you anything.

## Verify when done

- `/`, `/styles.css`, `/dist/main.js`, `/fonts/miso.woff` all answer 200 at https://squared-production-e62024dc.up.railway.app
- `/api/levels` returns the same count and the same chain order locally and live
- Anything new in this release is actually in the deployed bundle

## The deployment

Project `zooming-enchantment`, service `squared`, volume `squared-volume` mounted at `/data`, `DATA_DIR=/data`. The database is `/data/squared2.db` remotely and `server/data/squared2.db` locally — gitignored, so the local file is the only copy of local-only work.
