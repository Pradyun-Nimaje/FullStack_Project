require('dotenv').config();
const key = process.env.SENDGRID_API_KEY;
console.log('Key length:', key ? key.length : 'undefined');
console.log('Starts with SG.:', key ? key.startsWith('SG.') : 'N/A');
console.log('First 3 chars:', key ? key.substring(0, 3) : 'N/A');
