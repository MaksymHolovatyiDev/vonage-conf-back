import { Schema, model } from 'mongoose';
import { ISession } from 'types/models/session';

const sessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true },
    users: [Schema.Types.Mixed],
    chat: [Schema.Types.Mixed],
  },

  { timestamps: true }
);

export const Session = model<ISession>('Session', sessionSchema);