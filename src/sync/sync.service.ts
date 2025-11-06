import { Injectable, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class SyncService {
  private readonly redis: Redis;
  private readonly logger = new Logger(SyncService.name);

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  // 1️⃣ Add a job to the queue
  async enqueueJob(queue: string, payload: any) {
    await this.redis.lpush(queue, JSON.stringify(payload));
    this.logger.log(`Job added to ${queue}: ${payload.id || 'unnamed'}`);
  }

  // 2️⃣ Replay queued jobs when online
  async replayJobs(queue: string, handler: (job: any) => Promise<void>) {
    while (true) {
      const job = await this.redis.rpop(queue);
      if (!job) break;
      const parsed = JSON.parse(job);
      try {
        await handler(parsed);
        this.logger.log(`✅ Replayed job from ${queue}: ${parsed.id || 'unnamed'}`);
      } catch (err) {
        this.logger.warn(`♻️ Failed job requeued: ${parsed.id || 'unnamed'}`);
        await this.redis.lpush(queue, job);
        break; // stop replay to avoid rapid retries
      }
    }
  }

  // 3️⃣ Check queue length
  async queueSize(queue: string) {
    return await this.redis.llen(queue);
  }
}
