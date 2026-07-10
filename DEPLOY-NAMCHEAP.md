# Deploy to milesaguilar.com/GYWP (Namecheap)

## Upload

1. Log in to **Namecheap** → **Hosting List** → **Manage** → **cPanel**
2. Open **File Manager** → `public_html`
3. Create folder **`GYWP`** if it does not exist
4. Open **`public_html/GYWP`**
5. Upload **`milesaguilar.com-GYWP-deploy.zip`**
6. Select the zip → **Extract**
7. Delete the zip from the server when done

Extract so these sit directly in `public_html/GYWP/`:

- `index.html`
- `hub.html`
- `chapters/`
- `assets/`
- `favicon.ico`
- `.htaccess`

## URLs after deploy

| Page | URL |
|------|-----|
| Home (NFL dashboard) | https://milesaguilar.com/GYWP/ |
| Chapter hub | https://milesaguilar.com/GYWP/hub.html |
| Chapters | https://milesaguilar.com/GYWP/chapters/chapter-01.html … |

## Rebuild locally

```bash
npm install
npm run build
cd dist && zip -r ../milesaguilar.com-GYWP-deploy.zip . && cd ..
```

Local preview at the same path:

```bash
npm run build && npm run preview
# open http://localhost:4173/GYWP/
```

## Notes

- No API keys required. NFL scores use ESPN’s public browser feed.
- If the scoreboard is empty in production, ESPN may be blocking the request from your domain; check the browser console on the home page.
