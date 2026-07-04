#!/usr/bin/env node
/*
 * Yaver orkestrasyon panosu — durum okuyucu + handoff geçidi.
 * Tek gerçek kaynak: .claude/orchestration/board.json
 *
 *   node scripts/board.cjs          -> pano durumu (statüye göre gruplu)
 *   node scripts/board.cjs next     -> koşmaya hazır (bağımlılığı çözülmüş) görevler
 *   node scripts/board.cjs gate     -> npx tsc --noEmit (handoff geçidi; FAIL ise exit 1)
 *
 * NOT: Bu bir daemon DEĞİL — ajanları yalnızca ana oturum (şef) başlatır.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BOARD = path.join(ROOT, '.claude', 'orchestration', 'board.json');

function load() {
  return JSON.parse(fs.readFileSync(BOARD, 'utf8'));
}

const ORDER = ['in-progress', 'ready', 'needs-design', 'review', 'blocked', 'done'];
const MARK = {
  'in-progress': '[>]',
  ready: '[o]',
  'needs-design': '[~]',
  review: '[?]',
  blocked: '[x]',
  done: '[v]',
};

function depsResolved(task, byId) {
  return task.deps.every((d) => byId[d] && byId[d].status === 'done');
}

function status() {
  const b = load();
  const byId = Object.fromEntries(b.tasks.map((t) => [t.id, t]));
  console.log(`\n  Yaver Board  |  ${b.branch}  |  guncelleme: ${b.updated}`);
  console.log(`  Gate: ${b.gate}`);
  for (const st of ORDER) {
    const rows = b.tasks.filter((t) => t.status === st);
    if (!rows.length) continue;
    console.log(`\n  ${st.toUpperCase()}`);
    for (const t of rows) {
      const deps = t.deps.length
        ? '  deps[' + t.deps.map((d) => `${d}:${byId[d] ? byId[d].status : '?'}`).join(', ') + ']'
        : '';
      console.log(`    ${MARK[t.status] || '[-]'} ${t.id}  ${t.title}  <${t.owner}>${deps}`);
      if (t.note) console.log(`         - ${t.note}`);
    }
  }
  console.log('');
}

function next() {
  const b = load();
  const byId = Object.fromEntries(b.tasks.map((t) => [t.id, t]));
  const runnable = b.tasks.filter(
    (t) => (t.status === 'ready' || t.status === 'needs-design') && depsResolved(t, byId)
  );
  if (!runnable.length) {
    console.log('\n  Kosmaya hazir gorev yok (bagimliliklar cozulmedi veya hepsi bitti).\n');
    return;
  }
  console.log('\n  Kosmaya HAZIR gorevler (bagimliligi cozulmus):');
  for (const t of runnable) {
    console.log(`    ${MARK[t.status]} ${t.id}  ${t.title}  <${t.owner}>`);
  }
  console.log('');
}

function gate() {
  console.log('\n  Handoff gate: npx tsc --noEmit ...\n');
  try {
    execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'inherit' });
    console.log('\n  GATE PASS [v]\n');
  } catch (e) {
    console.log('\n  GATE FAIL [x] — typecheck hatalari var, handoff bloke.\n');
    process.exit(1);
  }
}

const cmd = process.argv[2] || 'status';
if (cmd === 'status') status();
else if (cmd === 'next') next();
else if (cmd === 'gate') gate();
else {
  console.log(`Bilinmeyen komut: ${cmd}\nKullanim: node scripts/board.cjs [status|next|gate]`);
  process.exit(1);
}
