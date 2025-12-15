const sheetURL =
  'https://docs.google.com/spreadsheets/d/1sJzBnjGizMoseiMmSLoQ8uapEeGBtQPBYJLJknT94tU/edit?usp=sharing';

const container = document.getElementById('experiments');

fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const projects = rows.map(r => ({
      slug: r.c[0]?.v,
      title: r.c[1]?.v,
      labels: r.c[2]?.v,
      description: r.c[3]?.v,
      url: r.c[4]?.v,
      notes: r.c[5]?.v,
      status: r.c[6]?.v
    }));

    renderProjects(projects);
    observeScroll();
  });

function renderProjects(projects) {
  container.innerHTML = '';

  projects.forEach(p => {
    if (!p.title || !p.url) return;

    const el = document.createElement('article');
    el.className = 'exp';

    el.innerHTML = `
      <a class="title" href="${p.url}">
        ${p.title}
      </a>
      <p class="meta">
        ${p.labels || ''}${p.status ? ' / ' + p.status : ''}
      </p>
      ${p.description ? `<p class="desc">${p.description}</p>` : ''}
    `;

    container.appendChild(el);
  });
}

function observeScroll() {
  const entries = document.querySelectorAll('.exp');

  const observer = new IntersectionObserver(
    items => {
      items.forEach(item => {
        if (item.isIntersecting) {
          item.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  entries.forEach(el => observer.observe(el));
}
