const fs = require('fs');

// 1. Fix ReservationsScreen
const resPath = 'src/dining/components/ReservationsScreen.tsx';
let resContent = fs.readFileSync(resPath, 'utf8');
resContent = resContent.replace('className="py-16 px-6 relative bg-card transition-colors"', 'className="py-8 md:py-16 px-0 md:px-6 relative bg-card transition-colors"');
fs.writeFileSync(resPath, resContent, 'utf8');

// 2. Fix UnifiedCheckout
const path = 'src/dining/components/UnifiedCheckout.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the shadcn Calendar import if present, since we are using our custom MiniCalendar inside the Popover
content = content.replace("import { Calendar } from '@/components/ui/calendar';", "");

// 2. Replace the CustomDatePicker implementation with the MiniCalendar-based one
const customDatePickerRegex = /const CustomDatePicker[\s\S]*?;\n\};\n/m;
const miniCalendarCode = `
const CustomDatePicker = ({ selectedDate, onChange }: { selectedDate: string, onChange: (d: string) => void }) => {
  const [open, setOpen] = useState(false);
  
  const getLocalObj = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  };
  const dateObj = getLocalObj(selectedDate);
  
  const MiniCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(dateObj || new Date());
    const today = new Date();
    today.setHours(0,0,0,0);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    return (
      <div className="p-4 w-72 bg-card rounded-xl border border-border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={(e) => { e.preventDefault(); prevMonth(); }} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center h-8 w-8"><span className="material-icons text-sm">chevron_left</span></button>
          <span className="font-bold text-sm text-foreground">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={(e) => { e.preventDefault(); nextMonth(); }} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center h-8 w-8"><span className="material-icons text-sm">chevron_right</span></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-xs font-bold text-muted-foreground">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={'empty'+i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isPast = date < today;
            const isSelected = dateObj && date.toDateString() === dateObj.toDateString();
            return (
              <button
                key={i}
                disabled={isPast}
                onClick={(e) => {
                  e.preventDefault();
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  onChange(\`\${y}-\${m}-\${d}\`);
                  setOpen(false);
                }}
                className={\`h-8 w-8 mx-auto text-sm flex items-center justify-center rounded-full transition-colors \${
                  isPast ? 'text-muted-foreground opacity-30 cursor-not-allowed bg-muted/30' 
                  : isSelected ? 'bg-primary text-primary-foreground font-bold shadow-md' 
                  : 'hover:bg-muted text-foreground'
                }\`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => { e.preventDefault(); setOpen(true); }}
          className={\`w-full p-3.5 bg-background border border-border rounded-xl text-foreground font-medium outline-none hover:border-primary/50 text-left flex justify-between items-center transition-colors \${!selectedDate ? 'text-muted-foreground' : ''}\`}
        >
          {dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : "Select a date"}
          <span className="material-icons text-muted-foreground">calendar_today</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[100000] border-none bg-transparent shadow-none" align="start">
        <MiniCalendar />
      </PopoverContent>
    </Popover>
  );
};
`;

content = content.replace(customDatePickerRegex, miniCalendarCode);

// 3. Move DatePicker down after Seat selection
const datePickerBlockRegex = /<div className="space-y-4">\s*<div>\s*<label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1\.5">Reservation Date<\/label>\s*<CustomDatePicker selectedDate=\{selectedDate\} onChange=\{setSelectedDate\} \/>\s*<\/div>\s*<\/div>/;
content = content.replace(datePickerBlockRegex, ''); 

const tableSelectedBlockRegex = /(<div className="space-y-4 pt-2">\s*<div>\s*<p className="text-xs font-bold text-primary uppercase tracking-wider">Selected<\/p>\s*<h4 className="text-lg font-black text-foreground">Table \{selectedTableId\}<\/h4>\s*<\/div>)/;
const updatedTableSelectedBlock = `$1\n\n                <div>\n                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Reservation Date</label>\n                  <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />\n                </div>`;

content = content.replace(tableSelectedBlockRegex, updatedTableSelectedBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully applied updates to UnifiedCheckout.tsx and ReservationsScreen.tsx');
