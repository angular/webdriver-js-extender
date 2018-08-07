/**
 * Custom chromium commands
 *
 * In this file we define all the custom commands which are part of the chromium API but will probably
 * never be part of the webdriver spec or JsonWireProtocol.
 */

import {Command} from 'selenium-mock';
import {ChromiumCommandList} from '../interfaces';
import {noopFactory as noop} from './helpers';

export let chromium = {
  sendChromiumCommand: noop('chromium/send_command'),
  sendChromiumCommandAndGetResult: noop('chromium/send_command_and_get_result')
} as ChromiumCommandList;

