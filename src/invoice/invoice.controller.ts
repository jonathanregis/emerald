import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Req,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request, Response } from 'express';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Res() res: Response,
  ) {
    const generatedInvoices = await this.invoiceService.create(
      createInvoiceDto,
    );
    res.status(201).json({
      message:
        'Invoices are being generated, a notification will be sent when done.',
      invoiceCount: generatedInvoices.invoiceCount,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = req['user'];
    if (user) {
      if (user.role === 'admin') {
        const invoices = await this.invoiceService.findAll();
        res.status(200).json({ invoices });
      } else {
        const invoices = await this.invoiceService.findByUser(user.sub);
        res.status(200).json({ invoices });
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
