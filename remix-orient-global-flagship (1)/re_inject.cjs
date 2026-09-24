const fs = require('fs');
let c = fs.readFileSync('src/dining/components/UnifiedCheckout.tsx', 'utf8');

const target = '<h4 className="text-lg font-black text-foreground">Table {selectedTableId}</h4>\\n                </div>';
const replacement = target + `

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Reservation Date</label>
                  <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                </div>`;

c = c.replace(target, replacement);

fs.writeFileSync('src/dining/components/UnifiedCheckout.tsx', c);
console.log('Injected CustomDatePicker successfully');
