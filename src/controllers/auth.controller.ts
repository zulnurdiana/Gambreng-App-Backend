import { Request, Response } from 'express';
import { AuthService } from '../services';
import { getResponse, getHttpCode } from '@/utils';

const authService = new AuthService();

export const signUp = async (req: Request, res: Response) => {

  const { email, password, confirmPassword } = req.body; const result = await authService.signUp(email, password, confirmPassword);

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }

  return getResponse(res, getHttpCode.OK, 'Email has been send', result.data);

}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.signIn(email, password);

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }

  const { accessToken, refreshToken } = result.data
  res.cookie('GAMBRENG_AT', accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day ,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  })
  res.cookie('GAMBRENG_RT', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  })
  return getResponse(res, getHttpCode.OK, 'User has been logged in', result.data);

}

export const verifyAccount = async (req: Request, res: Response) => {
  const { token, userId } = req.body;

  const result = await authService.verifyAccount(token, userId)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {})
  }
  const { accessToken, refreshToken } = result.data

  res.cookie('GAMBRENG_AT', accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day ,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  })
  res.cookie('GAMBRENG_RT', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  })

  return getResponse(res, 200, 'Account Activated', { accessToken, refreshToken })
}


export const verifyNewPassword = async (req: Request, res: Response) => {

  const { token, userId, password, confirmPassword } = req.body
  const result = await authService.verifyNewPassword(token, userId, password, confirmPassword)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {})
  }

  return getResponse(res, getHttpCode.OK, 'Password has been reset', {})
}

export const signOut = async (req: Request, res: Response) => {
  // @ts-ignore
  console.log(req.user)
  const { id } = req.user
  const result = await authService.signOut(id)
  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }
  // Remove accessToken and refreshToken from cookie
  res.cookie('GAMBRENG_AT', '', {
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'none',
    httpOnly: true
  })
  res.cookie('GAMBRENG_RT', '', {
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'none',
    httpOnly: true
  })
  return getResponse(res, getHttpCode.OK, 'Sign Out Success', {})
}

export const sendChangePasswordEmail = async (req: Request, res: Response) => {
  const { email } = req.body

  const result = await authService.sendChangePasswordEmail(email)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {})
  }

  return getResponse(res, getHttpCode.OK, 'Email has been sent', {})
}
