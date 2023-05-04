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
      return await Item.create(createItemDto);
    } catch (e) {
      throw e;
    }
  }
}
