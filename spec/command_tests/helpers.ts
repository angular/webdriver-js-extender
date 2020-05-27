import * as webdriver from 'selenium-webdriver';
import {CommandDefinition} from '../../lib/command_definition';
import * as commandDefinitions from '../../lib/command_definitions';
import {MockAppium} from '../mock-server';
import {Session, CommandList} from '../mock-server/interfaces';
import {session as commandList} from '../mock-server/commands';
import {Command} from 'selenium-mock';
import {extend} from '../../lib';
let portfinder = require('portfinder');
import * as path from 'path';

// PROJECT_PATH is where package.json is located.
// __dirname after project is compiled is built/spec/command_tests/
const PROJECT_PATH = path.resolve(__dirname, '..', '..', '..');
export const APK_PATH = path.join(PROJECT_PATH, 'spec', 'command_tests', 'totally_real_apk.apk');

let commandMap: {[location: string]: Command<Session>} = null;
function buildCommandMap(commandList: CommandList) {
  if (commandMap == null) {
    commandMap = {};
  }
  for (let commandName in commandList) {
    let command = commandList[commandName];
    if (command instanceof Command) {
      commandMap[command.method + ':' + (command.path[0] == '/' ? '':'/') + command.path] = command;
    } else {
      buildCommandMap(command);
    }
  }
}

export function initMockSeleniumStandaloneServerAndGetDriverFactory(annotateCommands = false) {
  let server: MockAppium;
  let port: number;
  beforeAll((done) => {
    portfinder.getPort((err: Error, p: number) => {
      if (err) {
        done.fail(err);
      } else {
        port = p;
        server = new MockAppium(port);
        server.start();
        done();
      }
    });
  });

  if (annotateCommands && !commandMap) {
    buildCommandMap(commandList);
  }

  return () => {
    let driver = extend(new webdriver.Builder().
        usingServer('http://localhost:' + port + '/wd/hub').
        withCapabilities({browserName: 'chrome'}).build());
    if (annotateCommands) {
      Object.keys(commandDefinitions).forEach((commandName) => {
        let clientCommand = (commandDefinitions as any)[commandName] as CommandDefinition<any>;
        let serverCommand = commandMap[clientCommand.method + ':' +
            (clientCommand.path[0] == '/' ? '' : '/') + clientCommand.path];
        let spy = spyOn(serverCommand, 'exec').and.callThrough();
        let oldFun = (driver as any)[commandName];
        (driver as any)[commandName] = function() {
          let oldCount = spy.calls.count();
          return oldFun.apply(this, arguments).then((result: any) => {
            expect(spy.calls.count()).toBe(oldCount + 1);
            let args = spy.calls.mostRecent().args;
            return {
              result: result,
              session: args[0],
              params: args[1]
            };
          });
        };
      });
    }
    return driver;
  };
}
