import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../config/database'

//Constructor 
interface EventAttributes {
  id: string
  title: string
  image: string
  schedule: Date
  locaton: string
  about: string
  contact_person: string
  link_map: string
  createdAt?: Date
  updatedAt?: Date
}

// defines the type of the object passed to Sequelize’s model.create
export interface EventInput extends Optional<EventAttributes, 'id'> { }

// defines the returned object from model.create, model.update, and model.findOne
export interface EventOuput extends Required<EventAttributes> { }


class Event extends Model<EventAttributes, EventInput> implements EventAttributes {

  public id!: string
  public title!: string
  public image!: string
  public schedule!: Date
  public locaton!: string
  public about!: string
  public contact_person!: string
  public link_map!: string

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

db.define<Event>('Event', {
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
    allowNull: false,
  },
  schedule: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  locaton: {
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

export default Event