# Dynamický konfigurátor scén

Backend pro https://github.com/Czechitas-podklady-WEB/Konfigurator-slidu

## Scény

```bash
npm ci && GOOGLE_API_KEY='AI…' SHEET_ID='12gf…' npm start
```

- Úvodní: http://localhost:3000/?scene=intro
- Přestávka: http://localhost:3000/?scene=break
- Konec: http://localhost:3000/?scene=outro

---

- Vlastní datum: http://localhost:3000/?date=16.9.2020

### Veřejné adresy

- Úvodní: https://czechitas-scene.netlify.app/.netlify/functions/server?scene=intro
- Přestávka: https://czechitas-scene.netlify.app/.netlify/functions/server?scene=break
- Konec: https://czechitas-scene.netlify.app/.netlify/functions/server?scene=outro

## Potřebné env proměnné:

- GOOGLE_API_KEY (https://developers.google.com/sheets/api/quickstart/nodejs)
- SHEET_ID (lze získat z adresního řádku tabulky)
