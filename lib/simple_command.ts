import {promise as Promise} from 'selenium-webdriver';

import {Extender} from './extender';

export class SimpleCommand<T> {
  constructor(
      private name: string, private params: string[], private method: string,
      private path: string) {}

  compile(extender: Extender, silentFailure: boolean) {
    let name = this.name;
    try {
      extender.defineCommand(name, this.params, this.method, this.path);
      return function(...args: any[]): Promise.Promise<T> {
        return extender.execCommand<T>(name, args);
      };
    } catch (e) {
      if (silentFailure) {
        return function(...args: any[]) {
          throw new Error(
              'Command "' + name + '" could not be extended onto WebDriver instance. ' +
              'This is generally a result of using `directConnect` in protractor.');
        };
      } else {
        throw e;
      }
    }
  }
}
