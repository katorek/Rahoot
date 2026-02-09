<p align="center">
  <img width="450" height="120" align="center" src="https://raw.githubusercontent.com/Ralex91/Rahoot/main/.github/logo.svg">
  <br>
  <div align="center">
    <img alt="Visitor Badge" src="https://api.visitorbadge.io/api/visitors?path=https://github.com/Ralex91/Rahoot/edit/main/README.md&countColor=%2337d67a">
    <img src="https://img.shields.io/docker/pulls/ralex91/rahoot?style=for-the-badge&color=37d67a" alt="Docker Pulls">
  </div>
</p>

## 🧩 What is this project?

Rahoot is a straightforward and open-source clone of the Kahoot! platform, allowing users to host it on their own server for smaller events.

> ⚠️ This project is still under development, please report any bugs or suggestions in the [issues](https://github.com/Ralex91/Rahoot/issues)

<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Rahoot/main/.github/preview1.jpg" alt="Login">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Rahoot/main/.github/preview2.jpg" alt="Manager Dashboard">
  <img width="30%" src="https://raw.githubusercontent.com/Ralex91/Rahoot/main/.github/preview3.jpg" alt="Question Screen">
</p>

## ⚙️ Prerequisites

Choose one of the following deployment methods:

### Without Docker

- Node.js : version 20 or higher
- PNPM : Learn more about [here](https://pnpm.io/)

### With Docker

- Docker and Docker Compose

## 📖 Getting Started

Choose your deployment method:

### 🐳 Using Docker (Recommended)

Using Docker Compose (recommended):
You can find the docker compose configuration in the repository:
[docker-compose.yml](/compose.yml)

```bash
docker compose up -d
```

Or using Docker directly:

```bash
docker run -d \
  -p 3000:3000 \
  -p 3001:3001 \
  -v ./config:/app/config \
  -e WEB_ORIGIN=http://localhost:3000 \
  -e SOCKET_URL=http://localhost:3001 \
  ralex91/rahoot:latest
```

**Configuration Volume:**
The `-v ./config:/app/config` option mounts a local `config` folder to persist your game settings and quizzes. This allows you to:

- Edit your configuration files directly on your host machine
- Keep your settings when updating the container
- Easily backup your quizzes and game configuration

The folder will be created automatically on first run with an example quiz to get you started.

The application will be available at:

- Web Interface: http://localhost:3000
- WebSocket Server: ws://localhost:3001

### 🛠️ Without Docker

1. Clone the repository:

```bash
git clone https://github.com/Ralex91/Rahoot.git
cd ./Rahoot
```

2. Install dependencies:

```bash
pnpm install
```

3. Change the environment variables in the `.env` file

4. Build and start the application:

```bash
# Development mode
pnpm run dev

# Production mode
pnpm run build
pnpm start
```

## ⚙️ Configuration

The configuration is split into two main parts:

### 1. Game Configuration (`config/game.json`)

Main game settings:

```json
{
  "managerPassword": "PASSWORD",
  "music": true
}
```

Options:

- `managerPassword`: The master password for accessing the manager interface
- `music`: Enable/disable game music

### 2. Quiz Configuration (`config/quizz/*.json`)

Create your quiz files in the `config/quizz/` directory. You can have multiple quiz files and select which one to use when starting a game.

Example quiz with two languages and different types of questions types (`config/quizz/example.json`):

```json 
{
  "subject": "example quiz",
  "defaultLanguage": "PL",
  "questions": [
    {
      "questionType": "MULTI_CHOICE",
      "languageData": {
        "PL": {
          "question": "Jaka jest poprawna odpowiedz video?",
          "answers": ["Poprawna odp", "Tak", "Nie", "Nie", "Nadal nie", "Bez przesady"]
        },
        "EN": {
          "question": "What is good answer with video ?",
          "answers": ["Good answer", "Yes", "No", "No", "Still no", "No excuse"]
        }
      },
      "video": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "solution": [0, 1],
      "cooldown": 0,
      "time": 30
    },
    {
      "questionType": "SINGLE_CHOICE",
      "languageData": {
        "PL": {
          "question": "Jaka jest poprawna odpowiedz audio?",
          "answers": ["Poprawna odp", "Nie"]
        },
        "EN": {
          "question": "What is good answer with audio ?",
          "answers": ["Good answer", "No"]
        }
      },
      "audio": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "solution": [0],
      "cooldown": 0,
      "time": 30
    }
  ]
}
```

Quiz Options:

- `subject`: Title/topic of the quiz
- `defaultLanguage`: Default Language for the quiz (en/pl) 
- `questions`: Array of question objects containing:
  - `questionType`: Question type. Supported values: `MULTI_CHOICE`,`SINGLE_CHOICE`]
  - `languageData`: Language specific question data
    - `PL` / `EN`: langauge code used for in questions / anwsers (check example above). Supported values `PL` / `EN` 
      - `question`: The question text
      - `answers`: Array of possible answers (2-6 options)
  - `image`: Optional URL for question image
  - `video`: Optional URL for video material
  - `solution`: Array with indexes of correct anwsers (0-based)
  - `cooldown`: Time in seconds before showing the question
  - `time`: Time in seconds allowed to answer

 To add new languages, edit `packages/web/src/utils/translations.ts`

## 🎮 How to Play

1. Access the manager interface at http://localhost:3000/manager
2. Enter the manager password (defined in quiz config)
3. Share the game URL (http://localhost:3000) and room code with participants
4. Wait for players to join
5. Click the start button to begin the game

## 📝 Contributing

1. Fork the repository
2. Create a new branch (e.g., `feat/my-feature`)
3. Make your changes
4. Create a pull request
5. Wait for review and merge

For bug reports or feature requests, please [create an issue](https://github.com/Ralex91/Rahoot/issues).

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Ralex91/Rahoot&type=date&legend=bottom-right)](https://www.star-history.com/#Ralex91/Rahoot&type=date&legend=bottom-right)
