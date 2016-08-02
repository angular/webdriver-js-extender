let webdriver = require('selenium-webdriver');

/*
 * Wraps a promised {@link Executor}, ensuring no commands are executed until
 * the wrapped executor has been fully resolved.
 *
 * selenium-webdriver uses this internally, and we overwrite it to give it the
 * defineCommand() function
 *
 * Based off of https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/lib/command.js#L240
 *
 * @implements {Executor}
 */
export class DeferredExecutor {

  execute: (command: any) => webdriver.promise.Promise<any>;
  defineCommand: (name: string, method: string, path: string) => void;

  /**
   * @param {!Promise<Executor>} delegate The promised delegate, which
   *     may be provided by any promise-like thenable object.
   */
  constructor(delegate: webdriver.promise.Promise<any>) {
  
    /** @override */
    this.execute = function(command: any) {
      return delegate.then((executor: any) => {
        return executor.execute(command);
      });
    };
  
    this.defineCommand = function(name: string, method: string, path: string) {
      delegate.then((executor: any) => {
        executor.defineCommand(name, method, path);
      });
    };
  }
}
