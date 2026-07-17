export class WinnerView {
  render(winner, ranking) {
    const rows = ranking
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
          <p class="reveal-text">Winner</p>
          <h2 class="reveal-name">${winner ? winner.name : 'No winner'}</h2>
          <p class="screen-subtitle" style="text-align:center; margin-top:-8px;">Final score: ${winner ? winner.score : 0}</p>
          <h3 style="margin-bottom:12px;">Complete Ranking</h3>
          <div class="leaderboard-list">${rows}</div>
          <div style="margin-top:20px;">
            <button id="play-again-btn" class="btn btn-primary" type="button">Play Again</button>
          </div>
        </div>
      </section>
    `;
  }

  bind(root, onPlayAgain) {
    const button = root.querySelector('#play-again-btn');
    button.addEventListener('click', onPlayAgain);
  }
}
