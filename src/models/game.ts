import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'
//Constructor 
interface GameAttributes {
  id: string
  title: string
  image: string
  description: string
  max_player: string
  origin_game: string
  procedure: string
  link_video: string
  createdAt?: Date
  updatedAt?: Date
}

// defines the type of the object passed to Sequelize’s model.create
export interface GameInput extends Optional<GameAttributes, 'id'> { }

// defines the returned object from model.create, model.update, and model.findOne
export interface GameOutput extends Required<GameAttributes> { }


interface GameInstance extends Model<GameAttributes, GameInput>,
  GameAttributes {
  createdAt?: Date
  updatedAt?: Date
}

export const Game = db.define<GameInstance>('games', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  max_player: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origin_game: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  procedure: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  link_video: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true
})

