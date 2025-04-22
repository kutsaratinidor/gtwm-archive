# GTWM Archive

A comprehensive archive of Good Times with Mo podcast episodes. This project generates a static site to showcase the podcast episodes with a clean, searchable interface.

## Project Structure

```
gtwm-archive
├── src
│   ├── data
│   │   └── *.json       # Year-based episode data
│   ├── templates
│   │   ├── episode.html
│   │   ├── index.html
│   │   └── layout.html
│   ├── scripts
│   │   ├── generate.ts
│   │   ├── types.ts
│   │   ├── update-episodes.ts
│   │   └── python/
│   │       ├── gtwmparse.py
│   │       └── requirements.txt
│   └── styles
│       └── main.css
├── content
│   └── episodes
│       └── metadata
│           └── index.json
├── public
│   └── .gitkeep
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url> gtwm-archive
   ```

2. Navigate to the project directory:
   ```
   cd gtwm-archive
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Generate the static site:
   ```
   npm run build
   ```

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment. To set it up:

1. Push this repository to GitHub
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Set the Source to "GitHub Actions"
   - The site will be available at `https://[username].github.io/gtwm-archive`

3. If you want to deploy to a custom server instead of GitHub Pages:
   - Create a new secret in your repository settings called `DEPLOY_KEY` with your server's SSH key
   - Modify the `.github/workflows/main.yml` file to use your preferred deployment method

### Local Development

```bash
npm install
npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

The site will be available at `http://localhost:8080`

## Usage

- Episode data is automatically updated daily via GitHub Actions
- New episodes are fetched from the source and added to the corresponding year's JSON file
- The static site is automatically rebuilt and deployed when new episodes are added

## License

This project is licensed under the MIT License.