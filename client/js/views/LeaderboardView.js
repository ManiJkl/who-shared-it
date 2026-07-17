export class LeaderboardView {
  render(players, currentIndex, totalVideos) {
    const rows = players
      .map(
        (player, index) => `
          <div class="leaderboard-row">
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="rank">#${index + 1}</span>
              <span>${player.name}</span>
            </div>
            <strong>${player.score}</strong>
          </div>
        `
      )
      .join('');

    return `
      <section class="screen">
        <div class="card scale-in">
          <h2 class="screen-title">Leaderboard</h2>
          <p class="screen-subtitle">Round ${currentIndex + 1} of ${totalVideos}. Next video in 3 seconds...</p>
          <div class="leaderboard-list stagger">${rows}</div>
        </div>
      </section>
    `;
  }
}
