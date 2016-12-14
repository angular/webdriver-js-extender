import * as webdriver from 'selenium-webdriver';

import {CommandDefinition} from './command_definition';
import * as commandDefinitions from './command_definitions';
import {DeferredExecutor} from './deferred_executor';
import {Extender} from './extender';

export interface ExtendedWebDriver extends webdriver.WebDriver {
  getNetworkConnection: () => webdriver.promise.Promise<number>;
  setNetworkConnection: (type: number) => webdriver.promise.Promise<void>;

  listContexts: () => webdriver.promise.Promise<string[]>;
  uploadFile: (base64Data: string) => webdriver.promise.Promise<void>;
  switchToParentFrame: () => webdriver.promise.Promise<void>;
  fullscreen: () => webdriver.promise.Promise<void>;
  sendAppToBackground: (delay?: number) => webdriver.promise.Promise<void>;
  closeApp: () => webdriver.promise.Promise<void>;
  getAppStrings: (language?: string) => webdriver.promise.Promise<string[]>;
  launchSession: () => webdriver.promise.Promise<void>;
  resetApp: () => webdriver.promise.Promise<void>;
  hideSoftKeyboard:
      (strategy?: 'default'|'tapOutside'|'tapOut'|'swipeDown'|'pressKey'|'press',
       key?: string) => webdriver.promise.Promise<void>;
  getDeviceTime: () => webdriver.promise.Promise<string>;
  openDeviceNotifications: () => webdriver.promise.Promise<void>;
  rotationGesture:
      (x?: number, y?: number, duration?: number, rotation?: number,
       touchCount?: 1|2|3|4|5) => webdriver.promise.Promise<void>;
  shakeDevice: () => webdriver.promise.Promise<void>;
}

export function extend(
    baseDriver: webdriver.WebDriver, fallbackGracefully = false): ExtendedWebDriver {
  var extender = new Extender(baseDriver);
  let extendedDriver: ExtendedWebDriver = baseDriver as ExtendedWebDriver;

  for (let commandName in commandDefinitions) {
    (extendedDriver as any)[commandName] =
        (commandDefinitions as any)[commandName].compile(extender, fallbackGracefully);
  }

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
