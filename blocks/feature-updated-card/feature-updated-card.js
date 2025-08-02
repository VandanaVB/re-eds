// block.js
function decorate(block) {
  const welcomeTitle = document.createElement('h1');
  welcomeTitle.className = 'welcome-title';
  welcomeTitle.innerHTML = `Welcome to <span class="brand">LetsBoing</span>!`;
  
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';
  
  // Create cards dynamically based on content model
  block.querySelectorAll('.card').forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    cardImage.style.backgroundImage = `url(${cardData.image})`;
    
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    const title = document.createElement('h2');
    title.textContent = cardData.title;
    
    const description = document.createElement('p');
    description.textContent = cardData.description;
    
    const button = document.createElement('button');
    button.textContent = 'Know More';
    button.className = 'know-more-btn';
    
    cardContent.append(title, description, button);
    card.append(cardImage, cardContent);
    cardsContainer.append(card);
  });
  
  block.append(welcomeTitle, cardsContainer);
}