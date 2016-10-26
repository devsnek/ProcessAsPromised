const P = require('../src/index');

const p = new P();

p.on('test', (data, callback) => {
  setTimeout(() => {
    callback(data + data);
  }, 1000);
})

p.send('hello').then(response => {
  console.log('EXPECTING hello OMG HI')
  console.log('RESPONSE hello', response);
});
