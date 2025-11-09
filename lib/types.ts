// Types for Football League Management System

export interface Team {
  id: string;
  name: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamName: string;
  awayTeamName: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
  round?: number;
  matchOrder?: number; // ลำดับการแข่งขัน เพื่อรักษาลำดับ
  matchDate?: string; // วันที่แข่งขัน (YYYY-MM-DD)
  matchTime?: string; // เวลาแข่งขัน (HH:mm)
}

export interface Season {
  id: string;
  name: string;
  eventDate: string; // วันที่จัดการแข่งขัน
  createdAt: string;
  closedAt?: string;
  status: 'active' | 'closed';
  teams: Team[]; // snapshot ของทีมในลีกนั้น
  matches: Match[]; // snapshot ของแมตช์ในลีกนั้น
  standings: Team[]; // ตารางคะแนนสุดท้าย (คำนวณแล้ว)
}
