function showSection(sectionId, btn) {
    document.querySelectorAll('section').forEach(function(sec) {
      sec.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('nav button').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    window.scrollTo(0, 0);
  }

  function toggleTopic(headerEl) {
    var card = headerEl.parentElement;
    card.classList.toggle('open');
  }

  function showSubtab(btn, panelName) {
    var topicBody = btn.closest('.topic-body');
    topicBody.querySelectorAll('.subtab-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    topicBody.querySelectorAll('.subtab-panel').forEach(function(p) {
      p.classList.remove('active');
    });
    btn.classList.add('active');
    topicBody.querySelector('[data-panel="' + panelName + '"]').classList.add('active');
  }

  function toggleAnswer(btn) {
    var answerEl = btn.nextElementSibling;
    answerEl.classList.toggle('shown');
    btn.textContent = answerEl.classList.contains('shown') ? 'Hide Answer' : 'Show Answer';
  }

  // Flashcard flip: swaps the visible text between the question (data-q)
  // and the answer (data-a) stored on the element itself.
  function flipCard(cardEl) {
    var showingAnswer = cardEl.classList.toggle('showing-answer');
    var label = cardEl.querySelector('.fc-label');
    var contentEl = cardEl.querySelector('.fc-content');
    if (showingAnswer) {
      label.textContent = 'Answer';
      contentEl.innerHTML = cardEl.getAttribute('data-a');
    } else {
      label.textContent = 'Question';
      contentEl.innerHTML = cardEl.getAttribute('data-q');
    }
  }
