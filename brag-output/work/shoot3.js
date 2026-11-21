const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 680, height: 1000, deviceScaleFactor: 2 });
  await p.goto('file:///C:/emailer-automate/antigravity-html/avendus/demo_emailer/index.html', { waitUntil: 'networkidle0', timeout: 60000 });
  await p.screenshot({ path: 'shots/demo_full.png', fullPage: true });
  const h = await p.evaluate(()=>document.body.scrollHeight); console.log(h);
  await b.close();
})();
