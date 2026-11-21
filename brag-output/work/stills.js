const puppeteer = require('puppeteer-core');
const times = process.argv.slice(2).map(Number);
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args:['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080 });
  await p.goto('file:///C:/emailer-automate/brag-output/work/video.html', { waitUntil: 'networkidle0' });
  await p.evaluate(() => window.ready);
  const fs=require('fs'); fs.mkdirSync('stills',{recursive:true});
  for (const t of times) { await p.evaluate(t => window.render(t), t); await p.screenshot({ path: `stills/t${t.toFixed(2)}.jpg`, type:'jpeg', quality:70 }); }
  await b.close();
})();
