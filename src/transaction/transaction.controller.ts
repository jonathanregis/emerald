import { Controller, Post, Req, Res, Body, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import CreateTransactionDto from './dto/create-transaction.dto';
import { Admin } from 'src/common/decorators/Admin';
import { Request, Response } from 'express';
import { generateTransactionReference } from 'src/utils/generators';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Admin()
  @Post('/create')
  async createTransaction(
    @Body() createDto: CreateTransactionDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const reference = generateTransactionReference();
      const transaction = await this.transactionService.createTransaction({
        ...createDto,
        reference,
      });
      if (transaction) {
        res.status(201).json({
          message: 'Transaction created successfully',
          transaction,
        });
      } else {
        res.status(400).json({
          error: 'Could not create transaction',
          message:
            'There was an error trying to create the transaction, please see logs for more info',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Get('/')
  async getTransactions(@Req() req: Request, @Res() res: Response) {
    try {
      const transactions = await this.transactionService.getAll(req.query);
      res.status(200).json({
        transactions,
      });
    } catch (e) {
      throw e;
    }
  }
}
