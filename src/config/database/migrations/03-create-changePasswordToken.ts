import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.createTable('change_password_tokens', {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID
        },
        userId: {
          type: DataTypes.UUID,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        expires: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        hashed_token: {
          allowNull: false,
          unique: true,
          type: DataTypes.TEXT
        }
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.dropTable('change_password_tokens');
    }
  )
};