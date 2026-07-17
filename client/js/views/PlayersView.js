export class PlayersView {
  render(playerCount) {
    const cards = Array.from({ length: playerCount }, (_, index) => {
      const playerNo = index + 1;
      return `
        <article class="card-soft player-card">
          <h3>Player ${playerNo}</h3>
          <label class="input-label" for="player-name-${playerNo}">Name</label>
          <input id="player-name-${playerNo}" class="input player-name" data-player-index="${index}" type="text" maxlength="30" required />
          <label class="input-label" for="player-avatar-${playerNo}" style="margin-top:12px;">Avatar URL (optional)</label>
          <input id="player-avatar-${playerNo}" class="input player-avatar" data-player-index="${index}" type="url" placeholder="https://..." />
        </article>
      `;
    }).join('');

    return `
      <section class="screen">
        <div class="card">
          <h2 class="screen-title">Player Setup</h2>
          <p class="screen-subtitle">Add names and optional avatars for each player.</p>
          <form id="players-form" class="layout-stack" novalidate>
            <div class="player-grid stagger">${cards}</div>
            <div>
              <button class="btn btn-primary" type="submit">Continue</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  bind(root, playerCount, onContinue) {
    const form = root.querySelector('#players-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const names = [...root.querySelectorAll('.player-name')];
      const avatars = [...root.querySelectorAll('.player-avatar')];

      const players = [];
      for (let i = 0; i < playerCount; i += 1) {
        const name = names[i].value.trim();
        const avatar = avatars[i].value.trim();
        if (!name) {
          names[i].focus();
          return;
        }
        players.push({ name, avatar });
      }

      onContinue(players);
    });
  }
}
