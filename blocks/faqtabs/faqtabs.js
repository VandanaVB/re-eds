/**
 * Decorates the FAQ Tabs block.
 * @param {Element} block The FAQ Tabs block element.
 */
export default async function decorate(block) {
  // First div is assumed to be the tab title.
  const tabTitleWrapper = block.children[0];
  const tabTitle = tabTitleWrapper.querySelector('p').textContent;

  // Create a container for the tab content.
  const tabContent = document.createElement('div');
  tabContent.classList.add('faq-content');

  // The rest of the divs are the question-answer pairs.
  const rows = Array.from(block.children).slice(1);
  rows.forEach((row) => {
    const questionEl = row.children[0];
    const answerEl = row.children[1];

    if (questionEl && answerEl) {
      // Create a wrapper for each FAQ item.
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');

      const question = document.createElement('h3');
      question.classList.add('faq-question');
      question.innerHTML = questionEl.innerHTML; // Use innerHTML to preserve rich text formatting.

      const answer = document.createElement('div');
      answer.classList.add('faq-answer');
      answer.innerHTML = answerEl.innerHTML; // Use innerHTML to preserve rich text formatting.

      faqItem.append(question, answer);
      tabContent.append(faqItem);
    }
    row.remove(); // Remove the original, undecorated row.
  });

  // Clear the block and append the new, structured content.
  block.textContent = '';
  // Re-add the title or create a new tab button structure
  const titleElement = document.createElement('h2');
  titleElement.textContent = tabTitle;
  block.append(titleElement, tabContent);
}
