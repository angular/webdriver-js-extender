let webdriver = require('selenium-webdriver');
let Command = require('selenium-webdriver/lib/command').Command;
let buildPath = require('selenium-webdriver/http').buildPath;

export function buildMockDriver(sessionId: number, 
    defineCallback: (name: string, method: string, path: string) => void,
    execCallback: (path: string, method: string, data: Object) => any):
    webdriver.WebDriver {

  let paths: { [key:string]: string } = {};
  let methods: { [key:string]: string } = {};
  let mockSession = new (webdriver as any).Session(sessionId, {});

  return new (webdriver as any).WebDriver(mockSession, {
    execute: (command: Command) => {
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
  });
}

export class MockDriver {
  paths_: { [key:string]: string };

  // Mocked methods
  executor_: {defineCommand:
      (name: string, method: string, path: string) => void}
  schedule: (command: Command, description: string) =>
      webdriver.promise.Promise<any>;

  constructor(sessionId: number,
      defineCallback: (name: string, method: string, path: string) => void,
      execCallback: (path: string, description: string, data: Object) => any) {

    this.paths_ = {};

    this.executor_ = {defineCommand:
      (name: string, method: string, path: string): void => {
        this.paths_[name] = path;
        defineCallback(name, method, path);
      }
    };
    this.schedule = (command: Command, description: string) => {
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
