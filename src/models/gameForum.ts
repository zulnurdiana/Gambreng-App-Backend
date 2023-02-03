import { DataTypes, Model, Optional } from "sequelize";
import { db } from '../config/database'
import { Game } from './game'

interface GameForumAttributes {
  id: string
  title: string
  gamesId: string
}

export interface GameForumInput extends Optional<GameForumAttributes, 'id'> { }

export interface GameForumOutput extends Required<GameForumAttributes> { }

interface GameForumInstance extends Model<GameForumAttributes, GameForumInput> { }

export const GameForum = db.define<GameForumInstance>('game_forums', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gamesId: {
    type: DataTypes.UUID,
    references: {
      model: "games",
      key: "id"
    }
  }
})

GameForum.belongsTo(Game, {
  foreignKey: 'gamesId',
  as: 'games',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})




