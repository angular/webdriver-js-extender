import {promise as wdpromise, WebDriver} from 'selenium-webdriver';

import {CommandDefinition} from './command_definition';
import * as commandDefinitions from './command_definitions';
import {Extender} from './extender';

export interface ExtendedWebDriver extends WebDriver {
  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/getNetworkConnection
  getNetworkConnection: () => wdpromise.Promise<0|1|2|3|4|5|6|7>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/setNetworkConnection
  // This implementation differs slightly, allowing you to use three booleans instead of one bitmask
  setNetworkConnection:
      (typeOrAirplaneMode: 0|1|2|3|4|5|6|7|boolean, wifi?: boolean,
       data?: boolean) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/toggleAirplaneMode
  toggleAirplaneMode: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/toggleWiFi
  toggleWiFi: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/toggleData
  toggleData: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/toggleLocationServices
  toggleLocationServices: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/location
  // This implementation differs slightly, putting setters and getters into different methods
  getGeolocation: () => wdpromise.Promise<{latitude: number, longitude: number, altitude: number}>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/location
  // This implementation differs slightly, putting setters and getters into different methods
  setGeolocation:
      (latitude?: number, longitude?: number, altitude?: number) => wdpromise.Promise<void>;

  // See
  // https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/getCurrentDeviceActivity
  getCurrentDeviceActivity: () => wdpromise.Promise<string>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/startActivity.js
  startDeviceActivity:
      (appPackage: string, appActivity: string, appWaitPackage?: string,
       appWaitActivity?: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/settings.js
  // This implementation differs slightly, putting setters and getters into different methods
  getAppiumSettings: () => wdpromise.Promise<{[name: string]: any}>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/settings.js
  // This implementation differs slightly, putting setters and getters into different methods
  setAppiumSettings: (settings: {[name: string]: any}) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/context.js
  // This implementation differs slightly, putting setters and getters into different methods
  getCurrentContext: () => wdpromise.Promise<string>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/context.js
  // This implementation differs slightly, putting setters and getters into different methods
  selectContext: (name: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/contexts.js
  listContexts: () => wdpromise.Promise<string[]>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/orientation
  // This implementation differs slightly, putting setters and getters into different methods
  getScreenOrientation: () => wdpromise.Promise<'LANDSCAPE'|'PORTRAIT'>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/orientation
  // This implementation differs slightly, putting setters and getters into different methods
  setScreenOrientation: (orientation: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/isLocked
  isDeviceLocked: () => wdpromise.Promise<boolean>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/lock
  lockDevice: (delay?: number) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/unlock
  unlockDevice: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/installApp
  installApp: (appPath: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/isAppInstalled
  isAppInstalled: (bundleId: string) => wdpromise.Promise<boolean>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/removeApp
  removeApp: (appId: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/pullFile
  pullFileFromDevice: (path: string) => wdpromise.Promise<string>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/pullFolder
  pullFolderFromDevice: (path: string) => wdpromise.Promise<any>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/pushFile
  pushFileToDevice: (path: string, base64Data: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/file
  uploadFile: (base64Data: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/frameParent
  switchToParentFrame: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/windowHandleFullscreen
  fullscreen: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/background
  sendAppToBackground: (delay?: number) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/closeApp
  closeApp: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/getAppStrings
  getAppStrings: (language?: string) => wdpromise.Promise<string[]>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/launch
  launchSession: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/reset
  resetApp: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/hideDeviceKeyboard
  hideSoftKeyboard:
      (strategy?: 'default'|'tapOutside'|'tapOut'|'swipeDown'|'pressKey'|'press',
       key?: string) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/getDeviceTime
  getDeviceTime: () => wdpromise.Promise<string>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/openNotifications
  openDeviceNotifications: () => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/rotate
  // This implementation differs slightly, defaulting to a 180 degree rotation
  rotationGesture:
      (x?: number, y?: number, duration?: number, rotation?: number,
       touchCount?: 1|2|3|4|5) => wdpromise.Promise<void>;

  // See https://github.com/webdriverio/webdriverio/blob/v4.6.1/lib/protocol/shake
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
