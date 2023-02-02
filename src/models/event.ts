import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'

//Constructor 
interface EventAttributes {
  id: string
  title: string
  image: string
  schedule: Date
  location: string
  about: string
  contact_person: string
  link_map: string
  createdAt?: Date
  updatedAt?: Date
}

// defines the type of the object passed to Sequelize’s model.create
export interface EventInput extends Optional<EventAttributes, 'id'> { }

// defines the returned object from model.create, model.update, and model.findOne
export interface EventOutput extends Required<EventAttributes> { }


interface EventInstance extends Model<EventAttributes, EventInput>,
  EventAttributes {
  createdAt?: Date
  updatedAt?: Date
}



export const Event = db.define<EventInstance>('events', {
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
  schedule: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_map: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true
})
