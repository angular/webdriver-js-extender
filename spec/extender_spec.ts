import * as webdriver from 'selenium-webdriver';
import {Extender} from '../lib/extender';
import {buildMockDriver, Data} from './mockdriver';

let noop_define = (n: string, m: string, p: string) => {};
let noop_exec = (p: string, m: string, d: Object) => {};

describe('extender', () => {
  let sessionId = '1234';

  it('should call executor_.defineCommand', (done) => {
    let name = 'customCommand';
    let method = 'post';
    let path = '/custom/command';
    let mockdriver = buildMockDriver(sessionId,
      (n: string, m: string, p: string) => {
        expect(n).toEqual(name);
        expect(m).toEqual(method);
        expect(p).toEqual(path);
        done();
      },
    noop_exec);
    let extender = new Extender(mockdriver);
    extender.defineCommand(name, [], method, path);
  });

  it('should schedule custom commands', (done) => {
    let name = 'customCommand';
    let method = 'post';
    let path = '/custom/command';
    let mockdriver = buildMockDriver(sessionId, noop_define,
      (p: string, m: string, d: Data) => {
        expect(p).toEqual(path);
        expect(m).toEqual(method);
        expect(d['sessionId']).toEqual(sessionId);
        expect(Object.keys(d).length).toEqual(1);
        done();
      }
    );
    let extender = new Extender(mockdriver);
    extender.defineCommand(name, [], method, path);
    extender.execCommand(name, method, []);
  });

  it('should use command parameters', (done) => {
    let name = 'customCommand';
    let method = 'post';
    let paramNames = ['var1', 'var2'];
    let paramValues = ['val1', 'val2'];
    let path = '/custom/:var1/command';
    let mockdriver = buildMockDriver(sessionId, noop_define,
      (p: string, m: string, d: Data) => {
        expect(p).toEqual('/custom/val1/command');
        expect(m).toEqual(method);
        expect(d['sessionId']).toEqual(sessionId);
        expect(d['var2']).toEqual('val2');
        expect(Object.keys(d).length).toEqual(2);
        done();
      }
    );
    let extender = new Extender(mockdriver as webdriver.WebDriver);
    extender.defineCommand(name, paramNames, method, path);
    extender.execCommand(name, method, paramValues);
  });

  it('should not be able to exec a command that has not been defined', () => {
    let mockdriver = buildMockDriver(sessionId, noop_define, noop_exec);
    let extender = new Extender(mockdriver);
    expect(() => { extender.execCommand('', '', []); }).toThrowError(RangeError);
  });

  it('should require correct number of parameters for execution', () => {
    let name = 'customCommand';
    let method = 'post';
    let path = '/custom/:command';
    let mockdriver = buildMockDriver(sessionId, noop_define, noop_exec);
    let extender = new Extender(mockdriver);
    extender.defineCommand(name, ['command'], method, path);
    expect(() => { extender.execCommand(name, method, []); }).toThrowError(RangeError);
  });
});
