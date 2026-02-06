import { registerEnumType } from "@nestjs/graphql";

export enum PaymentStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

registerEnumType(PaymentStatus, {
    name: 'PaymentStatus',
});