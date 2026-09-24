const fs = require('fs');

const path = 'src/dining/components/UnifiedCheckout.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports if not present
if (!content.includes('import { Popover')) {
  content = content.replace(
    "import { INITIAL_PRODUCTS_CATALOG } from '@/data/productsCatalog';",
    "import { INITIAL_PRODUCTS_CATALOG } from '@/data/productsCatalog';\nimport { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';\nimport { Calendar } from '@/components/ui/calendar';"
  );
}

// 2. Replace HorizontalDatePicker implementation with CustomDatePicker
const horizontalRegex = /const HorizontalDatePicker[\s\S]*?;\n\};\n/m;
const customDatePickerCode = `
const CustomDatePicker = ({ selectedDate, onChange }: { selectedDate: string, onChange: (d: string) => void }) => {
  const [open, setOpen] = useState(false);
  
  // ensure we create the Date based on local time, not UTC which could shift it
  const getLocalObj = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  };
  const dateObj = getLocalObj(selectedDate);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={\`w-full p-3.5 bg-background border border-border rounded-xl text-foreground font-medium outline-none hover:border-primary/50 text-left flex justify-between items-center transition-colors \${!selectedDate ? 'text-muted-foreground' : ''}\`}
        >
          {dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : "Select a date"}
          <span className="material-icons text-muted-foreground">calendar_today</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[100000]" align="start">
        <Calendar
          mode="single"
          selected={dateObj}
          onSelect={(date) => {
             if (date) {
               // convert local date back to YYYY-MM-DD
               const y = date.getFullYear();
               const m = String(date.getMonth() + 1).padStart(2, '0');
               const d = String(date.getDate()).padStart(2, '0');
               onChange(\`\${y}-\${m}-\${d}\`);
               setOpen(false);
             }
          }}
          disabled={(date) => {
             const today = new Date();
             today.setHours(0,0,0,0);
             return date < today;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
`;

content = content.replace(horizontalRegex, customDatePickerCode);

// 3. Replace usage of <HorizontalDatePicker />
content = content.replace(/<HorizontalDatePicker selectedDate=\{selectedDate\} onChange=\{setSelectedDate\} \/>/g, '<CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully reverted to Popover Calendar');
