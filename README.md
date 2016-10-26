# Process as Promised #

##### A small lib for (mostly) promisified native process IPC communication #####


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
1. No dependancies!
2. Oh-so useful
3. _insanely_ performant
4. Can be used with async/await
