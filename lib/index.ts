let webdriver = require('selenium-webdriver');
import {Extender} from '../lib/extender';

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
