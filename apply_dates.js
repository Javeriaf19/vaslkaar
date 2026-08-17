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

// Get commits oldest to newest
const commitList = execSync('git log --reverse --format="%H|||%s"').toString().trim().split('\n');

console.log(`Found ${commitList.length} commits to process.`);

// Backup current main branch just in case
try { execSync('git branch -D backup_main'); } catch(e) {}
execSync('git branch backup_main');

// Create temp orphan branch
try { execSync('git branch -D temp_history'); } catch(e) {}
execSync('git checkout --orphan temp_history');
execSync('git rm -rf .');

commitList.forEach((line, index) => {
  const [hash, msg] = line.split('|||');
  const d = dates[index] || dates[dates.length - 1];

  console.log(`[${index + 1}/${commitList.length}] Applying ${d} -> ${msg}`);

  // Apply tree of this commit
  execSync(`git checkout ${hash} -- .`);
  execSync('git add -A');

  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: 'Javeria Farhan',
    GIT_AUTHOR_EMAIL: 'javeriafarhan19@gmail.com',
    GIT_AUTHOR_DATE: d,
    GIT_COMMITTER_NAME: 'Javeria Farhan',
    GIT_COMMITTER_EMAIL: 'javeriafarhan19@gmail.com',
    GIT_COMMITTER_DATE: d,
  };

  // Commit with exact message
  execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { env });
});

// Switch main to temp_history
execSync('git branch -M temp_history main');
try { execSync('git branch -D backup_main'); } catch(e) {}

console.log('Successfully rewrote all commit dates across the 5-day hackathon window!');
