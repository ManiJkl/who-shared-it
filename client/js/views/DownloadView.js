export class DownloadView {
  render(items = []) {
    const rows = items
      .map((item, index) => {
        const statusClass = item.status === 'downloaded' ? 'status-done' : item.status === 'failed' ? 'status-failed' : 'status-pending';
        return `
          <tr data-download-row="${index}">
            <td>${item.playerName}</td>
            <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.url}</td>
            <td><span class="status-chip ${statusClass}">${item.status}</span></td>
            <td class="download-error" style="color: var(--danger); font-size:0.84rem;">${item.error || ''}</td>
          </tr>
        `;
      })
      .join('');

    return `
      <section class="screen">
        <div class="card">
          <h2 class="screen-title">Preparing Game</h2>
          <p class="screen-subtitle">Downloading videos. Start is enabled when all downloads finish.</p>

          <div class="layout-stack">
            <div class="progress-track">
              <div id="download-progress" class="progress-fill"></div>
            </div>
            <p id="download-percent" class="inline-note">0%</p>
          </div>

          <div class="card-soft" style="margin-top:18px; overflow:auto;">
            <table style="width:100%; border-collapse: collapse; min-width: 640px;">
              <thead>
                <tr style="text-align:left; color:var(--text-secondary);">
                  <th>Player</th>
                  <th>Video</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody id="download-rows">${rows}</tbody>
            </table>
          </div>

          <div style="margin-top:18px; display:flex; justify-content:flex-end;">
            <button id="start-game-btn" class="btn btn-primary" type="button" disabled>Start Game</button>
          </div>
        </div>
      </section>
    `;
  }

  bindStart(root, onStart) {
    const button = root.querySelector('#start-game-btn');
    button.addEventListener('click', onStart);
  }

  updateProgress(root, percentage) {
    const progress = root.querySelector('#download-progress');
    const text = root.querySelector('#download-percent');
    progress.style.width = `${percentage}%`;
    text.textContent = `${percentage}%`;
  }

  updateRows(root, results) {
    const table = root.querySelector('#download-rows');
    table.innerHTML = results
      .map((item, index) => {
        const statusClass = item.status === 'downloaded' ? 'status-done' : item.status === 'failed' ? 'status-failed' : 'status-pending';
        return `
          <tr data-download-row="${index}">
            <td>${item.playerName}</td>
            <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.url}</td>
            <td><span class="status-chip ${statusClass}">${item.status}</span></td>
            <td class="download-error" style="color: var(--danger); font-size:0.84rem;">${item.error || ''}</td>
          </tr>
        `;
      })
      .join('');
  }

  setStartEnabled(root, enabled) {
    const button = root.querySelector('#start-game-btn');
    button.disabled = !enabled;
  }
}
