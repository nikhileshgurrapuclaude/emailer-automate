// 60s soundtrack, 120 BPM, A minor (Am F C G), SFX on the same grid.
const fs = require('fs');
const SR = 44100, DUR = 60, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const BEAT = 0.5, BAR = 2;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
function add(i, v, pan = 0) { if (i < 0 || i >= N) return; L[i] += v * (1 - Math.max(0, pan)); R[i] += v * (1 + Math.min(0, pan)); }

// sections
const groove = t => (t >= 4 && t < 16) || (t >= 20 && t < 56);
const full = t => t >= 20 && t < 56;
const CH = [[45, [57, 60, 64]], [41, [57, 60, 65]], [48, [55, 60, 64]], [43, [55, 59, 62]]]; // root, chord (Am F C G)
const chordAt = t => CH[Math.floor(t / BAR) % 4];

// kick envelope for sidechain
const duck = new Float32Array(N).fill(1);

function kick(t0, amp = 0.55) {
  const s = Math.round(t0 * SR); let ph = 0;
  for (let j = 0; j < SR * 0.35; j++) {
    const tt = j / SR, f = 45 + 85 * Math.exp(-tt * 30);
    ph += 2 * Math.PI * f / SR;
    add(s + j, Math.sin(ph) * Math.exp(-tt * 9) * amp);
    if (s + j < N) duck[s + j] = Math.min(duck[s + j], 1 - 0.55 * Math.exp(-tt * 7));
  }
}
function hat(t0, amp = 0.05, pan = 0.25) {
  const s = Math.round(t0 * SR); let prev = 0;
  for (let j = 0; j < SR * 0.05; j++) { const n = rnd(); const hp = n - prev; prev = n; add(s + j, hp * Math.exp(-j / SR * 90) * amp, pan); }
}
function clap(t0, amp = 0.09) {
  const s = Math.round(t0 * SR); let lp = 0, prev = 0;
  for (let j = 0; j < SR * 0.18; j++) { const n = rnd(); lp += 0.35 * (n - lp); const bp = lp - prev; prev = lp; add(s + j, bp * 3 * Math.exp(-j / SR * 22) * amp, -0.1); }
}
function bassNote(t0, dur, m, amp = 0.16) {
  const s = Math.round(t0 * SR), f = mtof(m); let lp = 0, ph = 0;
  for (let j = 0; j < SR * dur; j++) {
    const tt = j / SR; ph += f / SR; const saw = 2 * (ph % 1) - 1;
    lp += 0.06 * (saw - lp);
    const env = Math.min(1, tt / 0.005) * Math.exp(-tt * 3) * (tt > dur - 0.02 ? (dur - tt) / 0.02 : 1);
    add(s + j, (lp + 0.6 * Math.sin(2 * Math.PI * f * tt)) * env * amp);
  }
}
function padChord(t0, dur, notes, amp = 0.035) {
  const s = Math.round(t0 * SR);
  for (const m of notes) for (const det of [-0.08, 0.08]) {
    const f = mtof(m + det); let lp = 0, ph = Math.random();
    const pan = det > 0 ? 0.4 : -0.4;
    for (let j = 0; j < SR * dur; j++) {
      const tt = j / SR; ph += f / SR; const saw = 2 * (ph % 1) - 1; lp += 0.03 * (saw - lp);
      const env = Math.min(1, tt / 0.4) * Math.min(1, (dur - tt) / 0.4);
      add(s + j, lp * env * amp, pan);
    }
  }
}
function pluck(t0, m, amp = 0.05, pan = 0, dec = 7) {
  const s = Math.round(t0 * SR), f = mtof(m);
  for (let j = 0; j < SR * 0.6; j++) {
    const tt = j / SR, ph = 2 * Math.PI * f * tt;
    const tri = (2 / Math.PI) * Math.asin(Math.sin(ph));
    add(s + j, (tri * 0.7 + 0.3 * Math.sin(2 * ph)) * Math.exp(-tt * dec) * Math.min(1, tt / 0.003) * amp, pan);
  }
}
function whoosh(tc, amp = 0.12) { // centred on cut tc, 0.7s, bandpass sweep
  const s = Math.round((tc - 0.4) * SR), len = SR * 0.8; let lp1 = 0, lp2 = 0;
  for (let j = 0; j < len; j++) {
    const x = j / len, c = 0.02 + 0.25 * Math.sin(Math.PI * x) ** 2;
    const n = rnd(); lp1 += c * (n - lp1); lp2 += c * (lp1 - lp2);
    const env = Math.sin(Math.PI * x) ** 2;
    add(s + j, (lp1 - lp2) * 2.2 * env * amp, (x - 0.5) * 1.2);
  }
}
function impact(t0, amp = 0.5) { kick(t0, amp); const s = Math.round(t0 * SR); let lp = 0; for (let j = 0; j < SR * 1.2; j++) { lp += 0.02 * (rnd() - lp); add(s + j, lp * 2 * Math.exp(-j / SR * 3) * amp * 0.5); } }
function click(t0, amp = 0.05) { pluck(t0, 81, amp, 0.2, 40); hat(t0, 0.03, 0.2); }
function riser(t0, t1, amp = 0.06) {
  const s = Math.round(t0 * SR), len = Math.round((t1 - t0) * SR); let lp = 0;
  for (let j = 0; j < len; j++) { const x = j / len; lp += (0.01 + 0.2 * x * x) * (rnd() - lp); add(s + j, lp * 3 * x * x * amp); }
}

