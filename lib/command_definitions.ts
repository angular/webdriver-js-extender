import {CommandDefinition} from './command_definition';

export let getNetworkConnection =
    new CommandDefinition<number>('getNetworkConnection', [], 'GET', '/network_connection');
export let setNetworkConnection =
    new CommandDefinition<void>('setNetworkConnection', ['type'], 'POST', '/network_connection');

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
      args[0] = args.length ? args[0] : undefined; // Default to `undefined`
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
            args[1] = undefined; // Default to `undefined`
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
