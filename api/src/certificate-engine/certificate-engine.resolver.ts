import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CertificateEngineService } from './certificate-engine.service';
import { CertificateTemplate } from '../schemas/certificate-template.schema';
import { CreateCertificateTemplateInput } from './inputs/create-certificate-template.input';
import { UpdateCertificateTemplateInput } from './inputs/update-certificate-template.input';
import { Roles } from 'src/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/enum/roles';

@Resolver(() => CertificateTemplate)
export class CertificateEngineResolver {
    constructor(private readonly certificateEngineService: CertificateEngineService) { }

    @Mutation(() => CertificateTemplate)
    @Roles(ADMIN_ROLES.ADMIN)
    createCertificateTemplate(
        @Args('input') input: CreateCertificateTemplateInput,
        @Context() ctx,
    ) {
        const adminId = ctx.req.user._id;
        return this.certificateEngineService.create(input, adminId);
    }

    @Query(() => [CertificateTemplate], { name: 'certificateTemplates' })
    @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.INSTRUCTOR)
    findAll() {
        return this.certificateEngineService.findAll();
    }

    @Query(() => CertificateTemplate, { name: 'certificateTemplate' })
    @Roles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.INSTRUCTOR)
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.certificateEngineService.findOne(id);
    }

    @Mutation(() => CertificateTemplate)
    @Roles(ADMIN_ROLES.ADMIN)
    updateCertificateTemplate(
        @Args('input') input: UpdateCertificateTemplateInput,
    ) {
        return this.certificateEngineService.update(input.id, input);
    }

    @Mutation(() => Boolean)
    @Roles(ADMIN_ROLES.ADMIN)
    removeCertificateTemplate(@Args('id', { type: () => String }) id: string) {
        return this.certificateEngineService.remove(id);
    }
}
