import { Request, Response } from 'express';
import { AuthService } from '../services';
import { getResponse } from '@/utils';

const authService = new AuthService();

export const signUp = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;
  const result = await authService.signUp(email, password, confirmPassword);

  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {});
  }

  return getResponse(res, 200, 'Email has been send', result.data);

}

export const verifyAccount = async (req: Request, res: Response) => {

}

export const signIn = async (req: Request, res: Response) => {
}

export const sendChangePasswordEmail = async (req: Request, res: Response) => {
}

export const verifyNewPassword = async (req: Request, res: Response) => {
}
