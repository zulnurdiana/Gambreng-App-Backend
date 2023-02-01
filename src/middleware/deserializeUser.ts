import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/user';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcryptjs';
import { signJWT, verifyJWT } from '@/config/jwt';

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { GAMBRENG_AT: accessToken, GAMBRENG_RT: refreshToken } = req.cookies

  if (!accessToken) {
    return next()
  }

  const { payload: accessTokenPayload, expired: accessTokenExpired } = verifyJWT(accessToken)

  if (accessTokenPayload) {
    // @ts-ignore
    const { email, role, id } = accessTokenPayload
    // @ts-ignore
    req.user = { email, role, id }
    return next()
  }

  //invalid access token
  const { payload: refreshTokenPayload, expired: refreshTokenExpired } = accessTokenExpired && refreshToken ? verifyJWT(refreshToken) : { payload: null, expired: true }

  // Check if refreshToken expired
  // @ts-ignore
  if (refreshTokenExpired && refreshTokenExpired.name === 'TokenExpiredError') {
    // @ts-ignore
    const { email } = jwt.verify(refreshToken, process.env.PUBLIC_KEY as string, { ignoreExpiration: true })
    // Delete the current refreshToken in database
    await User.update({
      // @ts-ignore
      refresh_token: null,
      has_session: false
    }, {
      where: {
        email
      }
    })

    return next()
  }

  if (!refreshTokenPayload) {
    return next()
  }

  // @ts-ignore
  const { email } = refreshTokenPayload

  const user = await User.findOne({
    where: {
      email
    }
  })


  // check if the user exist or has session
  if (!user || !user.has_session) {
    return next()
  }

  // Check if the current refreshToken === hashedRefreshToken in database
  const refreshTokenMatches = await bycrypt.compare(refreshToken, user.refresh_token as string)

  if (!refreshTokenMatches) {
    return next()
  }

  // User has session, create new accessToken
  const newAccessToken = signJWT({ id: user.id, email: user.email, role: user.role }, '1d')

  // Set the accessToken to cookies
  res.cookie('GAMBRENG_AT', newAccessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: false
  })

  // @ts-ignore
  req.user = { id: user.id, email: user.email, role: user.role }

  return next()
}