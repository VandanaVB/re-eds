export default async function decorate(block) {
  const rows = [...block.children];

  // Add "Ride" heading above the grid (matches original section heading)
  const heading = document.createElement('h2');
  heading.className = 'tabs-showcase-heading';
  heading.textContent = 'Ride';

  // Build a grid of tiles from the tab data
  const grid = document.createElement('div');
  grid.className = 'tabs-showcase-grid';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const titleCol = cols[0];
    const contentCol = cols[1];

    const title = titleCol?.querySelector('p')?.textContent?.trim()
      || titleCol?.textContent?.trim() || '';

    // Extract image from content column (picture or img)
    const picture = contentCol?.querySelector('picture');
    const img = contentCol?.querySelector('img');

    // Extract description (first p that isn't the link paragraph or image paragraph)
    const paragraphs = [...(contentCol?.querySelectorAll('p') || [])];
    const descP = paragraphs.find((p) => !p.querySelector('a') && !p.querySelector('img') && p.textContent.trim());
    const desc = descP?.textContent?.trim() || '';

    const link = contentCol?.querySelector('a');

    const tile = document.createElement('a');
    tile.className = 'tabs-showcase-tile';
    tile.href = link?.href || '#';
    // First and third tiles span 2 rows
    if (i === 0 || i === 2) {
      tile.classList.add('tile-tall');
    }

    // Background image — reuse existing picture/img from content
    if (picture || img) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'tabs-showcase-tile-image';
      if (picture) {
        imageWrap.append(picture);
      } else {
        imageWrap.append(img);
      }
      tile.append(imageWrap);
    }

    // Content overlay at bottom of tile
    const overlay = document.createElement('div');
    overlay.className = 'tabs-showcase-tile-overlay';

    const titleEl = document.createElement('span');
    titleEl.className = 'tabs-showcase-tile-title';
    titleEl.textContent = title;
    overlay.append(titleEl);

    if (desc) {
      const descEl = document.createElement('span');
      descEl.className = 'tabs-showcase-tile-desc';
      descEl.textContent = desc;
      overlay.append(descEl);
    }

    const cta = document.createElement('span');
    cta.className = 'tabs-showcase-tile-cta';
    cta.textContent = link?.textContent?.trim() || 'EXPLORE';
    overlay.append(cta);

    tile.append(overlay);
    grid.append(tile);
  });

  block.textContent = '';
  block.append(heading);
  block.append(grid);
}
