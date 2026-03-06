import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateEngineService } from './certificate-engine.service';
import { CertificateEngineResolver } from './certificate-engine.resolver';
import { CertificateTemplate, CertificateTemplateSchema } from '../schemas/certificate-template.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CertificateTemplate.name, schema: CertificateTemplateSchema },
        ]),
    ],
    providers: [CertificateEngineResolver, CertificateEngineService],
    exports: [CertificateEngineService],
})
export class CertificateEngineModule { }
