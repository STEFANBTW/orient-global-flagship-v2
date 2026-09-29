import https from 'https';

https.get('https://stefanbtw.github.io/orient-bakery-hub/scripts/studio/src/app/dashboard/page.html', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
