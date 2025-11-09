import { Team, Match } from '../types';

// Mock Teams Data
export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Manchester United',
    logo: 'Shield',
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 10,
    goalDifference: 14,
    points: 23,
  },
  {
    id: '2',
    name: 'Liverpool',
    logo: 'Heart',
    played: 10,
    won: 7,
    drawn: 1,
    lost: 2,
    goalsFor: 22,
    goalsAgainst: 12,
    goalDifference: 10,
    points: 22,
  },
  {
    id: '3',
    name: 'Chelsea',
    logo: 'Circle',
    played: 10,
    won: 6,
    drawn: 3,
    lost: 1,
    goalsFor: 20,
    goalsAgainst: 9,
    goalDifference: 11,
    points: 21,
  },
  {
    id: '4',
    name: 'Arsenal',
    logo: 'Star',
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goalsFor: 19,
    goalsAgainst: 11,
    goalDifference: 8,
    points: 20,
  },
  {
    id: '5',
    name: 'Manchester City',
    logo: 'Crown',
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    goalsFor: 18,
    goalsAgainst: 10,
    goalDifference: 8,
    points: 18,
  },
  {
    id: '6',
    name: 'Tottenham',
    logo: 'Zap',
    played: 10,
    won: 4,
    drawn: 4,
    lost: 2,
    goalsFor: 16,
    goalsAgainst: 13,
    goalDifference: 3,
    points: 16,
  },
  {
    id: '7',
    name: 'Newcastle',
    logo: 'Square',
    played: 10,
    won: 3,
    drawn: 3,
    lost: 4,
    goalsFor: 12,
    goalsAgainst: 15,
    goalDifference: -3,
    points: 12,
  },
  {
    id: '8',
    name: 'Aston Villa',
    logo: 'Triangle',
    played: 10,
    won: 2,
    drawn: 2,
    lost: 6,
    goalsFor: 9,
    goalsAgainst: 19,
    goalDifference: -10,
    points: 8,
  },
];

