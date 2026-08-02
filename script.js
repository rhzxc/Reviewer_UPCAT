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

  // ===== PROGRESS TRACKER =====
  // Stored in localStorage as a simple object: { "A1.1": true, "C2.3": true, ... }
  function getProgress() {
    var raw = localStorage.getItem('upcatProgress');
    return raw ? JSON.parse(raw) : {};
  }

  function saveProgress(progress) {
    localStorage.setItem('upcatProgress', JSON.stringify(progress));
  }

  function toggleDone(topicId, checkboxEl) {
    var progress = getProgress();
    progress[topicId] = checkboxEl.checked;
    saveProgress(progress);

    var card = checkboxEl.closest('.topic-card');
    card.classList.toggle('done', checkboxEl.checked);

    var section = checkboxEl.closest('section');
    updateSectionProgress(section);

    if (checkboxEl.checked) {
      var pct = getSectionPercent(section);
      if (pct === 100) {
        showToast(pickRandom(MILESTONE_MESSAGES));
      } else {
        showToast(pickRandom(SURPRISE_MESSAGES));
      }
    }
  }

  function getSectionPercent(section) {
    var wrap = section.querySelector('.progress-wrap');
    if (!wrap) return 0;
    var total = parseInt(wrap.getAttribute('data-total'), 10);
    var progress = getProgress();
    var done = 0;
    section.querySelectorAll('.topic-card').forEach(function(card) {
      if (progress[card.getAttribute('data-topic-id')]) done++;
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function updateSectionProgress(section) {
    var wrap = section.querySelector('.progress-wrap');
    if (!wrap) return;
    var total = parseInt(wrap.getAttribute('data-total'), 10);
    var progress = getProgress();
    var done = 0;
    section.querySelectorAll('.topic-card').forEach(function(card) {
      if (progress[card.getAttribute('data-topic-id')]) done++;
    });
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    wrap.querySelector('.progress-bar-fill').style.width = pct + '%';
    wrap.querySelector('.progress-count').textContent = done;
  }

  function restoreProgressOnLoad() {
    var progress = getProgress();
    document.querySelectorAll('.topic-card').forEach(function(card) {
      var id = card.getAttribute('data-topic-id');
      if (progress[id]) {
        card.classList.add('done');
        var box = card.querySelector('.done-check input');
        if (box) box.checked = true;
      }
    });
    document.querySelectorAll('section').forEach(updateSectionProgress);
  }

  // ===== SURPRISE / MOTIVATIONAL MESSAGES =====
  // Edit these arrays with your own inside jokes / personal messages any time —
  // just keep the quotes and commas in place.
  var MOTIVATIONAL_QUOTES = [
    "One topic at a time. You've got this. 💪",
    "Future Iskolar ng Bayan loading... ⏳",
    "Small steps today, UP tomorrow. 🎓",
    "You didn't come this far to only come this far.",
    "Reviewing > worrying. Keep going!",
    "Your only competition is who you were yesterday.",
    "Take a breather if you need it — then get back to it. 🌤️",
    "Every checkbox you tick is a future exam question you'll ace."
  ];

  var SURPRISE_MESSAGES = [
    "Nice! One down. 🎉",
    "Look at you go! 🔥",
    "That's how it's done!",
    "Certified topic-crusher. ✅",
    "Keep that momentum!",
    "Your brain just got a little bigger. 🧠",
    "UP won't know what hit it."
  ];

  var MILESTONE_MESSAGES = [
    "SECTION COMPLETE! 🎉🎉 You're unstoppable.",
    "100%?! Go treat yourself, you earned it. 🏆",
    "Section cleared. Iskolar ng Bayan energy only. 🌟"
  ];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  var toastTimer = null;
  function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2600);
  }

  // Show one random quote in the banner each time the page loads
  document.getElementById('quoteText').textContent = pickRandom(MOTIVATIONAL_QUOTES);

  // Restore checkbox state + progress bars once the page is ready
  restoreProgressOnLoad();
