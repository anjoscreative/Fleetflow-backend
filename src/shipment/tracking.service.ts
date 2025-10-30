// import { Injectable } from '@nestjs/common';
// // import { RedisService } from '../redis/redis.service';

// /**
//  * ShipmentTrackingService
//  * -----------------------
//  * Handles real-time status and location updates for shipments.
//  * All data is stored in Redis for low latency.
//  */
// @Injectable()
// export class ShipmentTrackingService {
//   constructor(private readonly redisService: RedisService) {}

//   private getTrackingKey(shipmentId: string) {
//     return `shipment:${shipmentId}:tracking`;
//   }

//   async updateStatus(shipmentId: string, status: string) {
//     const tracking = await this.redisService.get(this.getTrackingKey(shipmentId)) || {};
//     tracking.status = status;
//     tracking.updatedAt = new Date().toISOString();
//     await this.redisService.set(this.getTrackingKey(shipmentId), tracking);
//     return tracking;
//   }

//   async updateLocation(shipmentId: string, coords: { lat: number; lng: number }) {
//     const tracking = await this.redisService.get(this.getTrackingKey(shipmentId)) || {};
//     tracking.location = coords;
//     tracking.updatedAt = new Date().toISOString();
//     await this.redisService.set(this.getTrackingKey(shipmentId), tracking);
//     return tracking;
//   }

//   async getTracking(shipmentId: string) {
//     return this.redisService.get(this.getTrackingKey(shipmentId));
//   }
// }
