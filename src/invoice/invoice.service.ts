import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.model';
import { ShipmentService } from 'src/shipment/shipment.service';
import { User } from 'src/users/users.model';
import { Item } from 'src/shipment/item.model';

@Injectable()
export class InvoiceService {
  constructor(private shipmentService: ShipmentService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const shipment = await this.shipmentService.getOne(
        createInvoiceDto.shipmentId,
      );
      const items: Item[] = shipment.items;
      const users: User[] = shipment.users;

      Promise.all(
        users.map((user) => {
          const userItems = items.filter((x) => x.userId === user.id);
          const amount = userItems.reduce((prev, curr) => {
            const use = curr.bal ? curr.bal : curr.cbm;
            return prev + curr.unitPrice * use;
          }, 0);

          Invoice.create({
            ...createInvoiceDto,
            userId: user.id,
            amount: amount,
          }).then((invoice) => {
            invoice.$set('items', userItems);
            // notify user
          });
        }),
      ).then((message) => {
        // notify admin
      });

      return { invoiceCount: users.length };
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    return await Invoice.findAll({ include: ['items', 'transactions'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
