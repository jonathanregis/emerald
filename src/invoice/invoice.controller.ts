import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  NotFoundException,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { Public } from 'src/common/decorators/Public';
import * as path from 'path';
import { Item } from 'src/shipment/item.model';
import { Admin } from 'src/common/decorators/Admin';
import { compareSync } from 'bcrypt';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

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

  @Public()
  @Get('download/:id')
  async downloadPDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Query('key') key: string,
  ) {
    const invoice = await this.invoiceService.findById(id, [
      { model: Item, include: ['user'] },
      'transactions',
      'shipment',
    ]);

    if (!compareSync(invoice.number, key)) {
      throw new ForbiddenException();
    }

    if (!invoice) {
      throw new NotFoundException('No Invoice found with the specified id');
    }

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '6mm',
    };

    const invoiceDirectory = path.resolve(process.cwd(), 'src/invoice');
    const html = fs.readFileSync(
      path.join(invoiceDirectory, 'invoice.html'),
      'utf8',
    );

    Handlebars.registerHelper('multiply', function (val1, val2) {
      const a = parseFloat(val1);
      const b = parseFloat(val2);
      if (!isNaN(a) && !isNaN(b)) {
        return (a * b).toLocaleString();
      }
      return 0;
    });

    Handlebars.registerHelper('each', function (context, options) {
      var ret = '';

      for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i]);
      }

      return ret;
    });

    const template = Handlebars.compile(html);
    const content = template({
      items: invoice.items.map((item) => item.toJSON()),
      shipment: invoice.shipment,
      container: invoice.shipment.container,
      destination: `${invoice.shipment.arrivalCity}, ${invoice.shipment.arrivalCountry}`,
      departureDate: `${invoice.shipment.departureDate.toLocaleDateString(
        'en-GB',
        { month: 'long', day: '2-digit', year: 'numeric' },
      )}`,
      arrivalDate: `${invoice.shipment.arrivalDate.toLocaleDateString('en-GB', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      })}`,
      seal: `${invoice.shipment.seal}`,
      total: invoice.total.toLocaleString(),
    });

    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    await page.setContent(content, { waitUntil: 'domcontentloaded' });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Downlaod the PDF
    const file = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '6mm',
        bottom: '6mm',
        left: '6mm',
        right: '6mm',
      },
    });

    // Close the browser instance
    await browser.close();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="vipcargo_invoice_${invoice.number}.pdf"`,
    );
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(file);
  }

  @Admin()
  @Get('preview')
  previewInvoice(@Res() res: Response) {
    const invoiceDirectory = path.resolve(process.cwd(), 'src/invoice');
    const html = fs.readFileSync(
      path.join(invoiceDirectory, 'invoice.html'),
      'utf8',
    );
    return res.send(html);
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
