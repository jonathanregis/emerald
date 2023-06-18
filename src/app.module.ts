import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from './config';
import { InvoiceModule } from './invoice/invoice.module';
import { NotificationModule } from './notification/notification.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
      global: true,
    }),
    ShipmentModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    InvoiceModule,
    NotificationModule,
    TransactionModule,
    ConversationModule,
  ],
})
export class AppModule {}
