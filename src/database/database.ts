import { Sequelize } from 'sequelize-typescript';
import { Conversation } from 'src/conversation/entities/conversation.model';
import { Message } from 'src/conversation/entities/message.model';
import { Invoice } from 'src/invoice/entities/invoice.model';
import { Notification } from 'src/notification/entities/notification.model';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/users.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([
        User,
        Shipment,
        Item,
        Invoice,
        Notification,
        Transaction,
        Conversation,
        Message,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
