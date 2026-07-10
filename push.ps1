node -e "
const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf8');
content = content.replace(/beta-1\.0\.(\d+)/, (match, p1) => 'beta-1.0.' + (parseInt(p1) + 1));
fs.writeFileSync('README.md', content);
"
git add README.md
git commit -m "chore: bump version for push"
git push
