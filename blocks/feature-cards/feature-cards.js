// blocks/feature-cards/feature-cards.js
export default function decorate(block) {
  const cards = [];
  [...block.children].forEach((row) => {
    const card = document.createElement('div');
    card.className = 'feature-card';
    
    const image = document.createElement('div');
    image.className = 'card-image';
    image.innerHTML = row.children[0].innerHTML;
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = row.children[1].textContent;
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = row.children[2].textContent;
    
    const cta = document.createElement('a');
    cta.className = 'card-cta';
    cta.href = row.children[3].querySelector('a')?.href || '#';
    cta.textContent = 'Know More';
    
    content.append(title, description, cta);
    card.append(image, content);
    cards.push(card);
  });
  
  block.textContent = '';
  block.append(...cards);
}