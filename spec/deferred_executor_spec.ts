import * as webdriver from 'selenium-webdriver';
import {DeferredExecutor} from '../lib/deferred_executor';


describe('Deferred Executor', () => {
  function makeExecutor(done: Function) {
    return {
      execute: (command: any) => {
        expect(command).toBe('command');
        done();
      },
      defineCommand: (name: string, method: string, path: string) => {
        expect(name).toBe('name');
        expect(method).toBe('method');
        expect(path).toBe('path');
        done();
      }
    };
  };

  it('should call execute on pending executors', (done) => {
    let deferred = webdriver.promise.defer();
    var deferredExecutor = new DeferredExecutor(deferred.promise);

    deferredExecutor.execute('command');
    deferred.fulfill(makeExecutor(done));
  });

  it('should call execute on fulfilled executors', (done) => {
    let deferred = webdriver.promise.defer();
    var deferredExecutor = new DeferredExecutor(deferred.promise);

    deferred.fulfill(makeExecutor(done));
    deferredExecutor.execute('command');
  });

  it('should call defineCommand on pending executors', (done) => {
    let deferred = webdriver.promise.defer();
    var deferredExecutor = new DeferredExecutor(deferred.promise);

    deferredExecutor.defineCommand('name', 'method', 'path');
    deferred.fulfill(makeExecutor(done));
  });

  it('should call defineCommand on fulfilled executors', (done) => {
    let deferred = webdriver.promise.defer();
    var deferredExecutor = new DeferredExecutor(deferred.promise);

    deferred.fulfill(makeExecutor(done));
    deferredExecutor.defineCommand('name', 'method', 'path');
  });
});
