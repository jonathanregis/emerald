import { Injectable, Inject } from '@nestjs/common';
import { User } from './users.model';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPO')
    private usersRepo: typeof User,
  ) {}

  async getAll(): Promise<User[] | undefined> {
    return this.usersRepo.findAll<User>();
  }

  async getAdmins(): Promise<User[]> {
    return this.usersRepo.scope('admin').findAll();
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepo
      .scope('withPass')
      .findAll({ where: { email }, limit: 1 });
    if (user.length) {
      return user[0];
    } else {
      return null;
    }
  }

  async getById(id: number): Promise<User | undefined> {
    try {
      const user = await this.usersRepo.findOne({ where: { id } });
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
}
