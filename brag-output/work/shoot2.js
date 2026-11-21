const puppeteer = require('puppeteer-core');
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await p.goto('https://emailer-automate.vercel.app/studio', { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(2000);
  // click demo_emailer in sidebar
  await p.evaluate(() => { const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0 && e.textContent.trim()==='demo_emailer'); el && el.click(); });
  await wait(2500);
  await p.screenshot({ path: 'shots/studio_demo.png' });
  // mobile toggle
  await p.evaluate(() => { const el=[...document.querySelectorAll('button')].find(e=>e.textContent.includes('Mobile')); el && el.click(); });
  await wait(2000);
  await p.screenshot({ path: 'shots/studio_mobile.png' });
  await p.evaluate(() => { const el=[...document.querySelectorAll('button')].find(e=>e.textContent.includes('Desktop')); el && el.click(); });
  await wait(1000);
  // the preview iframe full height
  const frames = p.frames(); console.log(frames.map(f=>f.url().slice(0,80)));
  await b.close();
})();
