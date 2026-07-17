import { Router } from './Router.js';
import { UI } from './UI.js';
import { GameState } from './GameState.js';
import { Game } from './Game.js';
import { Player } from './Player.js';
import { Video } from './Video.js';
import { Scoreboard } from './Scoreboard.js';
import { Downloader } from './Downloader.js';
import { SetupView } from './views/SetupView.js';
import { PlayersView } from './views/PlayersView.js';
import { VideoSetupView } from './views/VideoSetupView.js';
import { DownloadView } from './views/DownloadView.js';
import { GameView } from './views/GameView.js';
import { RevealView } from './views/RevealView.js';
import { LeaderboardView } from './views/LeaderboardView.js';
import { WinnerView } from './views/WinnerView.js';

class App {
  constructor() {
    this.ui = new UI('#app');
    this.router = new Router();
    this.state = new GameState();
    this.game = new Game(this.state);
    this.scoreboard = new Scoreboard(this.state);
    this.downloader = new Downloader('/api/download');

    this.playerCount = 0;
    this.downloadQueue = [];
    this.downloadResults = [];

    this.setupView = new SetupView();
    this.playersView = new PlayersView();
    this.videoSetupView = new VideoSetupView();
    this.downloadView = new DownloadView();
    this.gameView = new GameView();
    this.revealView = new RevealView();
    this.leaderboardView = new LeaderboardView();
    this.winnerView = new WinnerView();
  }

  init() {
    this.router.register('setup', () => this.renderSetup());
    this.router.register('players', () => this.renderPlayers());
    this.router.register('video-setup', () => this.renderVideoSetup());
    this.router.register('download', () => this.renderDownload());
    this.router.register('game', () => this.renderGame());
    this.router.register('reveal', () => this.renderReveal());
    this.router.register('score', () => this.renderScoreSelection());
    this.router.register('leaderboard', () => this.renderLeaderboard());
    this.router.register('winner', () => this.renderWinner());

    this.router.navigate('setup');
  }

  renderSetup() {
    this.state.setPhase('setup');
    this.ui.render(this.setupView.render());
    this.setupView.bind(this.ui.root, (playerCount) => {
      this.playerCount = playerCount;
      this.router.navigate('players');
    });
  }

  renderPlayers() {
    this.state.setPhase('players');
    this.ui.render(this.playersView.render(this.playerCount));
    this.playersView.bind(this.ui.root, this.playerCount, (playersInput) => {
      this.state.players = [];
      playersInput.forEach((entry) => {
        this.game.addPlayer(new Player(entry));
      });
      this.router.navigate('video-setup');
    });
  }

  renderVideoSetup() {
    this.state.setPhase('video-setup');
    this.ui.render(this.videoSetupView.render(this.state.players));
    this.videoSetupView.bind(this.ui.root, this.state.players, (linksByPlayer) => {
      this.downloadQueue = linksByPlayer.flatMap((entry) =>
        entry.links.map((url) => ({
          playerId: entry.playerId,
          playerName: entry.playerName,
          url
        }))
      );
      this.router.navigate('download');
    });
  }

  async renderDownload() {
    this.state.setPhase('download');

    this.downloadResults = this.downloadQueue.map((item) => ({
      ...item,
      success: false,
      status: 'pending',
      filename: '',
      path: '',
      error: ''
    }));

    this.ui.render(this.downloadView.render(this.downloadResults));
    this.downloadView.bindStart(this.ui.root, () => {
      this.state.videos = this.state.videos.filter((video) => video.status === 'downloaded');
      this.game.shuffleVideos();
      this.game.nextVideo();
      this.router.navigate('game');
    });

    const results = await this.downloader.downloadVideos(this.downloadQueue, ({ percentage, results: partialResults }) => {
      this.downloadResults = partialResults;
      this.downloadView.updateRows(this.ui.root, this.downloadResults);
      this.downloadView.updateProgress(this.ui.root, percentage);
    });

    const mappedVideos = results.map(
      (result) =>
        new Video({
          ownerId: result.playerId,
          ownerName: result.playerName,
          originalUrl: result.url,
          localPath: result.path,
          status: result.success ? 'downloaded' : 'failed'
        })
    );

    this.state.videos = mappedVideos;
    const downloadedCount = mappedVideos.filter((item) => item.status === 'downloaded').length;
    const canStart = downloadedCount > 0;

    this.downloadView.setStartEnabled(this.ui.root, canStart);
    if (!canStart) {
      const startButton = this.ui.root.querySelector('#start-game-btn');
      startButton.textContent = 'No videos downloaded';
    }
  }

  renderGame() {
    this.state.setPhase('game');
    const currentVideo = this.game.getCurrentVideo();
    if (!currentVideo) {
      this.router.navigate('winner');
      return;
    }

    this.ui.render(this.gameView.render(currentVideo));
    this.gameView.bind(this.ui.root, () => {
      this.router.navigate('reveal');
    });
  }

  renderReveal() {
    this.state.setPhase('reveal');
    const currentVideo = this.game.getCurrentVideo();
    if (!currentVideo) {
      this.router.navigate('winner');
      return;
    }

    this.ui.render(this.revealView.renderReveal(currentVideo));
    this.revealView.bindReveal(this.ui.root, () => {
      this.router.navigate('score');
    });
  }

  renderScoreSelection() {
    this.state.setPhase('score');
    this.ui.render(this.revealView.renderScoring(this.state.players));
    this.revealView.bindScoring(this.ui.root, (checkedPlayerIds) => {
      this.state.players.forEach((player) => {
        const hit = checkedPlayerIds.includes(player.id);
        this.game.updateScore(player.id, hit ? 100 : -20);
      });
      this.router.navigate('leaderboard');
    });
  }

  renderLeaderboard() {
    this.state.setPhase('leaderboard');
    const sorted = this.scoreboard.getSortedPlayers();
    this.ui.render(this.leaderboardView.render(sorted, this.state.currentVideoIndex, this.state.videos.length));

    setTimeout(() => {
      const next = this.game.nextVideo();
      if (next) {
        this.router.navigate('game');
      } else {
        this.router.navigate('winner');
      }
    }, 3000);
  }

  renderWinner() {
    this.state.setPhase('winner');
    const winner = this.scoreboard.getWinner();
    const ranking = this.scoreboard.getSortedPlayers();
    this.ui.render(this.winnerView.render(winner, ranking));
    this.winnerView.bind(this.ui.root, () => {
      this.game.resetGame();
      this.playerCount = 0;
      this.downloadQueue = [];
      this.downloadResults = [];
      this.router.navigate('setup');
    });
  }
}

const app = new App();
app.init();
