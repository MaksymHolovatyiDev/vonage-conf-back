import 'reflect-metadata';
import express from 'express';

import {useExpressServer} from 'routing-controllers';
import {createServer} from 'http';
import {IServes} from 'types/serves';
import {controllers} from 'app/domain';
import { Server } from 'socket.io';
import { Sockets } from 'app/Sockets';


const {PORT} = process?.env || 7000;

export class Tcp implements IServes {
  private static instance: Tcp;

  private routePrefix = '/api';
  private server = express();
  private sockets = new Sockets();

  constructor() {
    if (!Tcp.instance) {
      Tcp.instance = this;
    }
    return Tcp.instance;
  }

  async init() {
    const {server, routePrefix} = this;

    useExpressServer(server, {
      routePrefix,
      controllers,
      cors: true,
      defaultErrorHandler: true,
    });

    const http = createServer(server);
    const io = new Server(http, {
      cors: {
        origin: '*',
      },
    });

    Sockets.io = io;

    this.sockets.init(io);

    return new Promise<boolean>((resolve: any) => {
      http.listen(PORT, () => {
        console.log(`Tcp service started! Port ${PORT}!`);

        return resolve(true);
      });
    });
  }
}