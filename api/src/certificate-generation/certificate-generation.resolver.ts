import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';
import { CertificateGenerationService } from './certificate-generation.service';

@Resolver()
export class CertificateGenerationResolver {
  constructor(
    private readonly certificateGenerationService: CertificateGenerationService,
  ) {}

  @Mutation(() => String)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  async sendCertificate(
    @Args('userId', { nullable: true }) userId?: string,
    @Args('courseId', { nullable: true }) courseId?: string,
  ): Promise<string> {
    return await this.certificateGenerationService.sendCertificate(
      userId,
      courseId,
    );
  }
}
