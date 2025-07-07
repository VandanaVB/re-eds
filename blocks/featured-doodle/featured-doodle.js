// blocks/featured-doodle/featured-doodle.js
export default function decorate(block) {
  const config = readBlockConfig(block);

  const section = document.createElement('section');
  section.className = 'featured-doodle';

  const container = document.createElement('div');
  container.className = 'featured-doodle-container';

  // Title
  const title = document.createElement('h2');
  title.className = 'featured-title';
  title.textContent = config.title || 'DOODLE OF THE WEEK';

  // Card
  const card = document.createElement('div');
  card.className = 'featured-card';

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'featured-image-container';

  const image = document.createElement('img');
  image.className = 'featured-image';
  image.src = config.image || '/placeholder-doodle.jpg';
  image.alt = 'Featured doodle';

  imageContainer.appendChild(image);

  // Content
  const content = document.createElement('div');
  content.className = 'featured-content';

  const authorName = document.createElement('h3');
  authorName.className = 'featured-author';
  authorName.textContent = config.authorName || 'JATISH KUMAR';

  const description = document.createElement('p');
  description.className = 'featured-description';
  description.textContent = config.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  const shareButton = document.createElement('button');
  shareButton.className = 'share-btn';
  shareButton.innerHTML = `
    <span class="share-icon">↗</span>
    ${config.shareButton || 'Share Now'}
  `;

  content.appendChild(authorName);
  content.appendChild(description);
  content.appendChild(shareButton);

  card.appendChild(imageContainer);
  card.appendChild(content);

  container.appendChild(title);
  container.appendChild(card);
  section.appendChild(container);

  block.textContent = '';
  block.append(section);
}

function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        config[name] = col.textContent;
      }
    }
  });
  return config;
}

function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}