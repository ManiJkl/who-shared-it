const videoDownloader = require('../services/VideoDownloader');

const downloadVideo = async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      filename: '',
      path: '',
      error: 'A valid url is required.'
    });
  }

  try {
    const result = await videoDownloader.download(url.trim());
    return res.status(200).json({
      success: true,
      filename: result.filename,
      path: result.path,
      error: ''
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      filename: '',
      path: '',
      error: error.message || 'Failed to download video.'
    });
  }
};

module.exports = {
  downloadVideo
};
