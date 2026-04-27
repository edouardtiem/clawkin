(function() {
  const cmd = 'curl -sL clawkin.sh | sh';
  const target = document.getElementById('install-cmd');
  const caret = document.getElementById('caret');
  const copyBtn = document.getElementById('copy-btn');
  const demo = document.getElementById('demo-section');
  const badge = document.getElementById('badge');
  const pact = document.getElementById('pact');
  const footer = document.getElementById('footer');
  let i = 0;

  function reveal(el, delay) {
    setTimeout(() => {
      el.classList.remove('hidden');
      el.classList.add('fadein');
    }, delay);
  }

  function tick() {
    if (i < cmd.length) {
      target.textContent += cmd[i];
      i++;
      setTimeout(tick, 38 + Math.random() * 45);
    } else {
      caret.style.display = 'none';
      copyBtn.classList.remove('hidden');
      copyBtn.classList.add('fadein');
      reveal(demo, 200);
      reveal(badge, 450);
      reveal(pact, 700);
      reveal(footer, 900);
    }
  }
  setTimeout(tick, 350);

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      copyBtn.textContent = 'copied';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'copy';
        copyBtn.classList.remove('copied');
      }, 1400);
    } catch (e) {
      copyBtn.textContent = 'copy failed';
      setTimeout(() => { copyBtn.textContent = 'copy'; }, 1400);
    }
  });

  const badgeCmd = '![Clawkin](https://clawkin.sh/u/you.svg)';
  const badgeBtn = document.getElementById('copy-badge-btn');
  badgeBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(badgeCmd);
      badgeBtn.textContent = 'copied';
      badgeBtn.classList.add('copied');
      setTimeout(() => {
        badgeBtn.textContent = 'copy';
        badgeBtn.classList.remove('copied');
      }, 1400);
    } catch (e) {
      badgeBtn.textContent = 'copy failed';
      setTimeout(() => { badgeBtn.textContent = 'copy'; }, 1400);
    }
  });
})();
