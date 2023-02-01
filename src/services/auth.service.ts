import { User, UserVerification, ChangePasswordToken } from '@/models/user';
import { signUpSchema, signInSchema, changePasswordSchema, changePasswordEmailSchema } from '@/dto';
import { signJWT } from '@/config/jwt';
import bycrypt from 'bcryptjs';
import { createTransport } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'

export class AuthService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    const data = signUpSchema.safeParse({ email, password, confirmPassword });

    if (!data.success) {
      return this.failedOrSuccessRequest('error', data.error);
    }

    //create the user
    const hashedPassword = await bycrypt.hash(password, 12);
    let user
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        role: 'user'
      })
    } catch (error) {
      return this.failedOrSuccessRequest('error', error);
    }

    // Create the user verification token
    const userVerification = uuidv4() + '-' + uuidv4();
    let resultUVTReq
    try {
      const expiresTime = 15 * 60 * 1000 // 15 minutes
      const hashedUserVerification = await bycrypt.hash(userVerification, 12);
      resultUVTReq = await UserVerification.create({
        expires: new Date(new Date().getTime() + expiresTime),
        hashed_token: hashedUserVerification,
        userId: user.id as string
      })
    } catch (error) {
      await User.destroy({
        where: {
          id: user.id
        }
      });
      return this.failedOrSuccessRequest('error', error);
    }

    // TODO: Create transporter for nodemailer
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
      }
    })

    // TODO: Set the nodemailer config
    const mailOptions = {
      to: user.email,
      subject: 'Gambreng Account Verification',
      html: `<a href=${'gambreng.fajarbuana.my.id/account/verify/' + userVerification + '/' + user.id}>Verify</a>`
    }
    // TODO: Send the account verification email to the user
    let sendMailError;
    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        sendMailError = error
      }
    })

    if (sendMailError) {
      await UserVerification.destroy({
        where: {
          id: resultUVTReq.id
        }
      })

      await User.destroy({
        where: {
          id: user.id
        }
      })
      return this.failedOrSuccessRequest('failed', sendMailError)
    }
    return this.failedOrSuccessRequest('success', {})
  }

  async signIn(email: string, password: string) {
    const data = signInSchema.safeParse({ email, password });

    if (!data.success) {
      return this.failedOrSuccessRequest('error', data.error);
    }

    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return this.failedOrSuccessRequest('failed', 'Invalid Credentials')
    } else if (!user.is_verified) {
      return this.failedOrSuccessRequest('failed', 'Please verify your account first')
    }

    // update user session 
    try {
      await User.update({
        has_session: true
      }, {
        where: {
          id: user.id
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
    const accessToken = signJWT({ id: user.id, email: user.email, role: user.role }, '1d')
    const refreshToken = signJWT({ id: user.id, email: user.email }, '1w')

    //save the refresh token to the db
    try {
      const hashedRefreshToken = await bycrypt.hash(refreshToken, 12)
      await User.update({
        refresh_token: hashedRefreshToken
      }, {
        where: {
          id: user.id as string
        },
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('success', { accessToken, refreshToken })
  }
  async signOut(userId: number) {
    try {
      await User.update({
        has_session: false
      }, {
        where: {
          id: userId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
    return this.failedOrSuccessRequest('success', {})
  }
  async sendChangePasswordEmail(email: string) {
    // TODO: Validate request data
    const result = changePasswordEmailSchema.safeParse({
      email
    })

    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error.format())
    }

    // TODO: Find the user with following email address
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      return this.failedOrSuccessRequest('failed', 'User does not exist')
    }

    // TODO: Create changePasswordToken
    const changePasswordToken = uuidv4() + '-' + uuidv4()
    const hashedChangePasswordToken = await bycrypt.hash(changePasswordToken, 12)
    const expiresTime = 15 * 60 * 1000 // 15 minutes

    // TODO: Check if user has chanegPasswordToken in database
    const changePasswordTokenInDB = await ChangePasswordToken.findOne({
      where: {
        userId: user.id as string
      }
    })

    if (!changePasswordTokenInDB) {
      // TODO: Create new changePasswordToken in db
      try {
        await ChangePasswordToken.create({
          hashed_token: hashedChangePasswordToken,
          userId: user.id as string,
          expires: new Date(new Date().getTime() + expiresTime)
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', error)
      }
    } else {
      // TODO: Update the current changePasswordToken
      try {
        await ChangePasswordToken.update({
          hashed_token: hashedChangePasswordToken,
          expires: new Date(new Date().getTime() + expiresTime)
        }, {
          where: {
            userId: user.id as string
          }
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', error)
      }
    }

    // TODO: Create transporter for nodemailer
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
      }
    })

    // TODO: Set the nodemailer config
    const mailOptions = {
      to: email,
      subject: 'Gambreng Change Password',
      html: `<a href=${'gambreng.fajarbuana.my.id/password/verify/' + changePasswordToken + '/' + user.id}>Verify</a>`
    }

    // TODO: Send the account verification email to the user
    let sendMailError;
    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        sendMailError = error
      }
    })

    if (sendMailError) {
      // TODO: Remove the changePasswordToken that has been created
      await ChangePasswordToken.destroy({
        where: {
          userId: user.id as string
        }
      })
      return this.failedOrSuccessRequest('failed', sendMailError)
    }

    return this.failedOrSuccessRequest('success', {})
  }

  async verifyNewPassword(token: string, userId: number, password: string, confirmPassword: string) {
    // TODO: Verify request data
    const result = changePasswordSchema.safeParse({
      password,
      confirmPassword,
      userId,
      token,
    })

    if (!result.success) {
      return this.failedOrSuccessRequest('failed', result.error.format())
    }


    // TODO: Check if the token is valid or not
    // TODO: Get the token from database with current userId
    const hashedChangePasswordToken = await ChangePasswordToken.findOne({
      where: {
        userId: userId
      }
    })

    if (!hashedChangePasswordToken) {
      return this.failedOrSuccessRequest('failed', 'Token does not exist')
    }

    // TODO: Compare the token
    const tokenMatches = await bycrypt.compare(token, hashedChangePasswordToken.hashed_token)

    if (!tokenMatches) {
      return this.failedOrSuccessRequest('failed', 'Invalid token')
    }

    // TODO: Check if the token does not expired
    if (hashedChangePasswordToken.expires.getTime() < new Date().getTime()) {
      return this.failedOrSuccessRequest('failed', 'Token is expired')
    }

    // TODO: Delete the changePasswordToken in database
    try {
      await ChangePasswordToken.destroy({
        where: {
          userId: userId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    // TODO: Check if the password and confirm password is same
    if (password !== confirmPassword) {
      return this.failedOrSuccessRequest('failed', 'Password and confirm password must be same')
    }

    // TODO: Hash the password
    const hashedPassword = await bycrypt.hash(password, 12)

    // TODO: Change user password in database
    try {
      await User.update({
        password: hashedPassword,
        is_verified: true
      }, {
        where: {
          id: userId
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('success', {})
  }

  async verifyAccount(token: string, userId: number) {
    // TODO: Get the current user data for making the token later
    const user = await User.findOne({
      where: {
        id: userId
      },
    })

    if (!user) {
      return this.failedOrSuccessRequest('failed', 'Failed to get the user')
    }

    // TODO: Check if the token with the current email is exist or not
    const hashedUserVerification = await UserVerification.findOne({
      where: {
        userId: userId
      }
    })

    if (!hashedUserVerification) {
      return this.failedOrSuccessRequest('failed', 'Failed to get hashedUserVerification')
    }

    // TODO: Check if the token is valid or not
    const tokenMatches = await bycrypt.compare(token, hashedUserVerification.hashed_token)

    if (!tokenMatches) {
      return this.failedOrSuccessRequest('failed', 'Invalid token')
    }

    // TODO: Check if the token is expired or not
    let isExpired = false
    if (hashedUserVerification.expires.getTime() < new Date().getTime()) {
      isExpired = true
    }

    if (isExpired) {
      return this.failedOrSuccessRequest('failed', 'UserVerification expired')
    }

    // TODO: Update isVerified column of user table in db
    // TODO: Delete the userVerification in db
    try {
      await User.update({
        is_verified: true,
        has_session: true,
      }, {
        where: {
          id: userId
        }
      })
      await UserVerification.destroy({
        where: {
          id: hashedUserVerification.id
        }
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    // TODO: Create the access and refresh token then returned it
    const accessToken = signJWT({ id: user.id, email: user.email, role: user.role }, '1d')
    const refreshToken = signJWT({ id: user.id, email: user.email }, '1w')


    // TODO: Save the refreshToken to the db
    try {
      const hashedRefreshToken = await bycrypt.hash(refreshToken, 12)
      await User.update({
        refresh_token: hashedRefreshToken
      }, {
        where: {
          id: user.id as string
        },
      })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }

    return this.failedOrSuccessRequest('success', { accessToken, refreshToken })
  }

}