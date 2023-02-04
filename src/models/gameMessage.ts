import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'
import { GameForum } from './gameForum'
import { User } from './user'

//Constructor
interface GameMessageAttributes {
  id: string
  gameForumId: string
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
    primaryKey: true
  },
  gameForumId: {
    type: DataTypes.UUID,
    references: {
      model: 'game_forums',
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

GameForum.hasMany(GameMessage, {
  sourceKey: 'id',
  as: 'game_messages'
})

GameMessage.belongsTo(GameForum, {
  foreignKey: 'gameForumId',
  as: 'game_forum',
  onDelete: 'CASCADE'
})

GameMessage.belongsTo(User, {
  foreignKey: 'userId',
  as: 'users'
})
