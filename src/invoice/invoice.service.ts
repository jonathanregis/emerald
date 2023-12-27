import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.model';
import { ShipmentService } from 'src/shipment/shipment.service';
import { User } from 'src/users/users.model';
import { Item } from 'src/shipment/item.model';
import { NotificationService } from 'src/notification/notification.service';
import { IncludeOptions, Sequelize } from 'sequelize';

@Injectable()
export class InvoiceService {
  constructor(
    private shipmentService: ShipmentService,
    private notificationService: NotificationService,
  ) {}

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
            const use = curr.cbm ? curr.cbm : curr.bal;
            return prev + curr.unitPrice * use;
          }, 0);

          Invoice.create({
            ...createInvoiceDto,
            userId: user.id,
            amount: amount,
          }).then((invoice) => {
            invoice.$set('items', userItems);
            this.notificationService.notify({
              message:
                'Invoice ' +
                invoice.number +
                ' received for shipment ' +
                createInvoiceDto.shipmentId,
              title: 'New invoice',
              to: [invoice.userId],
              template: 'newInvoice',
              templateData: {
                invoiceNumber: invoice.number,
                shipmentID: createInvoiceDto.shipmentId,
              },
            });
          });
        }),
      ).then((message) => {
        this.notificationService.notifyAdmin({
          title: 'Invoices generated',
          message:
            users.length +
            ' invoices generated for shipment ' +
            createInvoiceDto.shipmentId,
        });
      });

      return { invoiceCount: users.length };
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    const invoices = await Invoice.findAll({
      include: ['items', 'transactions'],
    });
    return invoices.map((invoice) => {
      const _invoice = invoice.toJSON();
      delete _invoice.transactions;
      return _invoice;
    });
  }

  async findById(id: number, include: any = ['items', 'transactions']) {
    const invoice = await Invoice.findOne({
      where: { id },
      include,
    });

    return invoice;
  }

  async findByUser(userId: number) {
    const invoices = await Invoice.findAll({
      where: { userId },
      include: ['items', 'transactions'],
    });
    return invoices.map((invoice) => {
      const _invoice = invoice.toJSON();
      delete _invoice.transactions;
      return _invoice;
    });
  }

  async findByShipment(shipmentId: number) {
    const invoices = await Invoice.findAll({
      where: { shipmentId },
      include: ['items', 'transactions'],
    });
    return invoices.map((invoice) => {
      const _invoice = invoice.toJSON();
      delete _invoice.transactions;
      return _invoice;
    });
  }

  async remove(id: number) {
    return await Invoice.destroy({
      where: { id },
    });
  }
}
