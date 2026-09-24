const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'dining', 'components', 'UnifiedCheckout.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove MOCK_RESERVED_TIMES and replace with state logic
content = content.replace(/const MOCK_RESERVED_TIMES[\s\S]*?"P3": \["8:30 PM", "9:00 PM"\]\n\};\n/m, '');

// 2. Insert HorizontalDatePicker component
const horizontalDatePickerCode = `
const HorizontalDatePicker = ({ selectedDate, onChange }: { selectedDate: string, onChange: (d: string) => void }) => {
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x mt-2">
      {dates.map((d, i) => {
        const iso = d.toISOString().split('T')[0];
        const isSelected = iso === selectedDate;
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = d.getDate();
        
        return (
          <button
            key={iso}
            onClick={() => onChange(iso)}
            className={\`snap-start shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all \${isSelected ? 'bg-primary text-white border-primary shadow-md scale-105' : 'bg-background text-foreground border-border hover:border-primary/50'}\`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{dayName}</span>
            <span className="text-xl font-black my-0.5">{dayNum}</span>
            <span className="text-[10px] font-medium opacity-80">{monthName}</span>
          </button>
        );
      })}
    </div>
  );
};
`;
content = content.replace('// Internal component for the Circular Time Picker', horizontalDatePickerCode + '\n// Internal component for the Circular Time Picker');


// 3. Add fetchedReservations state and useEffect
const hookInjection = `  const [fetchedReservations, setFetchedReservations] = useState<{tableId: string, date: string, time: string}[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchReservations = async () => {
      try {
        const orders = await orderService.getOrders();
        const parsed = orders
          .filter(o => o.tableNumber && o.status !== 'cancelled' && o.status !== 'completed')
          .map(o => {
             const match = o.tableNumber?.match(/(.+) \\((.+) @ (.+)\\)/);
             if (match) return { tableId: match[1], date: match[2], time: match[3] };
             return null;
          })
          .filter(Boolean) as {tableId: string, date: string, time: string}[];
        
        if (isMounted) setFetchedReservations(parsed);
      } catch (e) {
        console.error("Failed to fetch reservations", e);
      }
    };
    if (isOpen) {
      fetchReservations();
    }
    return () => { isMounted = false; };
  }, [isOpen]);
`;

content = content.replace('const [showMobileClock, setShowMobileClock] = useState(false);', 'const [showMobileClock, setShowMobileClock] = useState(false);\n' + hookInjection);

// 4. Update currentTableReservedTimes logic
content = content.replace(/const currentTableReservedTimes = selectedTableId \? \(MOCK_RESERVED_TIMES\[selectedTableId\] \|\| \[\]\) : \[\];/g, `const currentTableReservedTimes = fetchedReservations
    .filter(r => r.tableId === selectedTableId && r.date === selectedDate)
    .map(r => r.time);`);


// 5. Replace SVG Colors
content = content.replace(/className="fill-white dark:fill-\[#221710\]"/g, 'className="fill-background dark:fill-card"');
content = content.replace(/className="fill-muted\/20 dark:fill-\[#2d2018\] stroke-border dark:stroke-\[#3d2b20\]"/g, 'className="fill-secondary dark:fill-card stroke-border dark:stroke-border"');
content = content.replace(/className="fill-muted\/30 dark:fill-\[#1a110c\] stroke-border dark:stroke-\[#3d2b20\]"/g, 'className="fill-muted dark:fill-muted stroke-border dark:stroke-border"');

// 6. Remove strikethrough from reserved times
content = content.replace(/bg-red-500\/20 border border-red-500\/40 line-through/g, 'bg-red-500/20 border border-red-500/40');

// 7. Update Date Picker UI
const oldDateInput = `<input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary/50" />`;
const newDateInput = `<HorizontalDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />`;
content = content.replace(oldDateInput, newDateInput);

// 8. Conditionally hide Take-Away in Step 1
const orderTypeButtons = `<button
                  onClick={() => setOrderType('take-away')}
                  className={\`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all \${orderType === 'take-away' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]' : 'hover:border-primary border-border bg-background'}\`}
                >
                  <span className="material-icons text-2xl">takeout_dining</span>
                  <span className="font-bold">Take-Away</span>
                </button>`;

const updatedOrderTypeButtons = `{source !== 'reservation' && (
                <button
                  onClick={() => setOrderType('take-away')}
                  className={\`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all \${orderType === 'take-away' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]' : 'hover:border-primary border-border bg-background'}\`}
                >
                  <span className="material-icons text-2xl">takeout_dining</span>
                  <span className="font-bold">Take-Away</span>
                </button>
                )}`;
content = content.replace(orderTypeButtons, updatedOrderTypeButtons);

content = content.replace(/grid grid-cols-2 gap-3/g, 'grid grid-cols-1 sm:grid-cols-2 gap-3');


fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated UnifiedCheckout.tsx');
