const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const FPS=30, DUR=60, POSTER=7.5;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args:['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080 });
  await p.goto('file:///C:/emailer-automate/brag-output/work/video.html', { waitUntil: 'networkidle0' });
  await p.evaluate(() => window.ready);
  const ff = spawn(require('ffmpeg-static'), ['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i','music.wav',
    '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r',String(FPS),'-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart','../brag.mp4'], { stdio:['pipe','ignore','inherit'] });
  const total=FPS*DUR;
  for (let f=0; f<total; f++) {
    const t = f===0 ? POSTER : f/FPS;
    await p.evaluate(t => window.render(t), t);
    const img = await p.screenshot({ type:'jpeg', quality:95, optimizeForSpeed:true });
    if (!ff.stdin.write(img)) await new Promise(r=>ff.stdin.once('drain',r));
    if (f%150===0) console.log('frame',f);
  }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('done');
})();
