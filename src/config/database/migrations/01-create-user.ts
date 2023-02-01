import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID
        },
        email: {
          unique: true,
          type: DataTypes.STRING
        },
        password: {
          type: DataTypes.TEXT
        },
        refresh_token: {
          type: DataTypes.TEXT
        },
        role: {
          type: DataTypes.STRING
        },
        is_verified: {
          defaultValue: 0,
          allowNull: false,
          type: DataTypes.INTEGER
        },
        has_session: {
          defaultValue: 0,
          allowNull: false,
          type: DataTypes.INTEGER
        },
        createdAt: {
          allowNull: true,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: true,
          type: DataTypes.DATE
        }
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.dropTable('users');
    }
  )
};