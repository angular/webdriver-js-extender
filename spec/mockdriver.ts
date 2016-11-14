import * as webdriver from 'selenium-webdriver';
let buildPath = require('selenium-webdriver/http').buildPath;

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
      var params = command.getParameters();
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

export class MockDriver {
  paths_: { [key:string]: string };

  // Mocked methods
  executor_: {defineCommand:
      (name: string, method: string, path: string) => void}
  schedule: (command: webdriver.Command, description: string) =>
      webdriver.promise.Promise<any>;

  constructor(sessionId: string,
      defineCallback: (name: string, method: string, path: string) => void,
      execCallback: (path: string, description: string, data: Data) => any) {

    this.paths_ = {};

    this.executor_ = {defineCommand:
      (name: string, method: string, path: string): void => {
        this.paths_[name] = path;
        defineCallback(name, method, path);
      }
    };
    this.schedule = (command: webdriver.Command, description: string) => {
      command.setParameter('sessionId', sessionId);
      var params = command.getParameters();
      return webdriver.promise.fulfilled(execCallback(
          buildPath(this.paths_[command.getName()], params),
          description, params));
    };
  }

  getExecutor() {
    return this.executor_;
  }
}
