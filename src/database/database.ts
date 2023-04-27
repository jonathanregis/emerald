import { Sequelize } from 'sequelize-typescript';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';
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
      sequelize.addModels([User, Shipment, Item]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
