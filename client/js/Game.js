import { Utils } from './Utils.js';

export class Game {
  constructor(gameState) {
    this.state = gameState;
  }

  addPlayer(player) {
    this.state.players.push(player);
    return player;
  }

  removePlayer(playerId) {
    this.state.players = this.state.players.filter((player) => player.id !== playerId);
  }

  setVideos(videos) {
    this.state.videos = [...videos];
    this.state.currentVideoIndex = -1;
    this.state.currentVideo = null;
  }

  shuffleVideos() {
    this.state.videos = Utils.shuffle(this.state.videos);
    this.state.currentVideoIndex = -1;
    this.state.currentVideo = null;
    return this.state.videos;
  }

  nextVideo() {
    if (this.state.currentVideo) {
      this.state.currentVideo.used = true;
    }

    const nextIndex = this.state.currentVideoIndex + 1;
    if (nextIndex >= this.state.videos.length) {
      this.finishGame();
      return null;
    }

    this.state.currentVideoIndex = nextIndex;
    this.state.currentVideo = this.state.videos[nextIndex];
    return this.state.currentVideo;
  }

  getCurrentVideo() {
    return this.state.currentVideo;
  }

  updateScore(playerId, delta) {
    const player = this.state.players.find((item) => item.id === playerId);
    if (!player) {
      return null;
    }
    player.score += Number(delta) || 0;
    return player.score;
  }

  finishGame() {
    this.state.phase = 'winner';
    this.state.currentVideo = null;
  }

  resetGame() {
    this.state.reset();
  }
}
