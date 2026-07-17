export class VideoSetupView {
  render(players) {
    const sections = players
      .map(
        (player) => `
          <article class="card-soft" data-player-id="${player.id}">
            <h3 style="margin-top:0;">${player.name}</h3>
            <p class="inline-note">Add TikTok or Instagram Reel links.</p>
            <div class="layout-stack links-container" data-player-links="${player.id}">
              ${this.linkField(player.id, 0)}
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <button class="btn btn-ghost add-link" type="button" data-player-id="${player.id}">+ Add Video</button>
            </div>
          </article>
        `
      )
      .join('');

    return `
      <section class="screen">
        <div class="card">
          <h2 class="screen-title">Video Setup</h2>
          <p class="screen-subtitle">Each player can add unlimited links.</p>
          <form id="video-setup-form" class="layout-stack" novalidate>
            <div class="layout-stack stagger">${sections}</div>
            <div>
              <button class="btn btn-primary" type="submit">Prepare Downloads</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  linkField(playerId, index) {
    return `
      <div class="layout-row" data-link-row>
        <input class="input video-link" data-player-id="${playerId}" type="url" placeholder="https://www.tiktok.com/... or https://www.instagram.com/reel/..." data-link-index="${index}" required />
        <button class="btn btn-danger remove-link" type="button" title="Remove link">Remove</button>
      </div>
    `;
  }

  bind(root, players, onContinue) {
    const addButtons = root.querySelectorAll('.add-link');
    addButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const playerId = button.getAttribute('data-player-id');
        const container = root.querySelector(`[data-player-links="${playerId}"]`);
        const index = container.querySelectorAll('[data-link-row]').length;
        container.insertAdjacentHTML('beforeend', this.linkField(playerId, index));
        this.bindRemovers(root);
      });
    });

    this.bindRemovers(root);

    const form = root.querySelector('#video-setup-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const output = players.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        links: []
      }));

      const allInputs = [...root.querySelectorAll('.video-link')];
      for (const input of allInputs) {
        const value = input.value.trim();
        const playerId = input.getAttribute('data-player-id');
        if (!value) {
          continue;
        }

        const owner = output.find((item) => item.playerId === playerId);
        if (owner) {
          owner.links.push(value);
        }
      }

      const everyPlayerHasVideo = output.every((entry) => entry.links.length > 0);
      if (!everyPlayerHasVideo) {
        const firstEmptyPlayer = output.find((entry) => entry.links.length === 0);
        const firstInput = root.querySelector(`[data-player-links="${firstEmptyPlayer.playerId}"] .video-link`);
        if (firstInput) {
          firstInput.focus();
        }
        return;
      }

      onContinue(output);
    });
  }

  bindRemovers(root) {
    const removeButtons = root.querySelectorAll('.remove-link');
    removeButtons.forEach((button) => {
      if (button.dataset.bound === 'true') {
        return;
      }
      button.dataset.bound = 'true';

      button.addEventListener('click', () => {
        const row = button.closest('[data-link-row]');
        const container = button.closest('.links-container');
        if (!row || !container) {
          return;
        }

        if (container.querySelectorAll('[data-link-row]').length === 1) {
          const input = row.querySelector('input');
          if (input) {
            input.value = '';
          }
          return;
        }

        row.remove();
      });
    });
  }
}
