# Process as Promised #

[![npm](https://img.shields.io/npm/v/process-as-promised.svg?maxAge=3600)](https://www.npmjs.com/package/process-as-promised)
[![npm](https://img.shields.io/npm/dt/process-as-promised.svg?maxAge=3600)](https://www.npmjs.com/package/process-as-promised)
[![David](https://david-dm.org/guscaplan/ProcessAsPromised.svg)](https://david-dm.org/guscaplan/ProcessAsPromised)

[![NPM](https://nodei.co/npm/process-as-promised.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/process-as-promised/)

```js
/*
  a simple example
  you could also take a look in /test
*/

// parent process
const p = new ProcessAsPromised(process.fork('child'));

p.send('info', 'now').then(res => {
  console.log(res) // {stats: 12, memes: 69}
});

// child process
const p = new ProcessAsPromised();

p.on('info', (data, callback) => {
  if (data === 'now') callback({stats: 12, memes: 69});
  else setTimeout(() => {
    callback({stats: 12, memes: 69});
  }, 1000);
});
```

#### Reasons to use: ####
1. No dependencies!
2. Oh-so useful
3. _insanely_ performant
4. Can be used with async/await
