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
    "I can do all things through Christ who strengthens me." — Philippians 4:13",
    "For I know the plans I have for you, plans to prosper you and not to harm you." — Jeremiah 29:11",
    "Trust in the Lord with all your heart, and lean not on your own understanding." — Proverbs 3:5",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you." — Joshua 1:9",
    "For God has not given us a spirit of fear, but of power, love, and a sound mind." — 2 Timothy 1:7",
    "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God." — Philippians 4:6",
    "The Lord is my strength and my shield; my heart trusts in him, and he helps me." — Psalm 28:7",
    "Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23",
    "Those who hope in the Lord will renew their strength... they will run and not grow weary." — Isaiah 40:31"
    "God is within her, she will not fall." — Psalm 46:5
  ];

  var SURPRISE_MESSAGES = [
    "Progress, not perfection.",
    "You don't have to be great to start, but you have to start to be great.",
    "Discipline today, freedom tomorrow.",
    "Every review session is a deposit into future-you's confidence.",
    "Doubt kills more dreams than failure ever will.",
    "Consistency beats intensity.",
    "You're not behind. You're exactly where you need to be to start.",
    "The exam doesn't decide your worth — it just measures your prep.",
    "Rest is part of the plan, not a break from it.",
    "Trust the process. Then keep showing up for it."
  ];

  var MILESTONE_MESSAGES = [
    "SECTION COMPLETE! What a nice!😍",
    "100%?! Na para bang...😱",
    "Supercalifragilisticexpialidocious 🙌"
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
