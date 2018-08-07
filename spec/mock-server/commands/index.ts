/**
 * In this file we define all the commands which run against a particular webdriver session, but
 * do not belong in `./appium.ts` or `./storage.ts`.
 */
import {Command} from 'selenium-mock';
import {SessionCommandList, ElementCommandList, Session} from '../interfaces';
import {noopFactory as noop, getterFactory as getter, setterFactory as setter, constFactory} from './helpers';
import {appium} from './appium';
import {chromium} from './chromium';
import {storageFactory} from './storage';

export let session = {
  element: {} as ElementCommandList,
  sessionStorage: storageFactory('session'),
  localStorage: storageFactory('local'),
  appium: appium,
  chromium: chromium,
} as SessionCommandList;

session.currentContext = getter('context', 'currentContext');
session.selectContext = setter('context', 'currentContext', 'name');
session.listContexts = constFactory('GET', 'contexts', ['WEBVIEW_1']);

session.uploadFile = noop('file');

session.getNetworkConnection = getter('network_connection', 'networkConnection'); 
session.setNetworkConnection = setter('network_connection', 'networkConnection', 'type'); 
session.toggleAirplaneMode =
  new Command<Session>('POST', 'appium/device/toggle_airplane_mode', (session) => {
    session.networkConnection ^= 1;
  });
session.toggleWiFi =
  new Command<Session>('POST', 'appium/device/toggle_wifi', (session) => {
    session.networkConnection ^= 2;
  });
session.toggleData =
  new Command<Session>('POST', 'appium/device/toggle_data', (session) => {
    session.networkConnection ^= 4;
  });

session.toggleLocationServices =
  new Command<Session>('POST', 'appium/device/toggle_location_services', (session) => {
    session.locationEnabled = !session.locationEnabled;
  });
session.getGeolocation =
  new Command<Session>('GET', '/location', (session) => {
    if (!session.locationEnabled) {
      throw 'Location services disabled';
    }
    return session.location;
  });
session.setGeolocation =
  new Command<Session>('POST', '/location', (session, params) => {
    if (!session.locationEnabled) {
      throw 'Location services disabled';
    }
    session.location = params['location'];
  });

session.getOrientation = getter('orientation');
session.setOrientation = setter('orientation');

session.switchToParentFrame = noop('frame/parent');
session.fullscreen = noop('window/fullscreen');

session.performMultiAction = noop('touch/multi/perform');
session.performTouchAction = noop('touch/perform');

session.element.elementIdLocationInView = constFactory('GET', '/element/:id/location_in_view', {x: 0, y: 0});

/**
session.sendChromiumCommand = noop('chromium/send_command');
session.sendChromiumCommandAndGetResult = noop('chromium/send_command_and_get_result');
*/
