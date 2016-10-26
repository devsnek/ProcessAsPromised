## Process as Promised ##

A small lib for (mostly) promisified native process IPC communication

```js
// parent process
const p = new ProcessAsPromised(process.fork('child'));

p.send('info', 'now').then(res => {
  console.log(res) // {stats: 12, memes: 69}
});

// child process
const p = new ProcessAsPromised();

p.on('info', (data, callback) => {
  if (data === 'now') callback({stats: 12, memes: 69});
});
```

Reasons to use:
1. Oh-so useful
2. _insanely_ performant
