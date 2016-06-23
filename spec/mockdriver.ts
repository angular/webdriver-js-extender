let webdriver = require('selenium-webdriver');
let Command = require('selenium-webdriver/lib/command').Command;
let buildPath = require('selenium-webdriver/http').buildPath;

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
}
