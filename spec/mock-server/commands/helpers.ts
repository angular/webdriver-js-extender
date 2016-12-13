/**
 * Helpers for defining commands more quickly.
 *
 * In this file we define some helpers for quickly defining commands with either do nothing,
 * set/get a value on the session, or return a constant value.
 */
import {Command} from 'selenium-mock';
import {Session} from '../interfaces';

export function noopFactory(path: string, method: 'GET'|'POST'|'DELETE'|'PUT' = 'POST') {
  return new Command<Session>(method, path, () => {});
}

export function getterFactory(path: string, name?: string, method: 'GET'|'POST'|'DELETE'|'PUT' = 'GET') {
  name = name || path.split('/').pop();
  return new Command<Session>(method, path, (session) => {
    return (session as any)[name];
  });
}

export function setterFactory(path: string, name?: string, paramName?: string) {
  name = name || path.split('/').pop();
  paramName = paramName || name;
  return new Command<Session>('POST', path, (session, params) => {
    (session as any)[name] = params[paramName];
  });
}

export function constFactory(method: 'GET'|'POST'|'DELETE'|'PUT', path: string, val: any) {
  return new Command<Session>(method, path, () => {
    return val;
  });
}
