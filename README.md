# Eslam | Khaled

The page customers open by scanning the shop's QR code. They can pay (Vodafone Cash, InstaPay), call, message on WhatsApp, save the contact, and follow on Facebook and TikTok.

**Live:** https://ku18m.github.io/eslam-khaled/

Arabic is the default. The toggle at the top switches to English, and the page remembers the choice. `?lang=en` forces English, which is handy for a second QR code.

## Change a link or number

Everything is plain static files with no build step. Edit them, commit, push, and GitHub Pages republishes within a minute.

| What | Where |
|---|---|
| Payment, social, call and WhatsApp links | `index.html`: search for the old URL or number |
| Phone number shown on the Save contact button | `index.html`, `.save__num` |
| Saved contact (name, number, links) | `contact.vcf`. Keep the CRLF line endings. `.gitattributes` protects them. |
| Arabic text | `index.html`, the elements with `data-i18n` |
| English text | `assets/js/main.js`, the `EN` object |
| Colors, fonts, animation | `assets/css/styles.css` |

The InstaPay tile uses a neutral purple lightning mark. To use the official logo, put it in `assets/img/` and replace the `<span class="tile__mark tile__mark--ip">…</span>` in `index.html` with an `<img>`.

## Files

- `index.html`: the page
- `assets/css/styles.css`, `assets/js/main.js`
- `assets/img/`: logo mark (transparent), link-preview image, icons. All are cut from `Logo/Logo.jpeg`.
- `contact.vcf`: the "Save contact" card
- `.nojekyll`: tells GitHub Pages to serve the files as-is

## Publishing (one time)

Go to the repo on GitHub, then **Settings**, then **Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, then choose branch `main`, folder `/ (root)`, and Save.
