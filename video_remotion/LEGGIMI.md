# Video con Remotion

Modello «PizzaPip»: video vero della pizza a tutto schermo, avatar di Davide in un cerchio in basso a destra,
scritta in alto con il verdetto animato. 1080×1920, 30 fps.

Uso:
1. `npm install`
2. mettere in `public/` i file `pizza.mp4` (video vero, h264 verticale) e `avatar.mp4` (HeyGen, con l'audio)
3. `npx remotion render src/index.jsx PizzaPip out/reel.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`

Titolo e verdetto si cambiano con `--props='{"titolo":"...","verdetto":"FALSO."}'`.
Licenza Remotion: gratuita per singoli e aziende fino a 3 persone.
