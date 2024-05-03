import OpenTok from 'opentok';

import { Session } from 'models/session';
import { InternalServerError, BadRequestError } from 'routing-controllers';
import { IEndSessionBody, ISessionBody } from './SessionTypes';
import { ObjectId } from 'mongodb';

const apiKey = "47876421";
const apiSecret = "ab38590966fa2613febb3d0d422715a350ca7399";

export default class UsersServices {
  private static instance: UsersServices;

  private opentok = new OpenTok(apiKey, apiSecret);

  constructor() {
    if (!UsersServices.instance) {
      UsersServices.instance = this;
    }
    return UsersServices.instance;
  }

  async getSession(body: ISessionBody) {
    const {opentok} = this;
    const id = body?.id;
    
    if(id){
      if(!ObjectId.isValid(id))
        throw new BadRequestError("Incorrect room id!");

      const sessionHost = await Session.findById(id).lean();
      
      if(!sessionHost?.active)
        throw new BadRequestError("Incorrect room  id!");

      const token = opentok.generateToken(sessionHost.sessionId);
      return {
        _id: id,
        sessionId: sessionHost.sessionId,
        token,
        chat: sessionHost.chat,
      }
    }

    return new Promise((res, rej)=>{
      opentok.createSession({}, async (err:any, session:any) => {
        if(err) rej(new InternalServerError("Error creating session!"));
  
        const token = opentok.generateToken(session?.sessionId, {role: "moderator"});
        const createdUser = await Session.create({sessionId: session.sessionId, active: true, token, users: [], chat: []});
        res({_id: createdUser._id.toString(), sessionId: createdUser.sessionId, token: createdUser.token, chat: createdUser.chat});
      });
    });
  }

  async endSession( {token}: IEndSessionBody) {
    const activeSession = await Session.findOneAndUpdate({token}, {active: false}).lean();

    if(activeSession){
      activeSession.users.forEach(el=>{
        this.opentok.forceDisconnect(activeSession.sessionId, el?.token, ()=>{});
      });
    }

    return {};
  }

}