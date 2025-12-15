
const container = document.getElementById('experiments');
const previewContainer = document.getElementById('preview');
const previewImg = document.getElementById('preview-img');

fetch('https://docs.google.com/spreadsheets/d/1sJzBnjGizMoseiMmSLoQ8uapEeGBtQPBYJLJknT94tU/gviz/tq?tqx=out:json')
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

    // 1️⃣ Render experiments
    projects.forEach(p => {
      const el = document.createElement('article');
      el.className = 'exp';
      el.dataset.preview = p.preview_url || '';

      el.innerHTML = `
        <a class="title" href="${p.url}">${p.title}</a>
        <p class="meta">${p.labels || ''}${p.status ? ' / ' + p.status : ''}</p>
        <p class="desc">${p.description || ''}</p>
      `;

      container.appendChild(el);
    });

    // 2️⃣ Attach hover events AFTER rendering
    attachHoverPreviews();
  });

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

// const sheetURL =
//   'https://docs.google.com/spreadsheets/d/1sJzBnjGizMoseiMmSLoQ8uapEeGBtQPBYJLJknT94tU/gviz/tq?tqx=out:json';

// const container = document.getElementById('experiments');

// fetch(sheetURL)
//   .then(res => res.text())
//   .then(text => {
//     const json = JSON.parse(text.substring(47).slice(0, -2));
//     const rows = json.table.rows;

//   const projects = rows.map(r => ({
//   slug: r.c[0]?.v,
//   title: r.c[1]?.v,
//   labels: r.c[2]?.v,
//   description: r.c[3]?.v,
//   url: r.c[4]?.v,
//   preview_url: r.c[5]?.v,   // added column
//   notes: r.c[6]?.v,
//   status: r.c[7]?.v
// }));

//     renderProjects(projects);
//     observeScroll();
//   });

// function renderProjects(projects) {
//   container.innerHTML = '';

//   projects.forEach(p => {
//     if (!p.title || !p.url) return;

//     const el = document.createElement('article');
//     el.className = 'exp';

//     el.innerHTML = `
//       <a class="title" href="${p.url}">
//         ${p.title}
//       </a>
//       <p class="meta">
//         ${p.labels || ''}${p.status ? ' / ' + p.status : ''}
//       </p>
//       ${p.description ? `<p class="desc">${p.description}</p>` : ''}
//     `;

//     container.appendChild(el);
//   });
// }

// function observeScroll() {
//   const entries = document.querySelectorAll('.exp');

//   const observer = new IntersectionObserver(
//     items => {
//       items.forEach(item => {
//         if (item.isIntersecting) {
//           item.target.classList.add('visible');
//         }
//       });
//     },
//     { threshold: 0.2 }
//   );

//   entries.forEach(el => observer.observe(el));
// }

// const container = document.getElementById('experiments');
// const previewContainer = document.getElementById('preview');
// const previewImg = document.getElementById('preview-img');

// fetch('https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json')
//   .then(res => res.text())
//   .then(text => {
//     const json = JSON.parse(text.substring(47).slice(0, -2));
//     const rows = json.table.rows;

//     const projects = rows.map(r => ({
//       slug: r.c[0]?.v,
//       title: r.c[1]?.v,
//       labels: r.c[2]?.v,
//       description: r.c[3]?.v,
//       url: r.c[4]?.v,
//       preview_url: r.c[5]?.v,
//       notes: r.c[6]?.v,
//       status: r.c[7]?.v
//     }));

//     // 1️⃣ Render experiments
//     projects.forEach(p => {
//       const el = document.createElement('article');
//       el.className = 'exp';
//       el.dataset.preview = p.preview_url || '';

//       el.innerHTML = `
//         <a class="title" href="${p.url}">${p.title}</a>
//         <p class="meta">${p.labels || ''}${p.status ? ' / ' + p.status : ''}</p>
//         <p class="desc">${p.description || ''}</p>
//       `;

//       container.appendChild(el);
//     });

//     // 2️⃣ Attach hover events AFTER rendering
//     attachHoverPreviews();
//   });

// function attachHoverPreviews() {
//   document.querySelectorAll('.exp').forEach(exp => {
//     const imgUrl = exp.dataset.preview;
//     const title = exp.querySelector('.title');

//     title.addEventListener('mouseenter', () => {
//       if (!imgUrl) return;
//       previewImg.src = imgUrl;
//       previewContainer.style.display = 'block';
//     });

//     title.addEventListener('mouseleave', () => {
//       previewContainer.style.display = 'none';
//       previewImg.src = '';
//     });
//   });
// }
