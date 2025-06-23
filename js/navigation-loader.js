document.addEventListener('DOMContentLoaded', () => {
  fetch('components/navigation.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('nav-placeholder').innerHTML = html;
    });
});
