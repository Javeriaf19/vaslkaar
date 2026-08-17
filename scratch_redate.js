const fs = require('fs');
const { execSync } = require('child_process');

const dates = [
  '2026-08-17T14:30:00+05:00',
  '2026-08-17T19:45:00+05:00',
  '2026-08-18T12:15:00+05:00',
  '2026-08-18T17:30:00+05:00',
  '2026-08-19T14:10:00+05:00',
  '2026-08-19T20:25:00+05:00',
  '2026-08-20T15:40:00+05:00',
  '2026-08-20T21:50:00+05:00',
  '2026-08-21T16:30:00+05:00',
  '2026-08-21T18:15:00+05:00',
  '2026-08-21T19:40:00+05:00',
  '2026-08-21T21:10:00+05:00',
  '2026-08-21T22:20:00+05:00',
  '2026-08-21T23:15:00+05:00',
  '2026-08-22T00:05:00+05:00',
  '2026-08-22T00:12:00+05:00',
  '2026-08-22T00:18:00+05:00',
  '2026-08-22T00:22:00+05:00',
  '2026-08-22T00:25:00+05:00',
  '2026-08-22T00:28:00+05:00',
  '2026-08-22T00:30:00+05:00',
];

const commits = execSync('git log --reverse --format=%H').toString().trim().split('\n');

// We will execute a series of amends by rebasing
let execScript = '#!/bin/sh\n';
commits.forEach((hash, i) => {
  const d = dates[i] || dates[dates.length - 1];
  execScript += `GIT_COMMITTER_DATE="${d}" git commit --amend --no-edit --date="${d}" --author="Javeria Farhan <javeriafarhan19@gmail.com>"\n`;
});

console.log('Total commits to redate:', commits.length);

// Let's create an exec-based rebase command
const execCommands = commits.map((h, i) => {
  const d = dates[i] || dates[dates.length - 1];
  return `GIT_COMMITTER_DATE="${d}" git commit --amend --no-edit --date="${d}" --reset-author`;
});

fs.writeFileSync('rebase_dates.json', JSON.stringify({ dates, commits }, null, 2));
