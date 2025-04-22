// This file defines interfaces for the podcast episode data structure.

export interface PodcastEpisode {
    title: string;
    description: string;
    audioUrl: string;
    publicationDate: string;
}

export interface PodcastMetadata {
    author: string;
    summary: string;
    episodes: PodcastEpisode[];
}

interface Caller {
    description: string;
}

export interface Episode {
    episode?: string;
    date: string;
    'episode title'?: string;
    title?: string;
    summary: string;
    duration: string;
    callers?: string[];
}

export interface YearEpisodes {
    [year: string]: Episode[];
}

export interface EpisodeStats {
    totalEpisodes: number;
    totalDuration: string;
    averageEpisodesPerMonth: number;
    episodesPerYear: {[year: string]: number};
    yearsAvailable: string[];
}

export { Caller }