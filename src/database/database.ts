import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 8889,
        username: 'root',
        password: 'root',
        database: 'emerald',
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
