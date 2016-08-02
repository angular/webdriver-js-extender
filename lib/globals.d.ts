declare interface Object { [key: string]: any; }

declare class Command {
  constructor(name: string);
  getName: () => string;
  setParameter: (name: string, value: any) => void;
  getParameter: (name: string) => string;
  getParameters: () => Object;
}

declare namespace webdriver {
  namespace promise {
    class Promise<T> {
      then: Function;
    }
    var fulfilled: <T>(value: T) => webdriver.promise.Promise<T>
  }
  class WebDriver {
    executor_: any | void;
    getExecutor: Function | void;
    schedule: <T>(cmd: Command, desc: string) => webdriver.promise.Promise<T>;
  }
}

declare namespace Promise {
  var resolve: Function
} 
