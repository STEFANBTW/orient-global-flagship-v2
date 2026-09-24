const fs = require('fs');

const path = 'src/dining/components/UnifiedCheckout.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /(<h4 className="text-lg font-black text-foreground">Table \{selectedTableId\}<\/h4>\s*<\/div>\s*<\/div>)/;

const injection = `$1

                        <div className="mt-4">
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Reservation Date</label>
                          <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                        </div>`;

if (regex.test(content)) {
  content = content.replace(regex, injection);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Injected DatePicker!');
} else {
  console.log('FAIL: Could not find target pattern.');
}
