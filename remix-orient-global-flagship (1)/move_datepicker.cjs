const fs = require('fs');

const path = 'src/dining/components/UnifiedCheckout.tsx';
const lines = fs.readFileSync(path, 'utf8').split('\\n');

let newLines = [];
let skip = 0;

for (let i = 0; i < lines.length; i++) {
  if (skip > 0) {
    skip--;
    continue;
  }
  
  if (lines[i].includes('Reservation Date') && lines[i].includes('label') && !lines[i-1].includes('Table {selectedTableId}')) {
    // Found the original DatePicker location
    // We want to skip this div, which is 3 lines usually:
    // <div>
    //   <label>Reservation Date</label>
    //   <CustomDatePicker ... />
    // </div>
    // Let's dynamically skip until </div>
    let j = i;
    while (!lines[j].includes('</div>')) {
      j++;
    }
    // Also skip the preceding <div>
    newLines.pop(); // remove the <div>
    skip = j - i;
    continue;
  }

  newLines.push(lines[i]);
  
  if (lines[i].includes('Table {selectedTableId}</h4>')) {
    // Inject date picker after this block
    // Wait, the h4 is inside a div, so we wait for the closing div
    newLines.push(lines[++i]); // </div>
    newLines.push('');
    newLines.push('                <div>');
    newLines.push('                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Reservation Date</label>');
    newLines.push('                  <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />');
    newLines.push('                </div>');
  }
}

fs.writeFileSync(path, newLines.join('\\n'), 'utf8');
console.log('Fixed date picker position');
