import { Injectable, Inject } from '@nestjs/common';
import { User } from './users.model';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';
import { Invoice } from 'src/invoice/entities/invoice.model';
import { TransactionService } from 'src/transaction/transaction.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class UsersService {
  constructor(private transactionService: TransactionService) {}

  async getAll(): Promise<User[] | undefined> {
    return User.findAll();
  }

  async getAdmins(): Promise<User[]> {
    return User.scope('admin').findAll();
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await User.scope('withPass').findAll({
      where: { email },
      limit: 1,
    });
    if (user.length) {
      return user[0];
    } else {
      return null;
    }
  }

  async getById(id: number): Promise<User | undefined> {
    try {
      const user = await User.scope('allRoles').findOne({
        where: { id },
        include: [
          { model: Invoice, include: ['transactions'] },
          { model: Item, include: ['shipment'] },
        ],
      });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getItems(id: number): Promise<Item[] | undefined> {
    try {
      const user = await this.getById(id);
      if (user?.items) {
        return user.items;
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  }

  async getShipments(id: number): Promise<Shipment[] | undefined> {
    try {
      const user = await this.getById(id);
      if (user?.items) {
        const shipments = new Set<Shipment>();
        user.items.forEach((item) => {
          shipments.add(item.shipment);
        });
        return Array.from(shipments);
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  }

  async getTransactions(id: number): Promise<Transaction[] | undefined> {
    try {
      const transactions = await this.transactionService.getAll({
        userId: id,
      });
      const _transactions = transactions.map((transaction) => {
        const _transaction = transaction.toJSON();
        delete _transaction.user;
        return _transaction;
      });
      return _transactions || [];
    } catch (e) {
      throw e;
    }
  }

  async getUserStats(id: number) {
    const data = await Promise.all([
      this.getTransactions(id),
      this.getItems(id),
      this.getShipments(id),
    ]);
    const invoices = (await this.getById(id)).invoices;
    const stats = {
      shipments: {
        total: data[2].length,
        completed: data[2].filter((shipment) => shipment.status >= 4).length,
        inProgress: data[2].filter((shipment) => shipment.status < 4).length,
      },
      items: {
        total: data[1].length,
        arrived: data[1].filter((item) => item.shipment.status >= 4).length,
        pending: data[1].filter((item) => item.shipment.status < 4).length,
      },
      payments: {
        total: data[0].length,
        totalAmount: data[0].reduce((prev, curr) => prev + curr.amount, 0),
        outstandingAmount: invoices
          .filter((invoice) => invoice.balance > 0)
          .reduce((prev, curr) => prev + curr.total, 0),
      },
      invoices: {
        total: invoices.length,
        paid: invoices.filter((invoice) => invoice.balance <= 0).length,
        pending: invoices.filter(
          (invoice) => invoice.balance > 0 && invoice.dueDate >= new Date(),
        ).length,
        overdue: invoices.filter(
          (invoice) => invoice.balance > 0 && invoice.dueDate < new Date(),
        ).length,
      },
    };
    return stats;
  }
}
