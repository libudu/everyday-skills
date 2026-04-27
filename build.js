const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const skillsDir = path.join(rootDir, '.trae', 'skills');
const readmePath = path.join(rootDir, 'README.md');

function updateReadme() {
  if (!fs.existsSync(skillsDir)) {
    console.error(`Skills directory not found: ${skillsDir}`);
    return;
  }

  const skillDirs = fs.readdirSync(skillsDir);
  let tableRows = [];

  for (const dir of skillDirs) {
    const skillMdPath = path.join(skillsDir, dir, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) continue;

    const content = fs.readFileSync(skillMdPath, 'utf8');
    
    // Parse YAML frontmatter simply
    const nameMatch = content.match(/^name:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);
    const descMatch = content.match(/^description:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);

    if (nameMatch && descMatch) {
      const name = nameMatch[1] || nameMatch[2] || nameMatch[3];
      const description = descMatch[1] || descMatch[2] || descMatch[3];
      
      tableRows.push(`| \`${name.trim()}\` | ${description.trim()} |`);
    }
  }

  if (tableRows.length === 0) {
    console.warn('No skills found or failed to parse SKILL.md files.');
    return;
  }

  const tableHeader = '| Name | Description |\n| --- | --- |\n';
  const tableContent = tableHeader + tableRows.join('\n');

  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  const startMarker = '<!-- SKILLS_TABLE_START -->';
  const endMarker = '<!-- SKILLS_TABLE_END -->';

  const regex = new RegExp(`(${startMarker})[\\s\\S]*?(${endMarker})`);
  
  if (regex.test(readmeContent)) {
    readmeContent = readmeContent.replace(regex, `$1\n${tableContent}\n$2`);
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('Successfully updated README.md with the skills table.');
  } else {
    console.error('Markers <!-- SKILLS_TABLE_START --> and <!-- SKILLS_TABLE_END --> not found in README.md.');
  }
}

updateReadme();
