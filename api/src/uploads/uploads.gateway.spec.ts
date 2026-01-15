import { Test, TestingModule } from '@nestjs/testing';
import { UploadsGateway } from './uploads.gateway';
import { UploadsService } from './uploads.service';

describe('UploadsGateway', () => {
  let gateway: UploadsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsGateway, UploadsService],
    }).compile();

    gateway = module.get<UploadsGateway>(UploadsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
