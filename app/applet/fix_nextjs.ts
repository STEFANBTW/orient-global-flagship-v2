import fs from 'fs';
import path from 'path';

function walkSync(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts'))) {
      callback(filepath);
    }
  });
}

walkSync('/app/applet/src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  if (content.includes('next/link')) {
    content = content.replace(/import Link from ['"]next\/link['"];?/g, 'import { Link } from "react-router-dom";');
    changed = true;
  }

  if (content.includes('next/navigation')) {
    content = content.replace(/import \{([^}]+)\} from ['"]next\/navigation['"];?/g, (match, p1) => {
      let imports = [];
      if (p1.includes('useRouter')) imports.push('useNavigate');
      if (p1.includes('usePathname')) imports.push('useLocation');
      return `import { ${imports.join(', ')} } from "react-router-dom";`;
    });
    
    // Replace useRouter with useNavigate
    content = content.replace(/const router = useRouter\(\);?/g, 'const navigate = useNavigate();');
    content = content.replace(/router\.push\(/g, 'navigate(');
    
    // Replace usePathname with useLocation
    content = content.replace(/const pathname = usePathname\(\);?/g, 'const location = useLocation();\n  const pathname = location.pathname;');
    
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
  }
});
