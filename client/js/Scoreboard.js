export class Scoreboard {
  constructor(gameState) {
    this.state = gameState;
  }

  getSortedPlayers() {
    return [...this.state.players].sort((a, b) => b.score - a.score);
  }

  getWinner() {
    const sorted = this.getSortedPlayers();
    return sorted.length > 0 ? sorted[0] : null;
  }
}
