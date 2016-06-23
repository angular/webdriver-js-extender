let webdriver = require('selenium-webdriver');
import {extend} from '../lib';
import {MockDriver} from './mockdriver';


describe('extender', () => {
  it('should support setting/getting the network connection', (done) => {
    let ncType : number;
    let baseDriver = new MockDriver(42, (n: string, m: string, p: string) => {},
      (path: string, description: string, data: Object) => {
        expect(path).toEqual('/session/42/network_connection');
        if(description[16] == 'g') {
          expect(Object.keys(data).length).toEqual(0);
          return ncType;
        } else if (description[16] == 's') {
          expect(JSON.stringify(Object.keys(data))).toEqual('["type"]');
          ncType = data['type'];
        }
      }
    );
    let driver = extend(baseDriver);
    driver.setNetworkConnection(5).then(() => {
      return driver.getNetworkConnection();
    }).then((connectionType: number) => {
      expect(connectionType).toEqual(5);
      done();
    });
  });
});
