import { registerEnumType } from "@nestjs/graphql";

export enum OrderStatus {
    CREATED = 'CREATED',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});