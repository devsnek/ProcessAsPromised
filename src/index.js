const EventEmitter = require('events').EventEmitter;

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

/**
 * This is a small lib for (mostly) promisified process ipc communication
 * @example
 * // parent
 * p.send('info').then(console.log) // 'mydata'
 *
 * // child
 * p.on('info', (data, callback) => {
 *   callback('mydata');
 * });
 */
class ProcessCallAndResponse extends EventEmitter {
  /**
   * @param {Process} [p=process] Optional process to pass
   */
  constructor (p) {
    super();
    this.process = p || process;
    this.process.on('message', message => {
      if (!('__ID' in message)) return;
      const tracker = message.__ID;
      const callback = data => this.process.send({__ID: tracker, data});
      this.emit(message.event, message.data, callback);
    });
  }

  /**
   * Send an event through the ipc channel
   * @param {String} event The name of the event
   * @param {*} data The data to send with the event
   * @returns {Promise<*>}
   */
  send (event, data) {
    return new Promise((resolve, reject) => {
      const tracker = uuid();
      this.process.send({__ID: tracker, event, data});
      const handler = message => {
        if (message.__ID !== tracker) return;
        this.process.removeListener('message', handler);
        resolve(message.data);
      }
      this.process.on('message', handler);
    });
  }
}

module.exports = ProcessCallAndResponse;
