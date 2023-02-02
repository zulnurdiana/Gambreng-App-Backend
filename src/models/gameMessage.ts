import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'
import { GameForum } from './gameForum'
import { User } from './user'

//Constructor
interface GameMessageAttributes {
  id: string
  forumGameId: string
  userId: string
  message: string
}

export interface GameMessageInput extends Optional<GameMessageAttributes, 'id'> { }

export interface GameMessageOutput extends Required<GameMessageAttributes> { }

interface GameMessageInstance extends Model<GameMessageAttributes, GameMessageInput> { }

export const GameMessage = db.define<GameMessageInstance>('game_messages', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: false
  },
  forumGameId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'game_forum',
      key: 'id'
    }
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

GameForum.belongsTo(GameMessage, {
  foreignKey: 'forumGameId',
  as: 'game_forum'
})

User.belongsTo(GameMessage, {
  foreignKey: 'userId',
  as: 'users'
})