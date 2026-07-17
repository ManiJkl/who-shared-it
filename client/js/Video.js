import { Utils } from './Utils.js';

export class Video {
  constructor({
    id,
    ownerId,
    ownerName,
    originalUrl,
    localPath = '',
    platform,
    status = 'pending',
    used = false
  }) {
    this.id = id || Utils.createId('video');
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.originalUrl = originalUrl;
    this.localPath = localPath;
    this.platform = platform || Utils.detectPlatform(originalUrl);
    this.status = status;
    this.used = Boolean(used);
  }

  markDownloaded(localPath) {
    this.localPath = localPath;
    this.status = 'downloaded';
  }

  markFailed() {
    this.status = 'failed';
  }
}
