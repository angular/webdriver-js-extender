import {CommandDefinition} from './command_definition';

export let getNetworkConnection =
    new CommandDefinition<number>('getNetworkConnection', [], 'GET', '/network_connection');
export let setNetworkConnection = new CommandDefinition<void>(
    'setNetworkConnection', ['type'], 'POST', '/network_connection',
    (args: Array<number|boolean>) => {
      if (typeof args[0] == 'boolean') {
        // Transform into bitmask
        return [(args[0] ? 1 : 0) + (args[1] ? 2 : 0) + (args[2] ? 4 : 0)];
      } else {
        return args;
      }
    });
export let toggleAirplaneMode = new CommandDefinition<void>(
    'toggleAirplaneMode', [], 'POST', 'appium/device/toggle_airplane_mode');
export let toggleWiFi =
    new CommandDefinition<void>('toggleWiFi', [], 'POST', 'appium/device/toggle_wifi');
export let toggleData =
    new CommandDefinition<void>('toggleData', [], 'POST', 'appium/device/toggle_data');

export let toggleLocationServices = new CommandDefinition<void>(
    'toggleLocationServices', [], 'POST', 'appium/device/toggle_location_services');
export let getGeolocation =
    new CommandDefinition<{latitude: number, longitude: number, altitude: number}>(
        'getGeolocation', [], 'GET', '/location');
export let setGeolocation = new CommandDefinition<void>(
    'setGeolocation', ['location'], 'POST', '/location', (args: [number, number, number]) => {
      return [{latitude: args[0] || 0, longitude: args[1] || 0, altitude: args[2] || 0}];
    });

export let getCurrentDeviceActivity = new CommandDefinition<string>(
    'getCurrentDeviceActivity', [], 'GET', '/appium/device/current_activity');
export let startDeviceActivity = new CommandDefinition<void>(
    'startDeviceActivity', ['appPackage', 'appActivity', 'appWaitPackage', 'appWaitActivity'],
    'POST', '/appium/device/start_activity', (args: string[]) => {
      if (args.length == 2) {
        // No appWait, default parameters to undefined
        args[2] = undefined;
        args[3] = undefined;
      }
      if (args.length == 4) {
        return args;
      } else {
        throw new RangeError('startDeviceActivity requires 2 or 4 arguments, got ' + args.length);
      }
    });

export let getAppiumSettings = new CommandDefinition<{[name: string]: any}>(
    'getAppiumSettings', [], 'GET', '/appium/settings');
export let setAppiumSettings =
    new CommandDefinition<void>('setAppiumSettings', ['settings'], 'POST', '/appium/settings');

export let getCurrentContext =
    new CommandDefinition<string>('getCurrentContext', [], 'GET', '/context');
export let selectContext =
    new CommandDefinition<void>('selectContext', ['name'], 'POST', '/context');

export let getScreenOrientation = new CommandDefinition<'LANDSCAPE'|'PORTRAIT'>(
    'getScreenOrientation', [], 'GET', '/orientation');
export let setScreenOrientation = new CommandDefinition<void>(
    'setScreenOrientation', ['orientation'], 'POST', '/orientation', (args: [string]) => {
      let orientation = (args[0] || '').toUpperCase();
      if ((orientation != 'PORTRAIT') && (orientation != 'LANDSCAPE')) {
        throw new TypeError('Invalid orientation "' + args[0] + '"');
      }
      args[0] = orientation;
      return args;
    });

export let isDeviceLocked =
    new CommandDefinition<boolean>('isDeviceLocked', [], 'POST', '/appium/device/is_locked');
export let lockDevice = new CommandDefinition<void>(
    'lockDevice', ['seconds'], 'POST', '/appium/device/lock', (args: [number]) => {
      args[0] = args[0] || 0;
      return args;
    });
export let unlockDevice =
    new CommandDefinition<void>('unlockDevice', [], 'POST', '/appium/device/unlock');

export let installApp =
    new CommandDefinition<void>('installApp', ['appPath'], 'POST', '/appium/device/install_app');
