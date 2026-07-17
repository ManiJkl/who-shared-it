const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ytdlp = require('yt-dlp-exec');

class VideoDownloader {
  constructor() {
    this.videosDir = path.join(__dirname, '..', 'videos');
    if (!fs.existsSync(this.videosDir)) {
      fs.mkdirSync(this.videosDir, { recursive: true });
    }
  }

  detectPlatform(url) {
    const lower = url.toLowerCase();

    if (lower.includes('tiktok.com')) {
      return 'tiktok';
    }

    if (lower.includes('instagram.com') && (lower.includes('/reel/') || lower.includes('/reels/'))) {
      return 'instagram';
    }

    throw new Error('Only public TikTok and Instagram Reel links are supported.');
  }

  async download(url) {
    const platform = this.detectPlatform(url);
    const jobId = uuidv4();
    const outputTemplate = path.join(this.videosDir, `${platform}-${jobId}.%(ext)s`);

    try {
      const stdout = await ytdlp(
        url,
        {
          output: outputTemplate,
          noPlaylist: true,
          restrictFilenames: true,
          noWarnings: true,
          noCheckCertificates: true,
          mergeOutputFormat: 'mp4',
          format: 'mp4/bestvideo+bestaudio/best',
          print: 'after_move:filepath'
        },
        {
          stdio: ['ignore', 'pipe', 'pipe']
        }
      );

      const resolvedPath = this.resolveDownloadedFile(stdout, jobId);
      const filename = path.basename(resolvedPath);
      return {
        filename,
        path: `/videos/${filename}`,
        absolutePath: resolvedPath,
        platform
      };
    } catch (error) {
      const normalized = (error.stderr || error.message || '').toString();
      throw new Error(`Download failed: ${normalized.trim() || 'unknown error'}`);
    }
  }

  resolveDownloadedFile(stdout, jobId) {
    if (stdout && typeof stdout === 'string') {
      const lines = stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      for (let i = lines.length - 1; i >= 0; i -= 1) {
        const candidate = lines[i];
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return candidate;
        }
      }
    }

    const files = fs.readdirSync(this.videosDir);
    const match = files.find((name) => name.includes(jobId));

    if (!match) {
      throw new Error('Downloader did not return a local file.');
    }

    return path.join(this.videosDir, match);
  }
}

module.exports = new VideoDownloader();
