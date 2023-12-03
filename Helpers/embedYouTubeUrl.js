const embedYoutubeUrlMiddleware = (req, res, next) => {
  if (req.body.movieTrailerUrl) {
    const youtubeVideoId = getVideoId(req.body.movieTrailerUrl);
    if (youtubeVideoId) {
      req.body.movieTrailerUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;
    }
  }
  next();
};

function getVideoId(url) {
  // Extract the video ID from a YouTube URL
  const regex = /[?&]v=([^?&]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

module.exports = embedYoutubeUrlMiddleware;
