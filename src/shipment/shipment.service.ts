import { Injectable } from '@nestjs/common';
import { Shipment } from './shipment.model';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Item } from './item.model';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ShipmentService {
  async create(
    createShipmentDto: CreateShipmentDto,
  ): Promise<Shipment | undefined> {
    try {
      const shipment = await Shipment.create(createShipmentDto);
      return shipment;
    } catch (e) {
      throw e;
    }
  }

  async getAll(): Promise<Shipment[]> {
    try {
      return await Shipment.findAll({ include: ['items'] });
    } catch (e) {
      throw e;
    }
  }

  async addItem(createItemDto: CreateItemDto): Promise<Item | undefined> {
    try {
      const item = await Item.create(createItemDto).catch((e) =>
        console.log(e),
      );
      if (item) return item;
    } catch (e) {
      throw e;
    }
  }

  async deleteItem(id: number) {
    try {
      return await Item.destroy({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  async getOne(id: number): Promise<Shipment | undefined> {
    try {
      return await Shipment.findOne({
        where: { id },
        include: [{ all: true, nested: true }],
      });
    } catch (e) {
      throw e;
    }
  }
}
