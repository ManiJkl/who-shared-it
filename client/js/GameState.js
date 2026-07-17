export class GameState {
  constructor() {
    this.players = [];
    this.videos = [];
    this.currentVideo = null;
    this.currentVideoIndex = -1;
    this.phase = 'setup';
  }

  setPhase(phase) {
    this.phase = phase;
  }

  setPlayers(players) {
    this.players = [...players];
  }

  setVideos(videos) {
    this.videos = [...videos];
  }

  setCurrentVideo(video, index) {
    this.currentVideo = video || null;
    this.currentVideoIndex = Number.isInteger(index) ? index : this.currentVideoIndex;
  }

  reset() {
    this.players = [];
    this.videos = [];
    this.currentVideo = null;
    this.currentVideoIndex = -1;
    this.phase = 'setup';
  }
}
