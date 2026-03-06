# SPA Routing Safety Guide

This project uses client-side routing. To avoid `404` on page refresh in production:

1. Keep server rewrite/fallback enabled (`/* -> /index.html`).
2. If a platform does not support rewrites, use hash routing.

## Included rewrite configs

- Apache/Hostinger: `public/.htaccess`
- Netlify: `public/_redirects` and `netlify.toml`
- Vercel: `vercel.json`
- IIS/Azure App Service: `public/web.config`

## Hash router fallback mode (works almost everywhere)

Set:

`REACT_APP_ROUTER_MODE=hash`

Then rebuild and deploy. URLs become:

`https://example.com/#/about-us`

This mode avoids server rewrite dependency.

