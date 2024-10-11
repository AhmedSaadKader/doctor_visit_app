import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import mongoose from 'mongoose';

type UserPayload = {};

export interface RequestAuth extends Request {
  user?: DecodedIdToken;
  body: {
    email: string;
  };
}
