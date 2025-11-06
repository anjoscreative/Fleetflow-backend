import { Test, TestingModule } from '@nestjs/testing';
import { ScannersService } from './scanners.service';

describe('ScannersService', () => {
  let service: ScannersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScannersService],
    }).compile();

    service = module.get<ScannersService>(ScannersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
