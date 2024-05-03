import SocketServices from './SocketServices';

import {Server} from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import { IInitUserBody, IUserMessageBody } from './SocketsTypes';

export class Sockets {
    public services = new SocketServices();
    private static instance: Sockets;
    public static io: any;
  
    constructor() {
      if (!Sockets.instance) Sockets.instance = this;
      return Sockets.instance;
    }
  
    init(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
      io.on('connection', (socket: any) => {        
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on('disconnect', async () => {
          console.log('🔥:disconnected');
        });
    
        socket.on('init', (body: IInitUserBody)=>this.services.initUser(socket.id, body));
        socket.on('message', (body: IUserMessageBody)=>this.services.sendMessageUser(io, body));
      });
    }
  }