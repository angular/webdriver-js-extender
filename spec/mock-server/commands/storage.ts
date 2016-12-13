/**
 * In this file we define a factory which can be used to create the commands for either
 * sessionStorage or localStorage
 */
import {Command} from 'selenium-mock';
import {StorageCommandList, Session} from '../interfaces';

export function storageFactory(type: 'session' | 'local'): StorageCommandList {
  let storageCmds = {} as StorageCommandList;
  function cmdFactory(method: 'GET'|'POST'|'DELETE', relPath: string, fun:
      (store: {[key: string]: string}, key?: string, value?: string) => any) {
    return new Command<Session>(method, type + '_storage' + relPath, (session, params) => {
      return fun((session as any)[type + '_storage'], params['key'], params['value']);
    });
  }
  storageCmds.getKeys = cmdFactory('GET', '', (store) => {
    return Object.keys(store);
  });
  storageCmds.getValue = cmdFactory('GET', '/key/:key', (store, key) => {
    return store[key];
  });
  storageCmds.setValue = cmdFactory('POST', '', (store, key, value) => {
    store[key] = value;
  });
  storageCmds.deleteEntry = cmdFactory('DELETE', '/key/:key', (store, key) => {
    delete store[key];
  });
  storageCmds.deleteAll = cmdFactory('DELETE', '', (store) => {
    for (var key in store) {
      delete store[key];
    }
  });
  storageCmds.getSize = cmdFactory('GET', '/size', (store) => {
    return Object.keys(store).length;
  });
  return storageCmds;
};
