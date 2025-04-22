import * as fs from 'fs/promises';
import * as path from 'path';
import { Episode, YearEpisodes, EpisodeStats } from './types';

function parseModernDuration(duration: string): number {
  const match = duration.match(/(\d+):(\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  const shortMatch = duration.match(/(\d+):(\d+)/);
  if (shortMatch) {
    return parseInt(shortMatch[1]) * 60 + parseInt(shortMatch[2]);
  }
  return 0;
}

function parseLegacyDuration(duration: string): number {
  const match = duration.match(/(\d+)h (\d+)min/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

function getEpisodeTitle(episode: Episode): string {
  if ('episode title' in episode && episode['episode title']) {
    return episode['episode title'];
  }
  if (episode.title) {
    return episode.title;
  }
  if (episode.episode) {
    return episode.episode;
  }
  return 'Untitled Episode';
}

async function generateSite() {
  const dataDir = path.join(__dirname, '../data');
  const files = await fs.readdir(dataDir);
  const yearlyEpisodes: YearEpisodes = {};
  let allEpisodes: Episode[] = [];

  // Read and parse each year's episodes
  for (const file of files) {
    if (file.endsWith('.json')) {
      const year = file.replace('.json', '');
      const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
      const episodes = JSON.parse(content);
      yearlyEpisodes[year] = episodes;
      allEpisodes = allEpisodes.concat(episodes);
    }
  }

  // Calculate statistics
  const stats: EpisodeStats = {
    totalEpisodes: allEpisodes.length,
    totalDuration: '0h 0min',
    averageEpisodesPerMonth: 0,
    episodesPerYear: {},
    yearsAvailable: Object.keys(yearlyEpisodes).sort()
  };

  let totalMinutes = 0;
  for (const [year, episodes] of Object.entries(yearlyEpisodes)) {
    stats.episodesPerYear[year] = episodes.length;
    for (const episode of episodes) {
      totalMinutes += 'episode title' in episode 
        ? parseModernDuration(episode.duration)
        : parseLegacyDuration(episode.duration);
    }
  }

  stats.totalDuration = formatDuration(totalMinutes);
  stats.averageEpisodesPerMonth = Math.round((stats.totalEpisodes / (stats.yearsAvailable.length * 12)) * 10) / 10;

  // Generate the HTML content
  const templateDir = path.join(__dirname, '../templates');
  const layoutTemplate = await fs.readFile(path.join(templateDir, 'layout.html'), 'utf-8');

  // Create stats section
  const statsHtml = `
    <section class="stats">
      <h2>Podcast Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Episodes</h3>
          <p>${stats.totalEpisodes}</p>
        </div>
        <div class="stat-card">
          <h3>Total Duration</h3>
          <p>${stats.totalDuration}</p>
        </div>
        <div class="stat-card">
          <h3>Average Episodes/Month</h3>
          <p>${stats.averageEpisodesPerMonth}</p>
        </div>
      </div>
    </section>
  `;

  // Create year navigation
  const yearNavHtml = `
    <nav class="year-nav">
      ${stats.yearsAvailable.map(year => `
        <a href="#year-${year}" class="year-nav-item">
          ${year} (${stats.episodesPerYear[year]} episodes)
        </a>
      `).join('')}
    </nav>
  `;

  // Create episode sections by year
  const episodesHtml = stats.yearsAvailable.map(year => `
    <section id="year-${year}" class="year-section">
      <h2>${year}</h2>
      <div class="episodes-grid">
        ${yearlyEpisodes[year].map(episode => `
          <article class="episode-card">
            <header>
              <h3>${getEpisodeTitle(episode)}</h3>
              <time datetime="${episode.date}">${episode.date}</time>
            </header>
            <div class="episode-content">
              <div class="duration">${episode.duration}</div>
              <div class="summary">${episode.summary}</div>
              ${episode.callers ? `
                <div class="callers">
                  <h4>Callers:</h4>
                  <ul>
                    ${episode.callers.map(caller => `<li>${caller}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  // Combine everything
  const combinedHtml = layoutTemplate
    .replace('<!-- Content will be injected here including statistics and episodes -->', `
      ${statsHtml}
      ${yearNavHtml}
      ${episodesHtml}
    `);

  // Write the final HTML
  const publicDir = path.join(__dirname, '../../public');
  await fs.writeFile(path.join(publicDir, 'index.html'), combinedHtml);
}

generateSite().catch(console.error);