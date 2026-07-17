export class Downloader {
  constructor(apiUrl = '/api/download') {
    this.apiUrl = apiUrl;
    this.localFallbackApiUrl = 'http://localhost:3000/api/download';
  }

  async postDownloadRequest(targetUrl, url) {
    return fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
  }

  async downloadVideos(videoRequests, onProgress) {
    const total = videoRequests.length;
    const results = [];

    for (let index = 0; index < total; index += 1) {
      const request = videoRequests[index];
      const result = await this.downloadSingle(request.url);
      const completed = index + 1;
      const percentage = Math.round((completed / total) * 100);

      const normalized = {
        ...request,
        ...result,
        status: result.success ? 'downloaded' : 'failed'
      };
      results.push(normalized);

      if (onProgress) {
        onProgress({
          current: completed,
          total,
          percentage,
          item: normalized,
          results: [...results]
        });
      }
    }

    return results;
  }

  async downloadSingle(url) {
    try {
      let response = await this.postDownloadRequest(this.apiUrl, url);

      if (
        response.status === 405 &&
        this.apiUrl !== this.localFallbackApiUrl &&
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost'
      ) {
        response = await this.postDownloadRequest(this.localFallbackApiUrl, url);
      }

      const rawBody = await response.text();
      let data = null;

      if (rawBody && rawBody.trim()) {
        try {
          data = JSON.parse(rawBody);
        } catch (_parseError) {
          return {
            success: false,
            filename: '',
            path: '',
            error: `Invalid API response (expected JSON). HTTP ${response.status}`
          };
        }
      }

      if (!data || typeof data !== 'object') {
        return {
          success: false,
          filename: '',
          path: '',
          error: `Empty API response. HTTP ${response.status}`
        };
      }

      return {
        success: Boolean(data.success),
        filename: data.filename || '',
        path: data.path || '',
        error: data.error || ''
      };
    } catch (error) {
      return {
        success: false,
        filename: '',
        path: '',
        error: error.message || 'Network error while downloading.'
      };
    }
  }
}
