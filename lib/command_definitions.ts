import {CommandDefinition} from './command_definition';

export let getNetworkConnection =
    new CommandDefinition<number>('getNetworkConnection', [], 'GET', '/network_connection');
export let setNetworkConnection =
    new CommandDefinition<void>('setNetworkConnection', ['type'], 'POST', '/network_connection');
