// Recursive HTML include loader that resolves nested includes relative to the parent file.
// Usage: <div data-include="./components/header/header.html"></div>

async function includeHTML(root = document, baseUrl = document.location.href) {
  const els = Array.from(root.querySelectorAll('[data-include]'));
  await Promise.all(els.map(async el => {
    const src = el.getAttribute('data-include');
    if (!src) return;

    // Resolve the include URL relative to the provided baseUrl
    const fetchUrl = new URL(src, baseUrl).href;
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        console.error(`Include failed (${res.status}) for: ${fetchUrl}`);
        return;
      }
      const html = await res.text();
      el.innerHTML = html;
      el.removeAttribute('data-include');

      // Compute the base directory for any nested includes inside this fetched file
      const newBase = new URL('.', fetchUrl).href;
      // Process nested includes inside the newly injected content using the new base
      await includeHTML(el, newBase);
    } catch (err) {
      console.error(`Error including ${fetchUrl}:`, err);
    }
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML().catch(err => console.error('includeHTML error:', err));
});