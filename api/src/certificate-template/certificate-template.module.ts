import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateTemplateService } from './certificate-template.service';
import { CertificateTemplateResolver } from './certificate-template.resolver';
import { CertificateTemplate, CertificateTemplateSchema } from '../schemas/certificate-template.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CertificateTemplate.name, schema: CertificateTemplateSchema },
        ]),
    ],
    providers: [CertificateTemplateResolver, CertificateTemplateService],
    exports: [CertificateTemplateService],
})
export class CertificateTemplateModule { }
