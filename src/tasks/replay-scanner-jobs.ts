import { Injectable, Logger } from '@nestjs/common';
import { ScannersService } from 'src/integrations/hardware/scanners.service';
import { SyncService } from 'src/sync/sync.service';

@Injectable()
export class ReplayScannerJobsTask {
  private readonly logger = new Logger(ReplayScannerJobsTask.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly scannersService: ScannersService,
  ) {}

  // Call this on interval or manually
  async run() {
    this.logger.log('🔁 Starting scanner queue replay...');
    await this.syncService.replayJobs('scanner-queue', async (job) => {
      await this.scannersService.recordScan(job);
    });
  }
}
