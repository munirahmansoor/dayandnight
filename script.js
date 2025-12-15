
const sheetURL = 'https://docs.google.com/spreadsheets/d/1sJzBnjGizMoseiMmSLoQ8uapEeGBtQPBYJLJknT94tU/gviz/tq?tqx=out:json';

const container = document.getElementById('experiments');
const previewContainer = document.getElementById('preview');
const previewImg = document.getElementById('preview-img');

// Fetch Google Sheet
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
      preview_url: r.c[5]?.v,
      notes: r.c[6]?.v,
      status: r.c[7]?.v
    }));

    renderProjects(projects);
    attachHoverPreviews();
  })
  .catch(err => console.error('FETCH FAILED:', err));

function renderProjects(projects) {
  container.innerHTML = '';
  projects.forEach(p => {
    const el = document.createElement('article');
    el.className = 'exp';
    el.dataset.preview = p.preview_url || '';
    el.dataset.url = p.url || '#';

    el.innerHTML = `
      <a class="title" href="${p.url}" target="_blank">${p.title}</a>
      <p class="meta">${p.labels || ''}${p.status ? ' / ' + p.status : ''}</p>
      ${p.description ? `<p class="desc">${p.description}</p>` : ''}
    `;
    container.appendChild(el);
  });
}

function attachHoverPreviews() {
  document.querySelectorAll('.exp').forEach(exp => {
    const imgUrl = exp.dataset.preview;
    const title = exp.querySelector('.title');

    title.addEventListener('mouseenter', () => {
      if (!imgUrl) return;
      previewImg.src = imgUrl;
      previewContainer.style.display = 'block';
    });

    title.addEventListener('mouseleave', () => {
      previewContainer.style.display = 'none';
      previewImg.src = '';
    });
  });
}

previewContainer.classList.add('show'); // on hover
previewContainer.classList.remove('show'); // on leave

function attachHoverPreviews() {
  document.querySelectorAll('.exp').forEach(exp => {
    const imgUrl = exp.dataset.preview;
    const title = exp.querySelector('.title');

 title.addEventListener('mouseenter', () => {
  if (!imgUrl) return;
  previewImg.src = imgUrl;
  previewContainer.classList.add('show'); // fade in
});

title.addEventListener('mouseleave', () => {
  previewContainer.classList.remove('show'); // fade out
  setTimeout(() => previewImg.src = '', 600); // clear src after fade
});
    });
}
