import * as webdriver from 'selenium-webdriver';

import {DeferredExecutor} from './deferred_executor';
import {Extender} from './extender';
import * as SimpleCommands from './simple_commands';

export interface ExtendedWebDriver extends webdriver.WebDriver {
  getNetworkConnection: () => webdriver.promise.Promise<number>;
  setNetworkConnection: (type: number) => webdriver.promise.Promise<void>;
}

export function extend(baseDriver: webdriver.WebDriver, fallbackOnWD = false): ExtendedWebDriver {
  var extender = new Extender(baseDriver);
  let extendedDriver: ExtendedWebDriver = baseDriver as ExtendedWebDriver;

  // Simple commands
  extendedDriver.getNetworkConnection =
      SimpleCommands.getNetworkConnection.compile(extender, fallbackOnWD);
  extendedDriver.setNetworkConnection =
      SimpleCommands.setNetworkConnection.compile(extender, fallbackOnWD);

  return extendedDriver;
}

/**
 * Patches webdriver so that the extender can defie new commands.
 *
 * @example
 * patch(require('selenium-webdriver/lib/command'),
 *     require('selenium-webdriver/executors'),
 *     require('selenium-webdriver/http'));
 *
 * @param {*} lib_command The object at 'selenium-webdriver/lib/command'
 * @param {*} executors The object at 'selenium-webdriver/executors'
 * @param {*} http The object at 'selenium-webdriver/http'
 */
export function patch(lib_command: any, executors: any, http: any) {
  if (lib_command.DeferredExecutor === undefined) {
    throw new Error(
        'The version of `selenium-webdriver` you provided does ' +
        'not use Deferred Executors.  Are you using version 3.x or above? If ' +
        'so, you do not need to call the `patch()` function.');
  }
  lib_command.DeferredExecutor = DeferredExecutor;
  executors.DeferredExecutor = DeferredExecutor;
  // Based off of
  // https://github.com/SeleniumHQ/selenium/blob/selenium-2.53.0/javascript/node/selenium-webdriver/executors.js#L45
  executors.createExecutor = (url: any, opt_agent?: any, opt_proxy?: any) => {
    return new DeferredExecutor(webdriver.promise.when(url, (url: any) => {
      var client = new http.HttpClient(url, opt_agent, opt_proxy);
      return new http.Executor(client);
    }));
  };
}
