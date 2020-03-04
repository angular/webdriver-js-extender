/**
 * Custom appium commands
 *
 * In this file we define all the custom commands which are part of the appium API but will probably
 * never be part of the webdriver spec or JsonWireProtocol.
 */

import * as fs from 'fs';
import {Command} from 'selenium-mock';
import {AppiumCommandList, AppiumAppCommandList, AppiumDeviceCommandList, Session, FsFolder} from '../interfaces';
import {noopFactory as noop, getterFactory as getter, setterFactory as setter, constFactory} from './helpers';

let app = {} as AppiumAppCommandList;

let device = {} as AppiumDeviceCommandList;

export let appium = {
  app: app,
  device: device
} as AppiumCommandList;

app.toBackground =
  new Command<Session>('POST', 'appium/app/background', (session, params) => {
    return new Promise((resolve) => {
      setTimeout(resolve, (params['seconds']||0)*1000);
    });
  });
app.closeApp = noop('appium/app/close');
app.getStrings = constFactory('POST', '/appium/app/strings', ['Hello', 'World']);
app.launch = noop('appium/app/launch');
app.reset = noop('appium/app/reset');

device.getActivity = getter('/appium/device/current_activity', 'activity');
device.startActivity = setter('/appium/device/start_activity', 'activity', 'appActivity');

device.hideKeyboard = noop('/appium/device/hide_keyboard');
device.sendKeyEvent = noop('/appium/device/keyevent');
device.pressKeyCode = noop('/appium/device/press_keycode');
device.longPressKeyCode = noop('/appium/device/long_press_keycode');

device.installApp =
  new Command<Session>('POST', 'appium/device/install_app', (session, params) => {
    fs.readFile(params['appPath'], (err, contents) => {
      if (err) {
        throw 'Error while trying to read "' + params['appPath'] + ': ' + err;
      }
      session.installedApps.push(contents.toString().trim());
    });
  });
device.isAppInstalled =
  new Command<Session>('POST', 'appium/device/app_installed', (session, params) => {
    return session.installedApps.some((app) => {
      return app === params['bundleId'] || app === params['appId'];
    });
  });
device.removeApp =
  new Command<Session>('POST', '/appium/device/remove_app', (session, params) => {
    session.installedApps = session.installedApps.filter((app) => {
      return app !== params['bundleId'] && app !== params['appId'];
    });
  });

device.isLocked = getter('/appium/device/is_locked', 'locked', 'POST');
device.lock =
  new Command<Session>('POST', 'appium/device/lock', (session, params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        session.locked = true;
        resolve();
      }, (params['seconds']||0)*1000);
    });
  });
device.unlock =
  new Command<Session>('POST', 'appium/device/unlock', (session) => {
    session.locked = false;
  });

device.pullFile =
  new Command<Session>('POST', '/appium/device/pull_file', (session, params) => {
    let path = params['path'].split('/');
    if (path[0].length == 0) {
      path = path.slice(1);
    };
    let file: string | FsFolder = session.files;
    for (let folder of path) {
      file = (file as FsFolder)[folder];
    }
    return file;
  });
device.pullFolder =
  new Command<Session>('POST', '/appium/device/pull_folder', (session, params) => {
    let path = params['path'].split('/');
    if (path[0].length == 0) {
      path = path.slice(1);
    };
    let folder = session.files;
    for (let name of path) {
      folder = folder[name] as FsFolder;
    }
    return folder;
  });
device.pushFile =
  new Command<Session>('POST', 'appium/device/push_file', (session, params) => {
    let path = params['path'].split('/');
    if (path[0].length == 0) {
      path = path.slice(1);
    };
    let folder: FsFolder = session.files;
    for (let i = 0; i < path.length-1; i++) {
      if (folder[path[i]] === undefined) {
        folder[path[i]] = {};
      }
      folder = folder[path[i]] as FsFolder;
    }
    folder[path[path.length-1]] = params['data'];
  });


device.getTime = constFactory('GET', '/appium/device/system_time', new Date().toString());
device.openNotifications = noop('/appium/device/open_notifications');
device.rotate = noop('appium/device/rotate');
device.shake = noop('appium/device/shake');

device.startRecordingScreen = noop('appium/start_recording_screen');
device.stopRecordingScreen = noop('appium/stop_recording_screen');


appium.getSettings = getter('/appium/settings');
appium.setSettings = setter('/appium/settings');
appium.setImmediateValue = noop('/appium/element/:id/value');
