const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_button_test', { waitUntil: 'networkidle2' });

  const buttons = await page.evaluate(() => {
    const selectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="reset"]',
      '[role="button"]',
      '[onclick]'
    ];

    const set = new Set();
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(n => set.add(n));
    });

    return Array.from(set).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: el.innerText?.trim() || el.value?.trim() || '',
      id: el.id || null,
      class: el.className || null
    }));
  });

  console.log(buttons);

  await browser.close();
})();
