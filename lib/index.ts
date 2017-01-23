import {promise as wdpromise, WebDriver} from 'selenium-webdriver';

import {CommandDefinition} from './command_definition';
import * as commandDefinitions from './command_definitions';
import {DeferredExecutor} from './deferred_executor';
import {Extender} from './extender';

export interface ExtendedWebDriver extends WebDriver {
  getNetworkConnection: () => wdpromise.Promise<0|1|2|3|4|5|6|7>;
  setNetworkConnection:
      (typeOrAirplaneMode: 0|1|2|3|4|5|6|7|boolean, wifi?: boolean,
       data?: boolean) => wdpromise.Promise<void>;
  toggleAirplaneMode: () => wdpromise.Promise<void>;
  toggleWiFi: () => wdpromise.Promise<void>;
  toggleData: () => wdpromise.Promise<void>;
  toggleLocationServices: () => wdpromise.Promise<void>;
  getGeolocation: () => wdpromise.Promise<{latitude: number, longitude: number, altitude: number}>;
  setGeolocation:
      (latitude?: number, longitude?: number, altitude?: number) => wdpromise.Promise<void>;
  getCurrentDeviceActivity: () => wdpromise.Promise<string>;
  startDeviceActivity:
      (appPackage: string, appActivity: string, appWaitPackage?: string,
       appWaitActivity?: string) => wdpromise.Promise<void>;
  getAppiumSettings: () => wdpromise.Promise<{[name: string]: any}>;
  setAppiumSettings: (settings: {[name: string]: any}) => wdpromise.Promise<void>;
  getCurrentContext: () => wdpromise.Promise<string>;
  selectContext: (name: string) => wdpromise.Promise<void>;
  getScreenOrientation: () => wdpromise.Promise<'LANDSCAPE'|'PORTRAIT'>;
  setScreenOrientation: (orientation: string) => wdpromise.Promise<void>;
  isDeviceLocked: () => wdpromise.Promise<boolean>;
  lockDevice: (delay?: number) => wdpromise.Promise<void>;
  unlockDevice: () => wdpromise.Promise<void>;
  installApp: (appPath: string) => wdpromise.Promise<void>;
  isAppInstalled: (bundleId: string) => wdpromise.Promise<boolean>;
  removeApp: (appId: string) => wdpromise.Promise<void>;
  pullFileFromDevice: (path: string) => wdpromise.Promise<string>;
  pullFolderFromDevice: (path: string) => wdpromise.Promise<any>;
  pushFileToDevice: (path: string, base64Data: string) => wdpromise.Promise<void>;
  listContexts: () => wdpromise.Promise<string[]>;
  uploadFile: (base64Data: string) => wdpromise.Promise<void>;
  switchToParentFrame: () => wdpromise.Promise<void>;
  fullscreen: () => wdpromise.Promise<void>;
  sendAppToBackground: (delay?: number) => wdpromise.Promise<void>;
  closeApp: () => wdpromise.Promise<void>;
  getAppStrings: (language?: string) => wdpromise.Promise<string[]>;
  launchSession: () => wdpromise.Promise<void>;
  resetApp: () => wdpromise.Promise<void>;
  hideSoftKeyboard:
      (strategy?: 'default'|'tapOutside'|'tapOut'|'swipeDown'|'pressKey'|'press',
       key?: string) => wdpromise.Promise<void>;
  getDeviceTime: () => wdpromise.Promise<string>;
  openDeviceNotifications: () => wdpromise.Promise<void>;
  rotationGesture:
      (x?: number, y?: number, duration?: number, rotation?: number,
       touchCount?: 1|2|3|4|5) => wdpromise.Promise<void>;
  shakeDevice: () => wdpromise.Promise<void>;
}

export function extend(baseDriver: WebDriver, fallbackGracefully = false): ExtendedWebDriver {
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
    return new DeferredExecutor(wdpromise.when(url, (url: any) => {
      var client = new http.HttpClient(url, opt_agent, opt_proxy);
      return new http.Executor(client);
    }));
  };
}
