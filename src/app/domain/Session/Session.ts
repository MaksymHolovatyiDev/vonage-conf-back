import {
    Body,
    JsonController,
    Post,
  } from 'routing-controllers';
  
import UsersServices from './SessionServices';
import { IEndSessionBody, ISessionBody } from './SessionTypes';
  
  @JsonController('/Session')
  export default class User {
    public services = new UsersServices();
  
    @Post("/")
    async createSession(@Body() body: ISessionBody) {
      return await this.services.getSession(body);
    }

    @Post('/disconnect')
    async disconnectUsers(@Body() body: IEndSessionBody) {
      return this.services.endSession(body);
    }
  }