// ---- arrangement ----
for (let b = 0; b < 30; b++) {
  const t = b * BAR; const [root, chord] = chordAt(t);
  // pad everywhere, softer in groove
  padChord(t, BAR + 0.3, chord, t >= 16 && t < 20 ? 0.045 : 0.03);
  for (let q = 0; q < 4; q++) {
    const tb = t + q * BEAT;
    if (groove(tb)) { kick(tb); hat(tb + 0.25); if (full(tb) && (q === 1 || q === 3)) clap(tb); }
    if (full(tb) || (tb >= 8 && tb < 16)) { hat(tb + 0.125, 0.025, -0.3); hat(tb + 0.375, 0.025, -0.3); }
  }
  if (groove(t)) {
    const pat = [0, 0, 12, 0, 0, 7, 0, 12];
    for (let e = 0; e < 8; e++) bassNote(t + e * 0.25, 0.22, root + pat[e] - 12 + 12, 0.13);
  }
  // arp: hook intro + full sections
  if (t < 4 || full(t) || t >= 56) {
    const tones = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12];
    for (let e = 0; e < 8; e++) pluck(t + e * 0.25, tones[e % 4], t < 4 ? 0.04 : 0.03, e % 2 ? 0.35 : -0.35);
  }
}
// sfx
riser(2.5, 4); riser(14.5, 16, 0.05); riser(18.5, 20, 0.05); riser(54.5, 56, 0.05);
for (const c of [4, 16, 20, 56]) whoosh(c);
impact(16, 0.5); impact(56, 0.45);
padChord(56, 4, [57, 60, 64, 69], 0.03);
for (let i = 0; i < 4; i++) pluck(8.5 + i, [69, 72, 76, 79][i], 0.05, 0.1, 10);          // problem cards
pluck(16.5, 64, 0.05); pluck(17.5, 60, 0.05);                                              // core lines
for (const c of [23.0, 27.5, 29.5, 34.5]) click(c);                                        // clicks
for (let k = 29.75; k < 31.35; k += 0.125) hat(k, 0.03, 0.1);                              // typing on 16ths
pluck(34.75, 76, 0.05); pluck(35.0, 81, 0.04);                                             // export toast
for (let i = 0; i < 4; i++) pluck(36.5 + i * 0.5, [64, 67, 69, 72][i], 0.045, 0, 10);      // rows
for (let i = 0; i < 6; i++) pluck(42.5 + i * 0.25, [69, 72, 76, 72, 76, 81][i], 0.035, (i % 2 ? .3 : -.3), 12); // features
for (let i = 0; i < 4; i++) pluck(52.5 + i * 0.5, [69, 72, 76, 81][i], 0.045, 0, 10);      // summary
for (let i = 0; i < 3; i++) pluck(56.25 + i * 0.25 + 0.5, [76, 81, 84][i], 0.04, 0, 6);    // outro sparkle

// ---- mix: sidechain pad/bass approximated by ducking whole bed except kick is already in; then master ----
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let fade = 1; if (t < 0.05) fade = t / 0.05; if (t > DUR - 1.6) fade = Math.max(0, (DUR - t) / 1.6);
  const d = 0.7 + 0.3 * duck[i];
  L[i] = Math.tanh(L[i] * d * 1.1) * fade; R[i] = Math.tanh(R[i] * d * 1.1) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
fs.writeFileSync('music.wav', buf); console.log('peak', peak.toFixed(3), 'gain', g.toFixed(3));
