import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Shipment } from './shipment.model';
import { ShipmentService } from './shipment.service';
import { Admin } from 'src/common/decorators/Admin';
import { Response } from 'express';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('shipment')
export class ShipmentController {
  constructor(private shipmentService: ShipmentService) {}

  @Admin()
  @Post('/create')
  async create(@Body() shipmentInput: CreateShipmentDto, @Res() res: Response) {
    try {
      const shipment = await this.shipmentService.create(shipmentInput);
      if (shipment) {
        res.status(201).json({
          shipment,
          message: 'Shipment created successfully',
        });
      } else {
        res.status(400).json({
          error: 'Shipment not created',
          message: 'An error occurred, the shipment could not be created',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Post(':id/add')
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemInput: CreateItemDto,
    @Res() res: Response,
  ) {
    try {
      itemInput.shipmentId = id;
      const item = await this.shipmentService.addItem(itemInput);
      if (item) {
        res.status(201).json({
          item,
          message: 'Created item successfully',
        });
      } else {
        res.status(400).json({
          error: 'Item not created',
          message: 'An error occurred, the item was not created',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Get('/')
  async list(@Res() res: Response) {
    try {
      const shipments = await this.shipmentService.getAll();
      res.status(200).json({
        shipments,
      });
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Delete('/items/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const deleted = await this.shipmentService.deleteItem(id);
      if (deleted) {
        res.status(200).json({
          message: 'Deleted successfully',
        });
      } else {
        // http spec says to return 200, 204 or 202 even if not found, not 404
        res.status(200).json({
          message: 'Resource already deleted or not found',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const shipment = await this.shipmentService.getOne(id);
      res.status(200).json(shipment);
    } catch (e) {
      throw e;
    }
  }
}
