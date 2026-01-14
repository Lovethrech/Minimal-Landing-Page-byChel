// Simple recursive HTML include loader for elements with `data-include`.
// Usage: <div data-include="./components/header/header.html"></div>
async function includeHTML(root = document) {
  const els = Array.from(root.querySelectorAll('[data-include]'));
  await Promise.all(els.map(async el => {
    const src = el.getAttribute('data-include');
    if (!src) return;
    try {
      const res = await fetch(src);
      if (!res.ok) {
        console.error(`Include failed (${res.status}) for: ${src}`);
        return;
      }
      const html = await res.text();
      el.innerHTML = html;
      el.removeAttribute('data-include');
      // Process nested includes inside the newly injected content
      await includeHTML(el);
    } catch (err) {
      console.error(`Error including ${src}:`, err);
    }
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML().catch(err => console.error('includeHTML error:', err));
});