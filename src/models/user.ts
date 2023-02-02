import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'
import { GameMessage } from './gameMessage'
interface UserAttributes {
    id?: string
    email: string
    is_verified?: boolean
    password: string
    refresh_token?: string
    role: string
    has_session?: boolean
    createdAt?: Date
    updatedAt?: Date
}

interface UserVerificationTokenAttributes {
    id?: string
    userId: string
    expires: Date
    hashed_token: string
}

interface ChangePasswordTokenAttributes {
    id?: string
    userId: string
    expires: Date
    hashed_token: string
}


// defines the type of the object passed to Sequelize’s model.create
export interface UserInput extends Optional<UserAttributes, 'id'> { }

// defines the returned object from model.create, model.update, and model.findOne
export interface UserOuput extends Required<UserAttributes> { }

class UserModel extends Model<UserAttributes, UserInput> implements UserAttributes {

    public id?: string
    public email!: string
    public is_verified!: boolean
    public password!: string
    public refresh_token!: string
    public role!: string
    public has_session!: boolean

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

class UserVerificationTokenModel extends Model<UserVerificationTokenAttributes, UserVerificationTokenAttributes> implements UserVerificationTokenAttributes {
    public id?: string
    public userId!: string
    public expires!: Date
    public hashed_token!: string
}

class ChangePasswordTokenModel extends Model<ChangePasswordTokenAttributes, ChangePasswordTokenAttributes> implements ChangePasswordTokenAttributes {
    public id?: string
    public userId!: string
    public expires!: Date
    public hashed_token!: string
}

export const User = db.define<UserModel>('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    has_session: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true
})

export const UserVerification = db.define<UserVerificationTokenModel>('user_verification_tokens', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hashed_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
})

export const ChangePasswordToken = db.define<ChangePasswordTokenModel>('change_password_tokens', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hashed_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
})

