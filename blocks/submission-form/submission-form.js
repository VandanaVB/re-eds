// submission-confirmation.js
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'submission-form';

  // Success icon
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'success-icon';
  const thumbsUp = document.createElement('div');
  thumbsUp.className = 'thumbs-up-icon';
  iconWrapper.appendChild(thumbsUp);

  // Thank you message
  const message = document.createElement('h2');
  message.textContent = block.message || 'Thank you for your submission!';

  // Submission card
  const card = document.createElement('div');
  card.className = 'submission-card';
  card.innerHTML = `
    <div class="card-image">
      <img src="${block.submissionImage}" alt="Submission illustration">
    </div>
    <div class="card-details">
      <h3>${block.submitterName}</h3>
      <span class="submission-id">#${block.submissionId}</span>
      <p>${block.description}</p>
    </div>
  `;

  // Gallery link
  const galleryLink = document.createElement('a');
  galleryLink.href = block.galleryUrl;
  galleryLink.className = 'gallery-link';
  galleryLink.textContent = 'View Gallery';

  // Explore section
  const exploreSection = document.createElement('div');
  exploreSection.className = 'explore-section';
  exploreSection.innerHTML = `
    <h2>ALSO EXPLORE</h2>
    <div class="explore-cards"></div>
    <div class="explore-dots"></div>
  `;

  container.append(iconWrapper, message, card, galleryLink, exploreSection);
  block.textContent = '';
  block.append(container);
}