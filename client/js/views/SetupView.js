export class SetupView {
  render() {
    return `
      <section class="screen">
        <div class="card scale-in">
          <h1 class="screen-title">Who Shared It</h1>
          <p class="screen-subtitle">Set the number of players and start preparing your party game.</p>
          <form id="setup-form" class="layout-stack" novalidate>
            <div>
              <label class="input-label" for="playerCount">Number of players</label>
              <input id="playerCount" class="input" type="number" min="2" max="20" value="4" required />
            </div>
            <div>
              <button class="btn btn-primary pulse" type="submit">Continue</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  bind(root, onContinue) {
    const form = root.querySelector('#setup-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = root.querySelector('#playerCount');
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < 2 || value > 20) {
        input.focus();
        return;
      }
      onContinue(value);
    });
  }
}
