import { Injectable } from '@nestjs/common';
import CreateTransactionDto from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/users.model';

@Injectable()
export class TransactionService {
  async createTransaction(
    data: CreateTransactionDto & { reference: string },
  ): Promise<Transaction | undefined> {
    try {
      const transaction = await Transaction.create(data).then(async (tr) => {
        tr.$set('user', await User.findOne({ where: { id: data.userId } }));
        return tr;
      });
      return transaction;
    } catch (e) {
      throw e;
    }
  }

  async getAll(filters): Promise<Transaction[]> {
    try {
      return Transaction.findAll({
        include: ['user'],
      });
    } catch (e) {
      throw e;
    }
  }
}
