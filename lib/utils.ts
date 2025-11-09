import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Team, Match } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sort teams by league standing rules:
 * 1. Points (descending)
 * 2. Goal difference (descending)
 * 3. Goals for (descending)
 */
export function sortTeamsByStanding(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

/**
 * Calculate team statistics from matches
 */
export function calculateTeamStats(teamId: string, matches: Match[]): Partial<Team> {
  const teamMatches = matches.filter(
    m => (m.homeTeam === teamId || m.awayTeam === teamId) && m.status === 'finished'
  );

  let won = 0, drawn = 0, lost = 0;
  let goalsFor = 0, goalsAgainst = 0;

  teamMatches.forEach(match => {
    const isHome = match.homeTeam === teamId;
    const teamScore = isHome ? match.homeScore! : match.awayScore!;
    const opponentScore = isHome ? match.awayScore! : match.homeScore!;

    goalsFor += teamScore;
    goalsAgainst += opponentScore;

    if (teamScore > opponentScore) won++;
    else if (teamScore === opponentScore) drawn++;
    else lost++;
  });

  const points = won * 3 + drawn;
  const goalDifference = goalsFor - goalsAgainst;

  return {
    played: teamMatches.length,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points,
  };
}

/**
 * Generate round-robin fixtures for given teams
 * Each team plays every other team once
 */
export function generateFixtures(teams: Team[]): Omit<Match, 'id'>[] {
  const fixtures: Omit<Match, 'id'>[] = [];
  const teamCount = teams.length;

  for (let i = 0; i < teamCount; i++) {
    for (let j = i + 1; j < teamCount; j++) {
      // Randomly decide home/away
      const isHomeFirst = Math.random() > 0.5;
      const home = isHomeFirst ? teams[i] : teams[j];
      const away = isHomeFirst ? teams[j] : teams[i];

      fixtures.push({
        homeTeam: home.id,
        awayTeam: away.id,
        homeTeamName: home.name,
        awayTeamName: away.name,
        status: 'scheduled',
      });
    }
  }

  // Shuffle fixtures for randomness
  return fixtures.sort(() => Math.random() - 0.5);
}

/**
 * Get next match for a team
 */
export function getNextMatch(teamId: string, matches: Match[]): Match | null {
  const upcomingMatches = matches
    .filter(m => 
      (m.homeTeam === teamId || m.awayTeam === teamId) && 
      m.status === 'scheduled'
    );

  return upcomingMatches[0] || null;
}

/**
 * Format date to Thai locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
