const childProcess = require('child_process');
const P = require('../src/index');

const p = new P(childProcess.fork('./test_client.js'));

p.send('test', 2).then(res => {
  console.log('EXPECTING test 4')
  console.log('RESPONSE test', res);
});

p.on('hello', (data, callback) => {
  callback('OMG HI');
});