// Mock Matches Data - Round Robin (ทุกทีมเจอกัน)
export const mockMatches: Match[] = [
  // Round 1 - Finished
  { id: '1', homeTeam: '1', awayTeam: '2', homeTeamName: 'Manchester United', awayTeamName: 'Liverpool', venue: 'สนาม 1', homeScore: 2, awayScore: 1, status: 'finished', round: 1 },
  { id: '2', homeTeam: '3', awayTeam: '4', homeTeamName: 'Chelsea', awayTeamName: 'Arsenal', venue: 'สนาม 2', homeScore: 1, awayScore: 1, status: 'finished', round: 1 },
  { id: '3', homeTeam: '5', awayTeam: '6', homeTeamName: 'Manchester City', awayTeamName: 'Tottenham', venue: 'สนาม 1', homeScore: 3, awayScore: 0, status: 'finished', round: 1 },
  { id: '4', homeTeam: '7', awayTeam: '8', homeTeamName: 'Newcastle', awayTeamName: 'Aston Villa', venue: 'สนาม 2', homeScore: 2, awayScore: 1, status: 'finished', round: 1 },
  
  // Round 2 - Finished
  { id: '5', homeTeam: '1', awayTeam: '3', homeTeamName: 'Manchester United', awayTeamName: 'Chelsea', venue: 'สนาม 1', homeScore: 1, awayScore: 0, status: 'finished', round: 2 },
  { id: '6', homeTeam: '2', awayTeam: '4', homeTeamName: 'Liverpool', awayTeamName: 'Arsenal', venue: 'สนาม 2', homeScore: 2, awayScore: 2, status: 'finished', round: 2 },
  { id: '7', homeTeam: '5', awayTeam: '7', homeTeamName: 'Manchester City', awayTeamName: 'Newcastle', venue: 'สนาม 1', homeScore: 4, awayScore: 1, status: 'finished', round: 2 },
  { id: '8', homeTeam: '6', awayTeam: '8', homeTeamName: 'Tottenham', awayTeamName: 'Aston Villa', venue: 'สนาม 2', homeScore: 2, awayScore: 0, status: 'finished', round: 2 },
  
  // Round 3 - Upcoming
  { id: '9', homeTeam: '1', awayTeam: '4', homeTeamName: 'Manchester United', awayTeamName: 'Arsenal', venue: 'สนาม 1', status: 'scheduled', round: 3 },
  { id: '10', homeTeam: '2', awayTeam: '3', homeTeamName: 'Liverpool', awayTeamName: 'Chelsea', venue: 'สนาม 2', status: 'scheduled', round: 3 },
  { id: '11', homeTeam: '5', awayTeam: '8', homeTeamName: 'Manchester City', awayTeamName: 'Aston Villa', venue: 'สนาม 1', status: 'scheduled', round: 3 },
  { id: '12', homeTeam: '6', awayTeam: '7', homeTeamName: 'Tottenham', awayTeamName: 'Newcastle', venue: 'สนาม 2', status: 'scheduled', round: 3 },
  
  // Round 4 - Upcoming
  { id: '13', homeTeam: '1', awayTeam: '5', homeTeamName: 'Manchester United', awayTeamName: 'Manchester City', venue: 'สนาม 1', status: 'scheduled', round: 4 },
  { id: '14', homeTeam: '2', awayTeam: '6', homeTeamName: 'Liverpool', awayTeamName: 'Tottenham', venue: 'สนาม 2', status: 'scheduled', round: 4 },
  { id: '15', homeTeam: '3', awayTeam: '7', homeTeamName: 'Chelsea', awayTeamName: 'Newcastle', venue: 'สนาม 1', status: 'scheduled', round: 4 },
  { id: '16', homeTeam: '4', awayTeam: '8', homeTeamName: 'Arsenal', awayTeamName: 'Aston Villa', venue: 'สนาม 2', status: 'scheduled', round: 4 },
  
  // Round 5 - Upcoming
  { id: '17', homeTeam: '1', awayTeam: '6', homeTeamName: 'Manchester United', awayTeamName: 'Tottenham', venue: 'สนาม 1', status: 'scheduled', round: 5 },
  { id: '18', homeTeam: '2', awayTeam: '5', homeTeamName: 'Liverpool', awayTeamName: 'Manchester City', venue: 'สนาม 2', status: 'scheduled', round: 5 },
  { id: '19', homeTeam: '3', awayTeam: '8', homeTeamName: 'Chelsea', awayTeamName: 'Aston Villa', venue: 'สนาม 1', status: 'scheduled', round: 5 },
  { id: '20', homeTeam: '4', awayTeam: '7', homeTeamName: 'Arsenal', awayTeamName: 'Newcastle', venue: 'สนาม 2', status: 'scheduled', round: 5 },
  
  // Round 6 - Upcoming
  { id: '21', homeTeam: '1', awayTeam: '7', homeTeamName: 'Manchester United', awayTeamName: 'Newcastle', venue: 'สนาม 1', status: 'scheduled', round: 6 },
  { id: '22', homeTeam: '2', awayTeam: '8', homeTeamName: 'Liverpool', awayTeamName: 'Aston Villa', venue: 'สนาม 2', status: 'scheduled', round: 6 },
  { id: '23', homeTeam: '3', awayTeam: '5', homeTeamName: 'Chelsea', awayTeamName: 'Manchester City', venue: 'สนาม 1', status: 'scheduled', round: 6 },
  { id: '24', homeTeam: '4', awayTeam: '6', homeTeamName: 'Arsenal', awayTeamName: 'Tottenham', venue: 'สนาม 2', status: 'scheduled', round: 6 },
  
  // Round 7 - Upcoming (Final Round)
  { id: '25', homeTeam: '1', awayTeam: '8', homeTeamName: 'Manchester United', awayTeamName: 'Aston Villa', venue: 'สนาม 1', status: 'scheduled', round: 7 },
  { id: '26', homeTeam: '2', awayTeam: '7', homeTeamName: 'Liverpool', awayTeamName: 'Newcastle', venue: 'สนาม 2', status: 'scheduled', round: 7 },
  { id: '27', homeTeam: '3', awayTeam: '6', homeTeamName: 'Chelsea', awayTeamName: 'Tottenham', venue: 'สนาม 1', status: 'scheduled', round: 7 },
  { id: '28', homeTeam: '4', awayTeam: '5', homeTeamName: 'Arsenal', awayTeamName: 'Manchester City', venue: 'สนาม 2', status: 'scheduled', round: 7 },
];
