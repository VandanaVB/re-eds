export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-locator-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const img = col.querySelector('img');
      if (pic || img) {
        const picWrapper = (pic || img).closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-locator-img-col');
        }
      }
    });
  });
}
