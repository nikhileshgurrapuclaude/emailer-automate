const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  for (const [name, url] of [['home','https://emailer-automate.vercel.app/'],['studio','https://emailer-automate.vercel.app/studio']]) {
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2500));
    await p.screenshot({ path: `shots/${name}.png` });
    console.log(name, await p.title());
  }
  await b.close();
})();
