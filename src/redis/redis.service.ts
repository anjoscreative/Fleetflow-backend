// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Redis } from 'ioredis';

// /**
//  * RedisService wraps the ioredis client for global use.
//  * We'll connect to Upstash and use it for caching + tracking.
//  */
// @Injectable()
// export class RedisService implements OnModuleInit {
//   private client: Redis;

//   onModuleInit() {
//     this.client = new Redis(process.env.UPSTASH_REDIS_URL!, {
//       tls: {
//         rejectUnauthorized: false, //accept self-signed certs
//       }, // required for Upstash SSL connection
//     });
//   }

//   async set(key: string, value: any, ttlSeconds?: number) {
//     const data = JSON.stringify(value);
//     if (ttlSeconds) await this.client.set(key, data, 'EX', ttlSeconds);
//     else await this.client.set(key, data);
//   }

//   async get<T = any>(key: string): Promise<T | null> {
//     const result = await this.client.get(key);
//     return result ? JSON.parse(result) : null;
//   }

//   async delete(key: string) {
//     await this.client.del(key);
//   }
// }
