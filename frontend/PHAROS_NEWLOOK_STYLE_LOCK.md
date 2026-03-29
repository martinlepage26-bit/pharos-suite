# PHAROS-NEWLOOK Style Lock

`PHAROS-NEWLOOK` is the only approved public informational style for `https://pharos-ai.ca`.

## Canonical shell

- `frontend/src/pages/Home.js`
- `frontend/src/pages/Home.newlook.css`
- `frontend/src/App.js`

Treat those files as the canonical public shell and route lock for the informational PHAROS surface.

## Routes that must stay on the one-page shell

- `/`
- `/about`
- `/governance`
- `/services`
- `/services/menu`
- `/observatory`
- `/research`
- `/methods`
- `/about/conceptual-method`
- `/assurance`
- `/transparency`
- `/trust`
- `/auditability`
- `/faq`
- `/cases`
- `/library`
- `/connect`
- `/contact`

## Routes allowed to remain distinct

- `/tool`
- `/privacy`
- `/terms`
- `/admin`
- `/portal/*`
- `/game`
- explicit `SurfaceBoundary` routes

## Regression lock

`frontend/src/App.smoke.test.js` is the regression guard. If a public informational route stops rendering the `home-newlook` shell, treat that as a style-boundary regression.
