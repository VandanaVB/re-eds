export default function decorate(block) {
 const container = document.createElement('div');
 container.className = 'open-frame-container';

 const imageWrapper = document.createElement('div');
 imageWrapper.className = 'open-frame-image';

 const illustration = document.createElement('img');
 illustration.setAttribute('loading', 'lazy');
 illustration.setAttribute('alt', 'Collaborative workspace illustration');

 const contentWrapper = document.createElement('div');
 contentWrapper.className = 'open-frame-content';

 const artist = document.createElement('h3');
 artist.className = 'open-frame-artist';

 const description = document.createElement('p');
 description.className = 'open-frame-description';

 // Populate content from block data
 block.querySelectorAll(':scope > div').forEach((row) => {
   const cols = row.querySelectorAll('div');
   if (cols[0].textContent.includes('DOODLE BY')) {
     artist.textContent = cols[0].textContent;
   } else if (cols[0].querySelector('img')) {
     illustration.src = cols[0].querySelector('img').src;
   } else {
     description.textContent = cols[0].textContent;
   }
 });

 imageWrapper.appendChild(illustration);
 contentWrapper.appendChild(artist);
 contentWrapper.appendChild(description);

 container.appendChild(imageWrapper);
 container.appendChild(contentWrapper);
 block.textContent = '';
 block.appendChild(container);
}
