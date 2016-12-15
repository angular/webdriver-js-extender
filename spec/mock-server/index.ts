import {session as commandList} from './commands';
import {Session, CommandList} from './interfaces';
import {Command, Server} from 'selenium-mock';

export class MockAppium extends Server<Session> {
  constructor(port: number) {
    super(port, (basicSession) => {
      let session = basicSession as Session;
      session.currentContext = 'WEBVIEW_1';
      session.installedApps = [];
      session.locked = false;
      session.localStorage = {};
      session.location = { latitude: 0, longitude: 0, altitude: 0 };
      session.locationEnabled = true;
      session.orientation = 'PORTRAIT';
      session.files = {};
      session.sessionStorage = {};
      session.settings = {ignoreUnimportantViews: false};
      session.activity = null;
      session.networkConnection = 6;
      return session;
    });

    let addCommands = (commandList: CommandList) => {
      for (let commandName in commandList) {
        let command = commandList[commandName];
        if (command instanceof Command) {
          this.addCommand(command);
        } else {
          addCommands(command);
        }
      }
    }

    addCommands(commandList);
  }
}
