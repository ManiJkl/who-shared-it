export class GameView {
  render(video) {
    return `
      <section class="screen">
        <div class="video-stage layout-stack">
          <video id="game-video" class="video-player" controls autoplay playsinline>
            <source src="${video.localPath}" type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <div style="display:flex; justify-content:center; margin-top:4px;">
            <button id="reveal-btn" class="btn btn-primary" type="button">Reveal</button>
          </div>
        </div>
      </section>
    `;
  }

  bind(root, onReveal) {
    const revealButton = root.querySelector('#reveal-btn');
    revealButton.addEventListener('click', onReveal);
  }
}
