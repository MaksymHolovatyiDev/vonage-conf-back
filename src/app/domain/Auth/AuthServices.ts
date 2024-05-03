import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import PasswordValidator from 'password-validator';
import {Types} from 'mongoose';
import {BadRequestError, UnauthorizedError} from 'routing-controllers';

import {User} from 'models/user';
import {SignUpBody} from './AuthTypes';
import {customError} from 'customError';

const {TOKEN_KEY} = process.env;
const schema = new PasswordValidator();

schema.is().min(6);

export default class AuthServices {
  async createNewUser(userData: SignUpBody) {
    const {name, login, password} = userData;

    const existedUser = await User.findOne({login});

    if (existedUser) {
      throw new customError(409, 'This login already exists!');
    }

    try {
      if (!schema.validate(password)) {
        throw new BadRequestError('Password too short!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        login,
        password: hashedPassword,
      });

      return await this.UserSignIn({login, password});
    } catch (e) {
      throw e;
    }
  }

  async UserSignIn(userData: Pick<SignUpBody, 'login' | 'password'>) {
    const {login, password} = userData;

    try {
      const userData = await User.findOne({login});

      if (!userData) throw new BadRequestError('Incorrect login or password!');

      const {_id, name, password: userPassword} = userData;

      const isCorrectPassword = await bcrypt.compare(password, userPassword);

      if (!isCorrectPassword)
        throw new UnauthorizedError('Incorrect login or password!');

      const accessToken = await this.createToken(_id);

      return {
        _id: _id.toString(),
        name,
        token: accessToken,
      };
    } catch (e) {
      throw e;
    }
  }

  async createToken(id: Types.ObjectId) {
    if (typeof TOKEN_KEY === 'string') {
      return jwt.sign({id}, TOKEN_KEY);
    } else {
      return 'KEY ERROR!';
    }
  }
}