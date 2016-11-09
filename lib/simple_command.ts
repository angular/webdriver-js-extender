import {promise as Promise} from 'selenium-webdriver';

import {Extender} from './extender';

export class SimpleCommand<T> {
  constructor(
      private name: string, private params: string[], private method: string,
      private path: string) {}

  compile(extender: Extender) {
    let name = this.name;
    extender.defineCommand(name, this.params, this.method, this.path);
    return function(...args: any[]): Promise.Promise<T> {
      return extender.execCommand<T>(name, args);
    };
  }
}
