document.addEventListener('DOMContentLoaded', () => {
  const mermaidDiagrams = document.querySelectorAll('.mermaid');

  if (mermaidDiagrams.length === 0) return;

  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'mermaid-modal';
  modal.style.display = 'none';

  const modalContent = document.createElement('div');
  modalContent.className = 'mermaid-modal-content';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'mermaid-modal-close';
  closeBtn.innerHTML = '&times;';

  modal.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close modal functionality
  const closeModal = () => {
    modal.style.display = 'none';
    modalContent.innerHTML = ''; // Clear content
    document.body.style.overflow = ''; // Restore scrolling
  };

  closeBtn.onclick = closeModal;

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Add click listeners to diagrams
  mermaidDiagrams.forEach((diagram) => {
    diagram.style.cursor = 'pointer';
    diagram.setAttribute('title', 'Click to view full screen');

    diagram.addEventListener('click', () => {
      const svgContent = diagram.innerHTML;
      modalContent.innerHTML = svgContent;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });
});
