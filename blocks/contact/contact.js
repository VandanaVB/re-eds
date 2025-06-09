export default function decorate(block) {
  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = 'contact-item';
    const [titleDiv, textDiv] = [...row.children];
    if (titleDiv) {
      const title = document.createElement('div');
      title.className = 'contact-title';
      title.innerHTML = titleDiv.innerHTML;
      item.append(title);
    }
    if (textDiv) {
      const text = document.createElement('div');
      text.className = 'contact-text';
      text.innerHTML = textDiv.innerHTML;
      item.append(text);
    }
    row.replaceWith(item);
  });
}
