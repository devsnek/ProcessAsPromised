const EventEmitter = require('events').EventEmitter;

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

/**
 * This is a small lib for (mostly) promisified native process IPC communication
 * @example
 * // parent
 * p.send('info').then(console.log) // 'mydata'
 *
 * // child
 * p.on('info', (data, reply) => {
 *   reply('mydata');
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
      new Promise((resolve, reject) => {
        this.emit(message.event, message.data, resolve.bind(this));
        if (message.timeout) setTimeout(
          () => reject(new Error('PROCESS_RESOLVE_TIMEOUT')),
          message.timeout
        );
      }).then((data) => {
        this.process.send({ __ID: message.__ID, data });
      }).catch((error) => {
        this.process.send({ __ID: message.__ID, error: error.message });
      })
    });
  }

  /**
   * Send an event through the ipc channel
   * @param {String} event The name of the event
   * @param {*} data The data to send with the event
   * @returns {Promise<*>}
   */
  send (event, data, timeout) {
    return new Promise((resolve, reject) => {
      const tracker = uuid();
      this.process.send({ __ID: tracker, event, data, timeout });
      const handler = message => {
        if (message.__ID !== tracker) return;
        this.process.removeListener('message', handler);
        if (message.error) reject(message.error);
        else resolve(message.data);
      }
      this.process.on('message', handler);
    });
  }
}

module.exports = ProcessCallAndResponse;
