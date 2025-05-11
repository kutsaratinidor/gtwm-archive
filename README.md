# GTWM Podcast Archive

A comprehensive archive of Good Times with Mo (GTWM) podcast episodes. This project generates a static site to showcase the podcast episodes with a clean, searchable interface and automated episode updates.

[![GitHub Actions Status](https://github.com/kutsaratinidor/gtwm-archive/workflows/CI/CD%20and%20Episode%20Updates/badge.svg)](https://github.com/kutsaratinidor/gtwm-archive/actions)

## Features

- Comprehensive episode archive from 2019 to present
- Responsive design with dark mode support
- Episode statistics and analytics
- Year-based navigation and filtering
- Automated daily episode updates
- Dark mode support
- Episode statistics and duration tracking
- Continuous deployment via GitHub Actions

## Technology Stack

- **Frontend**: HTML5, CSS3, TypeScript
- **Build Tools**: Node.js, npm
- **Data Processing**: Python (for episode parsing)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## Project Structure

```
gtwm-archive
├── src/
│   ├── data/            # Year-based episode JSON files
│   │   └── *.json       # One JSON file per year (2019-present)
│   ├── templates/       # HTML templates
│   │   ├── episode.html # Individual episode template
│   │   ├── index.html   # Main page template
│   │   └── layout.html  # Base layout template
│   ├── scripts/         # TypeScript & Python scripts
│   │   ├── generate.ts  # Static site generator
│   │   ├── types.ts     # TypeScript type definitions
│   │   ├── update-episodes.ts  # Episode updater
│   │   └── python/      # Python scripts for parsing
│   └── styles/         # CSS styles
│       └── main.css    # Main stylesheet
├── content/           # Content storage
│   └── episodes/      # Episode metadata
├── public/           # Generated static site
├── package.json      # Node.js dependencies
└── tsconfig.json    # TypeScript configuration
```

## Prerequisites

- Node.js (v18 or higher)
- Python 3.x
- npm or yarn
- Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gtwm-archive.git
   cd gtwm-archive
   ```

2. Install dependencies:
   ```bash
   npm install
   pip install -r src/scripts/python/requirements.txt
   ```

3. Generate the static site:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The site will be available at `http://localhost:8080`

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment:

1. Push this repository to GitHub
2. Configure GitHub Pages:
   - Go to repository Settings > Pages
   - Set the Source to "GitHub Actions"
   - Your site will be available at `https://[username].github.io/gtwm-archive`

### Alternative Deployment Options

#### Custom Domain
1. Add your domain in repository Settings > Pages
2. Create a `CNAME` record pointing to `[username].github.io`
3. Add `CUSTOM_DOMAIN` secret in repository settings with your domain

### Development Mode
For local development with hot-reloading:
```bash
npm run dev
```

## Usage

### Automated Updates
- Episodes are automatically updated daily via GitHub Actions
- Updates run at 12-hour intervals
- New episodes are sorted by year and added to corresponding JSON files

### Manual Updates
To manually update episodes:
```bash
npm run update
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Good Times with Mo Podcast
- All episode metadata and content rights belong to their respective owners