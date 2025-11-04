import { Test, TestingModule } from '@nestjs/testing';
import { VirtualAccountsController } from './virtual-accounts.controller';

describe('VirtualAccountsController', () => {
  let controller: VirtualAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualAccountsController],
    }).compile();

    controller = module.get<VirtualAccountsController>(VirtualAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
