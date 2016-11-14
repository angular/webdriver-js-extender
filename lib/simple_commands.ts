import {SimpleCommand} from './simple_command';

export let getNetworkConnection =
    new SimpleCommand('getNetworkConnection', [], 'GET', '/session/:sessionId/network_connection');
export let setNetworkConnection = new SimpleCommand<void>(
    'setNetworkConnection', ['type'], 'POST', '/session/:sessionId/network_connection');
