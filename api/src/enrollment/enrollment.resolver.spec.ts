import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentResolver', () => {
  let resolver: EnrollmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentResolver, EnrollmentService],
    }).compile();

    resolver = module.get<EnrollmentResolver>(EnrollmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
