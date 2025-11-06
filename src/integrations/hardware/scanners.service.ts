import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScannedItem } from './scanners/scanned-item.entity';
import { SyncService } from '../../sync/sync.service'; 

@Injectable()
export class ScannersService {
  constructor(
    @InjectRepository(ScannedItem)
    private readonly scannedItemRepo: Repository<ScannedItem>,

    private readonly syncService: SyncService,
  ) {}

  // Record a new scan — with offline queue fallback
  async recordScan(data: { code: string; type?: string; sourceDevice?: string }) {
    const item = this.scannedItemRepo.create(data);

    try {
      // Attempt to save directly
      return await this.scannedItemRepo.save(item);
    } catch (err) {
      console.error('❌ Failed to save scan, queuing job instead:', err.message);

      // Queue the failed job for later replay
      await this.syncService.enqueueJob('scan-queue', item);

      // Return acknowledgment so the device knows it was queued
      return { queued: true, item };
    }
  }

  // Replay queued jobs when connection is restored
  async replayQueuedScans() {
    console.log('🔁 Replaying queued scan jobs...');
    await this.syncService.replayJobs('scan-queue', async (job) =>
      this.scannedItemRepo.save(job),
    );
    console.log('✅ Replay completed.');
  }

  // Fetch recent scans
  async getRecentScans(limit = 10) {
    return this.scannedItemRepo.find({
      order: { scannedAt: 'DESC' },
      take: limit,
    });
  }
}
