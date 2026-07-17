export class RevealView {
  renderReveal(video) {
    return `
      <section class="screen">
        <div class="card scale-in">
          <p class="reveal-text">Shared by</p>
          <h2 class="reveal-name">${video.ownerName}</h2>
          <div style="display:flex; justify-content:center;">
            <button id="continue-to-score" class="btn btn-primary" type="button">Continue</button>
          </div>
        </div>
      </section>
    `;
  }

  bindReveal(root, onContinue) {
    const button = root.querySelector('#continue-to-score');
    button.addEventListener('click', onContinue);
  }

  renderScoring(players) {
    const checks = players
      .map(
        (player) => `
          <label class="check-item">
            <input type="checkbox" data-player-id="${player.id}" />
            <span>${player.name}</span>
          </label>
        `
      )
      .join('');

    return `
      <section class="screen">
        <div class="card">
          <h2 class="screen-title">Score Round</h2>
          <p class="screen-subtitle">Checked player +100 points, unchecked player -20 points.</p>
          <div class="check-list">${checks}</div>
          <div style="margin-top:20px;">
            <button id="update-scores-btn" class="btn btn-primary" type="button">Update Scores</button>
          </div>
        </div>
      </section>
    `;
  }

  bindScoring(root, onUpdate) {
    const button = root.querySelector('#update-scores-btn');
    button.addEventListener('click', () => {
      const checked = [...root.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        input.getAttribute('data-player-id')
      );
      onUpdate(checked);
    });
  }
}
