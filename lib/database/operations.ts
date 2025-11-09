import { supabase } from '@/lib/supabase'
import { Team, Match, Season } from '@/lib/types'

// Teams operations
export const teamsDb = {
  async getAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('points', { ascending: false })
    
    if (error) throw error
    
    return data.map(team => ({
      id: team.id,
      name: team.name,
      logo: team.logo,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goals_for,
      goalsAgainst: team.goals_against,
      goalDifference: team.goal_difference,
      points: team.points
    }))
  },

  async create(team: Omit<Team, 'id'>): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        name: team.name,
        logo: team.logo,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goals_for: team.goalsFor,
        goals_against: team.goalsAgainst,
        goal_difference: team.goalDifference,
        points: team.points
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo,
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goalsFor: data.goals_for,
      goalsAgainst: data.goals_against,
      goalDifference: data.goal_difference,
      points: data.points
    }
  },

  async update(id: string, updates: Partial<Team>): Promise<Team> {
    const dbUpdates: any = {}
    if (updates.name) dbUpdates.name = updates.name
    if (updates.logo) dbUpdates.logo = updates.logo
    if (updates.played !== undefined) dbUpdates.played = updates.played
    if (updates.won !== undefined) dbUpdates.won = updates.won
    if (updates.drawn !== undefined) dbUpdates.drawn = updates.drawn
    if (updates.lost !== undefined) dbUpdates.lost = updates.lost
    if (updates.goalsFor !== undefined) dbUpdates.goals_for = updates.goalsFor
    if (updates.goalsAgainst !== undefined) dbUpdates.goals_against = updates.goalsAgainst
    if (updates.goalDifference !== undefined) dbUpdates.goal_difference = updates.goalDifference
    if (updates.points !== undefined) dbUpdates.points = updates.points
    dbUpdates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('teams')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo,
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goalsFor: data.goals_for,
      goalsAgainst: data.goals_against,
      goalDifference: data.goal_difference,
      points: data.points
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Matches operations
export const matchesDb = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('round', { ascending: true })
      .order('created_at', { ascending: true }) // ใช้ created_at ก่อนจนกว่าจะมี match_order
    
    if (error) throw error
    
    return data.map(match => ({
      id: match.id,
      homeTeam: match.home_team_id,
      awayTeam: match.away_team_id,
      homeTeamName: match.home_team_name,
      awayTeamName: match.away_team_name,
      venue: match.venue,
      homeScore: match.home_score,
      awayScore: match.away_score,
      status: match.status,
      round: match.round,
      matchOrder: match.match_order || 0, // Default ถ้าไม่มี
      matchDate: match.match_date,
      matchTime: match.match_time
    }))
  },

  async create(match: Omit<Match, 'id'>): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        home_team_id: match.homeTeam,
        away_team_id: match.awayTeam,
        home_team_name: match.homeTeamName,
        away_team_name: match.awayTeamName,
        venue: match.venue,
        home_score: match.homeScore,
        away_score: match.awayScore,
        status: match.status,
        round: match.round,
        match_order: match.matchOrder || 0, // Default ถ้าไม่มี
        match_date: match.matchDate,
        match_time: match.matchTime
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      homeTeam: data.home_team_id,
      awayTeam: data.away_team_id,
      homeTeamName: data.home_team_name,
      awayTeamName: data.away_team_name,
      venue: data.venue,
      homeScore: data.home_score,
      awayScore: data.away_score,
      status: data.status,
      round: data.round,
      matchOrder: data.match_order || 0, // Default ถ้าไม่มี
      matchDate: data.match_date,
      matchTime: data.match_time
    }
  },

  async update(id: string, updates: Partial<Match>): Promise<Match> {
    const dbUpdates: any = { updated_at: new Date().toISOString() }
    
    // เช็คค่า undefined อย่างระมัดระวัง
    if (updates.homeScore !== undefined && updates.homeScore !== null) {
      dbUpdates.home_score = updates.homeScore
    }
    if (updates.awayScore !== undefined && updates.awayScore !== null) {
      dbUpdates.away_score = updates.awayScore
    }
    if (updates.status && updates.status.trim() !== '') {
      dbUpdates.status = updates.status
    }
    if (updates.venue && updates.venue.trim() !== '') {
      dbUpdates.venue = updates.venue
    }

    console.log('Updating match with:', dbUpdates); // เพิ่ม debug log

    const { data, error } = await supabase
      .from('matches')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error); // เพิ่ม debug log
      throw error;
    }
    
    return {
      id: data.id,
      homeTeam: data.home_team_id,
      awayTeam: data.away_team_id,
      homeTeamName: data.home_team_name,
      awayTeamName: data.away_team_name,
      venue: data.venue,
      homeScore: data.home_score,
      awayScore: data.away_score,
      status: data.status,
      round: data.round,
      matchOrder: data.match_order || 0, // Default ถ้าไม่มี
      matchDate: data.match_date,
      matchTime: data.match_time
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Seasons operations
export const seasonsDb = {
  async getAll(): Promise<Season[]> {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(season => ({
      id: season.id,
      name: season.name,
      eventDate: season.event_date,
      createdAt: season.created_at,
      closedAt: season.closed_at,
      status: season.status,
      teams: season.teams_snapshot || [],
      matches: season.matches_snapshot || [],
      standings: season.standings_snapshot || []
    }))
  },

  async create(season: Omit<Season, 'id'>): Promise<Season> {
    const { data, error } = await supabase
      .from('seasons')
      .insert([{
        name: season.name,
        event_date: season.eventDate,
        status: season.status,
        teams_snapshot: season.teams,
        matches_snapshot: season.matches,
        standings_snapshot: season.standings,
        closed_at: season.closedAt
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      eventDate: data.event_date,
      createdAt: data.created_at,
      closedAt: data.closed_at,
      status: data.status,
      teams: data.teams_snapshot || [],
      matches: data.matches_snapshot || [],
      standings: data.standings_snapshot || []
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}