---
paths:
  - "src/ui.js"
---

# Frontend standards

- **Structure:** the chat page is one HTML string in `src/ui.js`, served by `GET /`. Restyle or replace it freely; if it grows into a real app, move it to static assets and record the decision in `docs/DECISIONS.md`.
- **Talk to the backend only through your own API** (`/api/...`). Never call third-party APIs with secrets from the browser.
- **Always handle loading, empty and error states.** Nobody should stare at a blank screen. Show streamed `error` events plainly.
- **Escape anything the model or user wrote** before putting it in the page. Model output is untrusted.
- **Reuse the existing styles** before adding new ones. Keep the look consistent.
- **Accessible by default:** real `<button>`s and `<label>`s, alt text, readable contrast, visible focus, `lang` set.
- Check UI changes at desktop and phone width before pushing (`testing.md`).
