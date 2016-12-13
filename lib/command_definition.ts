import {posix as path} from 'path';
import {promise as Promise} from 'selenium-webdriver';

import {Extender} from './extender';

export class CommandDefinition<T> {
  constructor(
      public name: string, public params: string[], public method: 'GET'|'POST'|'DELETE'|'PUT',
      public path: string, private preprocessParams: (...args: any[]) => any[] = (x) => x) {}

  compile(extender: Extender, silentFailure: boolean) {
    try {
      extender.defineCommand(
          this.name, this.params, this.method, path.join('/session/:sessionId', this.path));
      return (...args: any[]) => {
        return extender.execCommand(this.name, this.method, this.preprocessParams(args));
      }
    } catch (e) {
      if (silentFailure) {
        return (...args: any[]) => {
          throw new Error(
              'Command "' + this.name + '" could not be extended onto WebDriver instance. ' +
              'This is generally a result of using `directConnect` in protractor.');
        };
      } else {
        throw e;
      }
    }
  }
}
