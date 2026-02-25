const https = require('https');
const url = require('url');

let target = 'https://script.google.com/macros/s/AKfycbxCoU8r3836eOfJb3sXgPlERtHp1iLBdzCAJ2rMB1WMHiHekyJlzQaEySdicRweebfd2A/exec?action=getPendingUsers';
const data = JSON.stringify({});

function doReq(u, redirects = 0) {
  if (redirects > 5) {
    console.error('Too many redirects');
    process.exit(1);
  }
  const parsed = url.parse(u);
  const opts = {
    hostname: parsed.hostname,
    path: parsed.path + (parsed.hash || ''),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(opts, (res) => {
    let body = '';
    res.on('data', (c) => body += c);
    res.on('end', () => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('redirect ->', res.headers.location);
        doReq(res.headers.location, redirects + 1);
      } else {
        console.log('STATUS', res.statusCode);
        console.log(body);
      }
    });
  });

  req.on('error', (e) => {
    console.error('ERR', e.message);
  });

  req.write(data);
  req.end();
}

doReq(target);
