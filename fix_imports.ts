import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(process.cwd(), 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Replace next/link with react-router-dom
    if (content.includes('next/link')) {
      content = content.replace(/import Link from ["']next\/link["'];?/g, 'import { Link } from "react-router-dom";');
      changed = true;
    }

    // Replace next/navigation with react-router-dom
    if (content.includes('next/navigation')) {
      content = content.replace(/import \{([^}]+)\} from ["']next\/navigation["'];?/g, (match, p1) => {
        let imports = p1.split(',').map((s: string) => s.trim());
        let newImports: string[] = [];
        imports.forEach((imp: string) => {
          if (imp === 'usePathname') newImports.push('useLocation');
          if (imp === 'useRouter') newImports.push('useNavigate');
        });
        return `import { ${newImports.join(', ')} } from "react-router-dom";`;
      });
      
      // Replace usages
      content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');
      content = content.replace(/useRouter\(\)/g, 'useNavigate()');
      content = content.replace(/router\.push\(/g, 'navigate(');
      
      // Add navigate variable if useRouter was replaced
      if (content.includes('useNavigate()') && !content.includes('const navigate = useNavigate()')) {
        content = content.replace(/const router = useNavigate\(\);?/g, 'const navigate = useNavigate();');
      }
      
      changed = true;
    }
    
    // Replace next/image with standard img
    if (content.includes('next/image')) {
      content = content.replace(/import Image from ["']next\/image["'];?/g, '');
      content = content.replace(/<Image([^>]*)>/g, '<img$1 />');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
