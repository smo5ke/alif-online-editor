const WebSocket = require('ws');
const ws = new WebSocket('wss://alif-playground.onrender.com');

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'run', code: 'لكل س في مدى(3):\n\tرقم = صحيح(ادخل("ادخل العدد: "))\n\tاطبع(رقم)' }));
  
  setTimeout(() => {
    ws.send(JSON.stringify({ type: 'input', text: '1' }));
  }, 2000);
});

ws.on('message', (data) => {
  console.log('Message:', data.toString());
  const json = JSON.parse(data.toString());
  if (json.type === 'done') ws.close();
});

ws.on('error', (err) => console.error(err));