export let isAppInstalled = new CommandDefinition<boolean>(
    'isAppInstalled', ['bundleId'], 'POST', 'appium/device/app_installed');
export let removeApp =
    new CommandDefinition<void>('removeApp', ['appId'], 'POST', '/appium/device/remove_app');

export let pullFileFromDevice = new CommandDefinition<string>(
    'pullFileFromDevice', ['path'], 'POST', '/appium/device/pull_file');
export let pullFolderFromDevice = new CommandDefinition<any>(
    'pullFolderFromDevice', ['path'], 'POST', '/appium/device/pull_folder');
export let pushFileToDevice = new CommandDefinition<void>(
    'pushFileToDevice', ['path', 'data'], 'POST', 'appium/device/push_file');

export let listContexts = new CommandDefinition<string[]>('listContexts', [], 'GET', '/contexts');
export let uploadFile = new CommandDefinition<void>('uploadFile', ['file'], 'POST', '/file');
export let switchToParentFrame =
    new CommandDefinition<void>('switchToParentFrame', [], 'POST', '/frame/parent');
export let fullscreen = new CommandDefinition<void>('fullscreen', [], 'POST', '/window/fullscreen');
export let sendAppToBackground = new CommandDefinition<void>(
    'sendAppToBackground', ['seconds'], 'POST', '/appium/app/background', (args: [number]) => {
      args[0] = args[0] || 0;
      return args;
    });
export let closeApp = new CommandDefinition<void>('closeApp', [], 'POST', '/appium/app/close');
export let getAppStrings = new CommandDefinition<string[]>(
    'getAppStrings', ['language'], 'POST', 'appium/app/strings', (args: string[]) => {
      args[0] = args.length ? args[0] : undefined;  // Default to `undefined`
      return args;
    });
export let launchSession =
    new CommandDefinition<void>('launchSession', [], 'POST', '/appium/app/launch');
export let resetApp = new CommandDefinition<void>('resetApp', [], 'POST', '/appium/app/reset');
export let hideSoftKeyboard = new CommandDefinition<void>(
    'hideSoftKeyboard', ['strategy', 'key'], 'POST', '/appium/device/hide_keyboard',
    (args: string[]) => {
      switch (args[0] || 'default') {
        case 'default':
          args[0] = 'default';
        case 'swipeDown':
        case 'tapOut':
        case 'tapOutside':
          if (args.length == 1) {
            args[1] = undefined;  // Default to `undefined`
          }
        case 'press':
        case 'pressKey':
          return args;
        default:
          throw new RangeError('Invalid keyboard hiding strategy "' + args[0] + '"');
      }
    });
export let getDeviceTime =
    new CommandDefinition<string>('getDeviceTime', [], 'GET', '/appium/device/system_time');
export let fingerprint = 
    new CommandDefinition<void>('fingerprint', ['fingerprintId'], 'POST', '/appium/device/finger_print');
export let openDeviceNotifications = new CommandDefinition<void>(
    'openDeviceNotifications', [], 'POST', '/appium/device/open_notifications');
export let rotationGesture = new CommandDefinition(
    'rotationGesture', ['x', 'y', 'duration', 'rotation', 'touchCount'], 'POST',
    '/appium/device/rotate', (args: number[]) => {
      args[0] = args[0] || 0;
      args[1] = args[1] || 0;
      args[2] = args[2] === undefined ? 1 : args[2];
      args[3] = args[3] === undefined ? 180 : args[3];
      args[4] = args[4] == undefined ? 2 : args[4];
      return args;
    });
export let shakeDevice =
    new CommandDefinition<void>('shakeDevice', [], 'POST', 'appium/device/shake');
export let sendChromiumCommand = new CommandDefinition<void>(
    'sendChromiumCommand', ['cmd', 'params'], 'POST', '/chromium/send_command');
export let sendChromiumCommandAndGetResult = new CommandDefinition<Object>(
    'sendChromiumCommandAndGetResult', ['cmd', 'params'], 'POST',
    '/chromium/send_command_and_get_result');
