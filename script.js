// DOM
const lab = document.getElementById('lab');
const toggleBtn = document.getElementById('toggle-view');
const container = document.getElementById('experiments');
const previewImg = document.getElementById('preview-img');
const readPanel = document.getElementById('read-panel');
const panelContent = document.getElementById('panel-content');
const closePanel = document.getElementById('close-panel');

// STATE
let isImageFirst = false;
let PROJECTS = [];

// -------------------- TOGGLE VIEW --------------------
toggleBtn.addEventListener('click', () => {
  isImageFirst = !isImageFirst;
  lab.classList.toggle('image-first', isImageFirst);
  lab.classList.toggle('text-first', !isImageFirst);
  toggleBtn.textContent = isImageFirst ? 'List' : 'Cards';

  if (isImageFirst) previewImg.src = '';
});



// When the user clicks on div, open the popup
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

// -------------------- FETCH GOOGLE SHEET --------------------
const sheetURL = 'https://docs.google.com/spreadsheets/d/1sJzBnjGizMoseiMmSLoQ8uapEeGBtQPBYJLJknT94tU/gviz/tq?tqx=out:json&sheet=Sheet1';

fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    PROJECTS = json.table.rows.map(r => ({
  slug: r.c[0]?.v || '',
  title: r.c[1]?.v || '',
  labels: r.c[2]?.v || '',
  description: r.c[3]?.v || '',
  url: r.c[4]?.v || '#',
  preview: r.c[5]?.v || '',
  notes: r.c[6]?.v || r.c[6]?.f || '',
  iframe: r.c[7]?.v || ''
}));

    renderProjects(PROJECTS);
  })
  .catch(err => console.error('Sheet fetch failed:', err));

// -------------------- RENDER PROJECTS --------------------
function renderProjects(projects) {
  container.innerHTML = '';

  projects.forEach(p => {
    const el = document.createElement('article');
    el.className = 'exp';
    el.dataset.slug = p.slug;
    el.dataset.labels = p.labels.toLowerCase(); // store labels for filtering

    // Split labels into array
    const tagsArray = p.labels ? p.labels.split(',').map(t => t.trim()) : [];

    el.innerHTML = `
      <div class="card-image" style="background-image:url('${p.preview}')"></div>
      <div class="title-tag"><p class="title">${p.title}</p>
      <div class="tags">
        ${tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div></div>
      <p class="desc">${p.description}</p>
      
     
    `;

   // Hover preview (text-first only)
    el.addEventListener('mouseenter', () => {
      if (!isImageFirst && p.preview) previewImg.src = p.preview;
    });

    // CLICK ENTIRE CARD
    el.addEventListener('click', () => {
      openReadPanel(p);
    });

    container.appendChild(el);
  });
}

// -------------------- RENDER TAG FILTERS --------------------
function renderTagFilters(projects) {
  const tagFilterContainer = document.getElementById('tag-filter');
  tagFilterContainer.innerHTML = '';

  // Create Reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'tag-filter-btn reset';
  resetBtn.textContent = 'Reset filter';
  resetBtn.addEventListener('click', () => {
    showAllProjects();
    document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
  });
  tagFilterContainer.appendChild(resetBtn);

  // Collect unique tags
  const allTags = new Set();
  projects.forEach(p => {
    if (p.labels) {
      p.labels.split(',').forEach(tag => allTags.add(tag.trim()));
    }
  });

  // Render tag buttons
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-filter-btn';
    btn.textContent = tag;

    btn.addEventListener('click', () => {
      // Toggle active class
      const currentlyActive = btn.classList.contains('active');
      document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
      if (!currentlyActive) btn.classList.add('active');

      // Filter projects
      if (currentlyActive) {
        showAllProjects();
      } else {
        filterByTag(tag);
      }
    });

    tagFilterContainer.appendChild(btn);
  });
}

// // -------------------- FILTER BY TAG --------------------
// function renderTagFilters(projects) {
//   const tagFilterContainer = document.getElementById('tag-filter');
//   tagFilterContainer.innerHTML = '';

//   // Collect unique tags
//   const allTags = new Set();
//   projects.forEach(p => {
//     if (p.labels) {
//       p.labels.split(',').forEach(tag => allTags.add(tag.trim()));
//     }
//   });

//   // Render buttons
//   allTags.forEach(tag => {
//     const btn = document.createElement('button');
//     btn.className = 'tag-filter-btn';
//     btn.textContent = tag;

//     btn.addEventListener('click', () => {
//       // Toggle active class
//       const currentlyActive = btn.classList.contains('active');
//       document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
//       if (!currentlyActive) btn.classList.add('active');

//       // Filter projects
//       if (currentlyActive) {
//         showAllProjects();
//       } else {
//         filterByTag(tag);
//       }
//     });

//     tagFilterContainer.appendChild(btn);
//   });
// }

// -------------------- OPEN READ PANEL --------------------
function openReadPanel(project) {
  panelContent.innerHTML = `
    <h2>${project.title}</h2>
    ${project.labels ? `<p>${project.labels}</p>` : ''}
   
    ${project.notes ? `<div>${project.notes.replace(/\n/g,'<br>')}</div>` : '<p style="opacity:.5">No notes yet.</p>'}
    ${project.iframe ? `<div class="iframe-wrapper">${project.iframe}</div>` : ''}
  `;
  readPanel.classList.add('open');
}


// -------------------- CLOSE PANEL --------------------
closePanel.addEventListener('click', () => {
  readPanel.classList.remove('open');
});


fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    PROJECTS = json.table.rows.map(r => ({
      slug: r.c[0]?.v || '',
      title: r.c[1]?.v || '',
      labels: r.c[2]?.v || '',
      description: r.c[3]?.v || '',
      url: r.c[4]?.v || '#',
      preview: r.c[5]?.v || '',
      notes: r.c[6]?.v || '',
      iframe: r.c[7]?.v || ''
    }));

    renderProjects(PROJECTS);
    renderTagFilters(PROJECTS); // <-- make sure this runs
  });


fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    PROJECTS = json.table.rows.map(r => ({
      slug: r.c[0]?.v || '',
      title: r.c[1]?.v || '',
      labels: r.c[2]?.v || '',
      description: r.c[3]?.v || '',
      url: r.c[4]?.v || '#',
      preview: r.c[5]?.v || '',
      notes: r.c[6]?.v || r.c[6]?.f || '',
      iframe: r.c[7]?.v || ''
    }));

    renderProjects(PROJECTS);
    renderTagFilters(PROJECTS);
  })
  .catch(err => console.error('Sheet fetch failed:', err));

function filterByTag(tag) {
  document.querySelectorAll('.exp').forEach(card => {
    const labels = card.dataset.labels; // lowercase labels stored in renderProjects
    if (labels.includes(tag.toLowerCase())) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function showAllProjects() {
  document.querySelectorAll('.exp').forEach(card => {
    card.style.display = '';
  });
}


