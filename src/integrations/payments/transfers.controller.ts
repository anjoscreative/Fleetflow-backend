import { Controller, Post, Body } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller('payments/transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  async makeTransfer(@Body() body: { fromId: string; toId: string; amount: number }) {
    return this.transfersService.transferFunds(body.fromId, body.toId, body.amount);
  }
}
