const fs = require('fs');

const path = 'src/dining/components/UnifiedCheckout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/MOCK_RESERVED_TIMES\[selectedTableId\]\?\.includes\(selectedTime\)/g, 'currentTableReservedTimes.includes(selectedTime)');
content = content.replace(/const hasRes = MOCK_RESERVED_TIMES\[id\]\?\.length > 0;/g, 'const hasRes = fetchedReservations.some(r => r.tableId === id && r.date === selectedDate);');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed MOCK_RESERVED_TIMES references');
