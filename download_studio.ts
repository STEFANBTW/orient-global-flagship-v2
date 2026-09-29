import https from 'https';
import fs from 'fs';
import path from 'path';

const INDEX_URL = 'https://stefanbtw.github.io/orient-bakery-hub/scripts/studio/studio-index.html';
const BASE_URL = 'https://stefanbtw.github.io/orient-bakery-hub/scripts/studio/';

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Fetching index...');
    const indexHtml = await fetchUrl(INDEX_URL);
    
    // Extract all hrefs
    const regex = /href="([^"]+\.html)"/g;
    let match;
    const urls: string[] = [];
    while ((match = regex.exec(indexHtml)) !== null) {
      urls.push(match[1]);
    }
    
    console.log(`Found ${urls.length} files to download.`);
    
    for (const relativeUrl of urls) {
      if (!relativeUrl.startsWith('src/')) continue; // Only download src files
      
      const fullUrl = BASE_URL + relativeUrl;
      console.log(`Downloading ${fullUrl}...`);
      
      try {
        const content = await fetchUrl(fullUrl);
        
        // Convert .html to .tsx or .ts
        let localPath = relativeUrl.replace(/\.html$/, '');
        if (!localPath.endsWith('.ts') && !localPath.endsWith('.tsx')) {
          // Guess extension based on content
          if (content.includes('from "react"') || content.includes('from \'react\'') || content.includes('JSX') || content.includes('</div>')) {
            localPath += '.tsx';
          } else {
            localPath += '.ts';
          }
        }
        
        localPath = path.join(process.cwd(), 'downloaded_studio', localPath);
        
        // Create directories
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        
        // Write file
        fs.writeFileSync(localPath, content);
        console.log(`Saved to ${localPath}`);
      } catch (err: any) {
        console.error(`Failed to download ${fullUrl}: ${err.message}`);
      }
    }
    
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

main();
