import * as webdriver from 'selenium-webdriver';
import {extend} from '../lib';
import {buildMockDriver, Data} from './mockdriver';


describe('extender', () => {
  it('should support setting/getting the network connection', (done) => {
    let ncType : number;
    let baseDriver = buildMockDriver('42',
      (name: string, method: string, path: string) => {},
      (path: string, method: string, data: Data) => {
        expect(path).toEqual('/session/42/network_connection');
        if(method == 'GET') {
          expect(Object.keys(data).length).toEqual(0);
          return ncType;
        } else if (method == 'POST') {
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
