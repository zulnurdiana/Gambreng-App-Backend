import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'
import { User } from './user'

//Constructor
interface GlobalMessageAttributes {
  id: string
  userId: string
  message: string
}

export interface GlobalMessageInput extends Optional<GlobalMessageAttributes, 'id'> { }

export interface GlobalMessageOutput extends Required<GlobalMessageAttributes> { }

interface GlobalMessageInstance extends Model<GlobalMessageAttributes, GlobalMessageInput> { }

export const GlobalMessage = db.define<GlobalMessageInstance>('global_messages', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

GlobalMessage.belongsTo(User, {
  foreignKey: 'userId',
  as: 'users'
})
