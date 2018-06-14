import * as webdriver from 'selenium-webdriver';
let buildPath = require('selenium-webdriver/lib/http').buildPath;

export interface Data {
  sessionId: string;
  [key:string]: any;
}

export function buildMockDriver(sessionId: string,
    defineCallback: (name: string, method: string, path: string) => void,
    execCallback: (path: string, method: string, data: Data) => any):
    webdriver.WebDriver {

  let paths: { [key:string]: string } = {};
  let methods: { [key:string]: string } = {};
  let mockSession = new webdriver.Session(sessionId, {});

  return new webdriver.WebDriver(mockSession, {
    execute: (command: webdriver.Command) => {
      command.setParameter('sessionId', sessionId);
      let params = command.getParameters();
      return webdriver.promise.fulfilled(execCallback(
          buildPath(paths[command.getName()], params),
          methods[command.getName()], params));
    },
    defineCommand: (name: string, method: string, path: string) => {
      paths[name] = path;
      methods[name] = method;
      defineCallback(name, method, path);
    }
  } as webdriver.Executor);
}
