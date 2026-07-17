import { Utils } from './Utils.js';

export class Player {
  constructor({ id, name, avatar = '', score = 0, videoLinks = [] }) {
    this.id = id || Utils.createId('player');
    this.name = Utils.sanitizeText(name);
    this.avatar = Utils.sanitizeText(avatar);
    this.score = Number(score) || 0;
    this.videoLinks = Array.isArray(videoLinks) ? [...videoLinks] : [];
  }

  addVideoLink(url) {
    const cleaned = Utils.sanitizeText(url);
    if (cleaned) {
      this.videoLinks.push(cleaned);
    }
  }

  removeVideoLink(url) {
    this.videoLinks = this.videoLinks.filter((link) => link !== url);
  }
}
