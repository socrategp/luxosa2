const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const replacements = [
  { from: /py-32 md:py-48 lg:py-56/g, to: 'py-20 md:py-32 lg:py-40' },
  { from: /py-32 md:py-48/g, to: 'py-20 md:py-32' },
  { from: /py-28 md:py-40 lg:py-48/g, to: 'py-16 md:py-28 lg:py-36' },
  { from: /py-32 md:py-44/g, to: 'py-20 md:py-28' },
  { from: /py-24 md:py-32 lg:py-40/g, to: 'py-16 md:py-24 lg:py-32' },
  { from: /py-24 md:py-32/g, to: 'py-16 md:py-24' },
  { from: /mb-20 md:mb-28/g, to: 'mb-12 md:mb-20' },
  { from: /mb-16 md:mb-24/g, to: 'mb-10 md:mb-16' },
];

['src/pages', 'src/components'].forEach(dir => {
  if (fs.existsSync(dir)) {
    walk(dir, (filepath) => {
      if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
        let content = fs.readFileSync(filepath, 'utf8');
        let modified = false;
        replacements.forEach(r => {
          if (r.from.test(content)) {
            content = content.replace(r.from, r.to);
            modified = true;
          }
        });
        if (modified) {
          fs.writeFileSync(filepath, content, 'utf8');
          console.log('Updated: ' + filepath);
        }
      }
    });
  }
});
