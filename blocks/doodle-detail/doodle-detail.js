export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'doodle-detail';

  // Create illustration container
  const illustrationContainer = document.createElement('div');
  illustrationContainer.className = 'illustration-container';

  // Add illustration image
  const illustration = document.createElement('img');
  illustration.setAttribute('data-aue-prop', 'illustration');
  illustration.setAttribute('data-aue-type', 'image');
  illustration.src = '/path/to/doodle.jpg';
  illustration.alt = 'Illustration of someone working on laptop';
  illustrationContainer.appendChild(illustration);

  // Add artist credit
  const credit = document.createElement('p');
  credit.className = 'artist-credit';
  credit.setAttribute('data-aue-prop', 'artistCredit');
  credit.setAttribute('data-aue-type', 'text');
  credit.textContent = 'DOODLE BY JATISH KUMAR';

  // Add description
  const description = document.createElement('p');
  description.className = 'description';
  description.setAttribute('data-aue-prop', 'description');
  description.setAttribute('data-aue-type', 'text');
  description.textContent = 'Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.';

  // Assemble block
  wrapper.appendChild(illustrationContainer);
  wrapper.appendChild(credit);
  wrapper.appendChild(description);
  block.appendChild(wrapper);
}