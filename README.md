# Who Shared It

Who Shared It is a production-ready in-person party game web app.
The host sets up players, imports TikTok and Instagram Reel links, downloads all videos locally, runs a reveal-based guessing round, updates scores, and gets a final winner ranking.

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript (ES Modules)
- Backend: Node.js, Express
- Downloader: yt-dlp-exec

## Run

```bash
npm install
npm start
```

Open:

- http://localhost:3000

## Features

- Full game flow from setup to winner screen.
- Host-managed player creation with optional avatar URL.
- Unlimited links per player (TikTok and Instagram Reels).
- Isolated backend downloader service that stores local files in `server/videos`.
- Shuffle all downloaded videos and play one by one.
- Reveal owner, apply scoring, show leaderboard each round.
- Final winner + complete ranking + replay.
- Responsive, modern dark UI with transitions and animations.

## API

### POST /api/download

Body:

```json
{
	"url": "https://..."
}
```

Response:

```json
{
	"success": true,
	"filename": "file.mp4",
	"path": "/videos/file.mp4",
	"error": ""
}
```

If a download fails, the endpoint returns `success: false` with a descriptive `error` and the app continues without crashing.

## Project Structure

```text
client/
	css/
		styles.css
		components.css
		animations.css
	js/
		App.js
		Router.js
		GameState.js
		Player.js
		Video.js
		Game.js
		Scoreboard.js
		Downloader.js
		UI.js
		Utils.js
		views/
			SetupView.js
			PlayersView.js
			VideoSetupView.js
			DownloadView.js
			GameView.js
			RevealView.js
			LeaderboardView.js
			WinnerView.js
	index.html
server/
	app.js
	routes/
		downloadRoutes.js
	controllers/
		downloadController.js
	services/
		VideoDownloader.js
	videos/
package.json
README.md
.gitignore
```

## Notes

- Only downloaded local files are played during the game.
- Public links are required for TikTok and Instagram Reels.
- Download behavior depends on source platform access rules and availability.