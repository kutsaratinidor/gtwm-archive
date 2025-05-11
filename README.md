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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Good Times with Mo Podcast
- All episode metadata and content rights belong to their respective owners