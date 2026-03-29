import { Resolver, Query, Mutation, Args, Context, ID } from '@nestjs/graphql';
import { CertificateTemplateService } from './certificate-template.service';
import {
  CertificateTemplate,
  PaginatedCertificateTemplate,
} from '../schemas/certificate-template.schema';
import { CreateCertificateTemplateInput } from './inputs/create-certificate-template.input';
import { UpdateCertificateTemplateInput } from './inputs/update-certificate-template.input';
import { Roles } from '../decorators/roles.decorator';
import { ADMIN_ROLES } from '../enum/roles';
import { PaginationInput } from '../category/pagination.dto';

@Resolver(() => CertificateTemplate)
export class CertificateTemplateResolver {
  constructor(private readonly templateService: CertificateTemplateService) {}

  @Mutation(() => CertificateTemplate)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  createCertificateTemplate(
    @Context() ctx,
    @Args('createCertificateTemplateInput')
    createInput: CreateCertificateTemplateInput,
  ): Promise<CertificateTemplate> {
    return this.templateService.create(createInput, ctx.req.user.id);
  }

  @Query(() => PaginatedCertificateTemplate)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  getAllCertificateTemplates(
    @Context() ctx,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.templateService.findAll(paginationInput, ctx.req);
  }

  @Query(() => CertificateTemplate)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  getCertificateTemplateById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CertificateTemplate> {
    return this.templateService.findOne(id);
  }

  @Mutation(() => CertificateTemplate)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  updateCertificateTemplate(
    @Args('updateCertificateTemplateInput')
    updateInput: UpdateCertificateTemplateInput,
  ): Promise<CertificateTemplate> {
    return this.templateService.update(updateInput);
  }

  @Mutation(() => Boolean)
  @Roles(ADMIN_ROLES.INSTRUCTOR, ADMIN_ROLES.ADMIN)
  removeCertificateTemplate(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.templateService.remove(id);
  }
}
