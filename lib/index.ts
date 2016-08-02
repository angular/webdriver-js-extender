let webdriver = require('selenium-webdriver');
import {Extender} from './extender';
import {DeferredExecutor} from './deferredExecutor';

export interface ExtendedWebDriver extends webdriver.WebDriver {
  getNetworkConnection: () => webdriver.promise.Promise<number>;
  setNetworkConnection: (type: number) => webdriver.promise.Promise<any>;
}

export function extend(baseDriver: webdriver.WebDriver): ExtendedWebDriver {
  var extender = new Extender(baseDriver);
  let extendedDriver : ExtendedWebDriver = <ExtendedWebDriver>baseDriver;

  // Get Network Connection
  extender.defineCommand('getNetworkConnection', [],
    'GET', '/session/:sessionId/network_connection');
  extendedDriver.getNetworkConnection = () => {
    return extender.execCommand('getNetworkConnection', []);
  };

  // Set Network Connection
  extender.defineCommand('setNetworkConnection', ['type'],
    'POST', '/session/:sessionId/network_connection');
  extendedDriver.setNetworkConnection = (type: number) => {
    return extender.execCommand('setNetworkConnection', [type]);
  };

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
  lib_command.DeferredExecutor = DeferredExecutor;
  executors.DeferredExecutor = DeferredExecutor;
  // Based off of https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/executors.js#L43
  executors.createExecutor = (url: any, opt_agent?: any, opt_proxy?: any) => {
    url = Promise.resolve(url);
    return new DeferredExecutor(url.then((url: any) => {
      var client = new http.HttpClient(url, opt_agent, opt_proxy);
      return new http.Executor(client);
    }));
  };
}
