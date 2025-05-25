 const paragraphs = [
    `Typing tests are a great way to improve your speed and accuracy. Practice daily and watch your skills grow!`,
    `The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.`,
    `Consistent typing practice helps build muscle memory and increases typing speed dramatically.`,
    `Accuracy is just as important as speed when it comes to typing effectively.`,
    `Online typing tests provide instant feedback to help you improve quickly.`
  ];

  const paragraphEl = document.getElementById('paragraph');
  const inputArea = document.getElementById('inputArea');
  const timeEl = document.getElementById('time');
  const wordsEl = document.getElementById('words');
  const wpmEl = document.getElementById('wpm');
  const accuracyEl = document.getElementById('accuracy');
  const startBtn = document.getElementById('startBtn');
  const resultEl = document.getElementById('result');

  let timer;
  let timeLeft = 60;
  const totalTime = 60;
  let currentParagraph = '';
  let started = false;
  let startTime;

  startBtn.addEventListener('click', startTest);

  function startTest() {
    resetTest();
    currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    renderParagraph(currentParagraph);
    inputArea.disabled = false;
    inputArea.focus();
    started = true;
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    resultEl.textContent = '';
  }

  function resetTest() {
    clearInterval(timer);
    timeLeft = totalTime;
    timeEl.textContent = timeLeft;
    inputArea.value = '';
    wordsEl.textContent = 0;
    wpmEl.textContent = 0;
    accuracyEl.textContent = 100;
    startBtn.disabled = false;
    inputArea.disabled = true;
    paragraphEl.innerHTML = '';
  }

  function updateTimer() {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft === 0) {
      finishTest();
    }
  }

  inputArea.addEventListener('input', () => {
    if (!started) return;

    const inputText = inputArea.value;
    const paragraphSpans = paragraphEl.querySelectorAll('span');

    let correctChars = 0;
    let totalTyped = inputText.length;
    let errors = 0;

    // Highlight each character
    for (let i = 0; i < paragraphSpans.length; i++) {
      const char = inputText[i];
      if (char == null) {
        paragraphSpans[i].className = '';
      } else if (char === paragraphSpans[i].textContent) {
        paragraphSpans[i].className = 'correct';
        correctChars++;
      } else {
        paragraphSpans[i].className = 'incorrect';
        errors++;
      }
    }

    // Calculate stats
    const wordsTyped = inputText.trim().split(/\s+/).filter(Boolean).length;
    wordsEl.textContent = wordsTyped;

    const elapsedSeconds = (new Date() - startTime) / 1000;
    const wpm = elapsedSeconds > 0 ? Math.round((wordsTyped / elapsedSeconds) * 60) : 0;
    wpmEl.textContent = wpm;

    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    accuracyEl.textContent = accuracy;

    // If paragraph fully typed before time ends
    if (inputText === currentParagraph) {
      finishTest();
    }
  });

  function renderParagraph(text) {
    paragraphEl.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      paragraphEl.appendChild(span);
    });
  }

  function finishTest() {
    clearInterval(timer);
    inputArea.disabled = true;
    started = false;
    startBtn.disabled = false;

    const finalWords = parseInt(wordsEl.textContent);
    const finalWpm = parseInt(wpmEl.textContent);
    const finalAccuracy = parseInt(accuracyEl.textContent);
    const timeTaken = totalTime - timeLeft;

    resultEl.innerHTML = `
      Test completed!<br />
      Time taken: <strong>${timeTaken} seconds</strong><br />
      Words typed: <strong>${finalWords}</strong><br />
      Speed (WPM): <strong>${finalWpm}</strong><br />
      Accuracy: <strong>${finalAccuracy}%</strong>
    `;
  }
