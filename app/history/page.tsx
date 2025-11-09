'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { matchesDb, teamsDb } from '@/lib/database/operations';
import { Match, Team } from '@/lib/types';
import { Trophy, Medal, Award, Calendar, Eye, TrendingUp, Users, Target, BarChart3, Clock, MapPin } from 'lucide-react';

interface TeamStats {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface RoundSummary {
  round: number;
  matches: Match[];
  totalGoals: number;
  finishedMatches: number;
}

export default function HistoryPage() {
  const [finishedMatches, setFinishedMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'rounds' | 'teams'>('all');

  // โหลดข้อมูลจาก Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [matchesData, teamsData] = await Promise.all([
          matchesDb.getAll(),
          teamsDb.getAll()
        ]);

        // กรองเฉพาะแมทช์ที่จบแล้ว
        const finished = matchesData.filter(match => match.status === 'finished');
        setFinishedMatches(finished);
        setTeams(teamsData);
        console.log('Loaded finished matches:', finished);
        console.log('Loaded teams:', teamsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // คำนวณสถิติทีม
  const calculateTeamStats = (): TeamStats[] => {
    const stats: {[key: string]: TeamStats} = {};

    // Initialize stats for all teams
    teams.forEach(team => {
      stats[team.id] = {
        id: team.id,
        name: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    // Calculate stats from finished matches
    finishedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const homeTeam = stats[match.homeTeam];
        const awayTeam = stats[match.awayTeam];

        if (homeTeam && awayTeam) {
          homeTeam.played++;
          awayTeam.played++;
          homeTeam.goalsFor += match.homeScore;
          homeTeam.goalsAgainst += match.awayScore;
          awayTeam.goalsFor += match.awayScore;
          awayTeam.goalsAgainst += match.homeScore;

          if (match.homeScore > match.awayScore) {
            homeTeam.won++;
            homeTeam.points += 3;
            awayTeam.lost++;
          } else if (match.homeScore < match.awayScore) {
            awayTeam.won++;
            awayTeam.points += 3;
            homeTeam.lost++;
          } else {
            homeTeam.drawn++;
            awayTeam.drawn++;
            homeTeam.points += 1;
            awayTeam.points += 1;
          }

          homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
          awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
        }
      }
    });

    return Object.values(stats)
      .filter(team => team.played > 0)
      .sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points;
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  };

  // สรุปตามนัด
  const getRoundSummary = (): RoundSummary[] => {
    const rounds: {[key: number]: RoundSummary} = {};

    finishedMatches.forEach(match => {
      const round = match.round || 1;
      if (!rounds[round]) {
        rounds[round] = {
          round,
          matches: [],
          totalGoals: 0,
          finishedMatches: 0
        };
      }

      rounds[round].matches.push(match);
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        rounds[round].totalGoals += match.homeScore + match.awayScore;
        rounds[round].finishedMatches++;
      }
    });

    return Object.values(rounds).sort((a, b) => a.round - b.round);
  };

  const teamStats = calculateTeamStats();
  const roundSummary = getRoundSummary();
  const totalGoals = finishedMatches.reduce((sum, match) => 
    sum + (match.homeScore || 0) + (match.awayScore || 0), 0);

  // แปลงวันที่เป็นภาษาไทย
  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <Navigation activePage="history" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">กำลังโหลดประวัติการแข่งขัน...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <Navigation activePage="history" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            ประวัติการแข่งขัน
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            สถิติและผลการแข่งขันที่จบไปแล้ว ({finishedMatches.length} แมทช์)
          </p>
        </div>

        {finishedMatches.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <Calendar className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-2">
              ยังไม่มีประวัติการแข่งขัน
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              เมื่อแมทช์จบลงจะแสดงที่นี่
            </p>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{finishedMatches.length}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">แมทช์ที่จบแล้ว</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalGoals}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">ประตูทั้งหมด</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{teamStats.length}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">ทีมที่เล่นแล้ว</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {finishedMatches.length > 0 ? (totalGoals / finishedMatches.length).toFixed(1) : '0'}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">ประตู/แมทช์</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilterBy('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterBy === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterBy('teams')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterBy === 'teams'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                ตารางคะแนน
              </button>
              <button
                onClick={() => setFilterBy('rounds')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterBy === 'rounds'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                ตามนัด
              </button>
            </div>

            {/* Content based on filter */}
            {filterBy === 'teams' && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">ตารางคะแนน</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    จากแมทช์ที่จบแล้ว {finishedMatches.length} แมทช์
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-400">อันดับ</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-400">ทีม</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">แข่ง</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">ชนะ</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">เสมอ</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">แพ้</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">ได้</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">เสีย</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">+/-</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">คะแนน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamStats.map((team, index) => {
                        const position = index + 1;
                        let positionColorClass = '';
                        let PositionIcon = null;

                        if (position === 1) {
                          positionColorClass = 'bg-yellow-50 dark:bg-yellow-900/20';
                          PositionIcon = Trophy;
                        } else if (position === 2) {
                          positionColorClass = 'bg-gray-50 dark:bg-gray-800/50';
                          PositionIcon = Medal;
                        } else if (position === 3) {
                          positionColorClass = 'bg-orange-50 dark:bg-orange-900/20';
                          PositionIcon = Award;
                        }

                        return (
                          <tr
                            key={team.id}
                            className={`border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${positionColorClass}`}
                          >
                            <td className="px-4 py-3 font-bold">
                              <div className="flex items-center gap-2">
                                {PositionIcon && <PositionIcon className="w-4 h-4" />}
                                <span>{position}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium">{team.name}</td>
                            <td className="px-4 py-3 text-center">{team.played}</td>
                            <td className="px-4 py-3 text-center text-green-600 font-medium">{team.won}</td>
                            <td className="px-4 py-3 text-center text-yellow-600 font-medium">{team.drawn}</td>
                            <td className="px-4 py-3 text-center text-red-600 font-medium">{team.lost}</td>
                            <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                            <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                            <td className={`px-4 py-3 text-center font-medium ${
                              team.goalDifference > 0 ? 'text-green-600' : 
                              team.goalDifference < 0 ? 'text-red-600' : ''
                            }`}>
                              {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-blue-600">{team.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filterBy === 'rounds' && (
              <div className="space-y-6">
                {roundSummary.map((round) => (
                  <div key={round.round} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            นัดที่ {round.round}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {round.finishedMatches} แมทช์ • {round.totalGoals} ประตู
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedRound(selectedRound === round.round ? null : round.round)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedRound === round.round ? 'ซ่อน' : 'ดู'}
                        </button>
                      </div>
                    </div>
                    
                    {selectedRound === round.round && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {round.matches.map(match => (
                            <div key={match.id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1 text-right">
                                  <span className="font-medium text-zinc-900 dark:text-white">
                                    {teams.find(t => t.id === match.homeTeam)?.name}
                                  </span>
                                </div>
                                <div className="px-4 flex items-center gap-2">
                                  <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                    {match.homeScore}
                                  </span>
                                  <span className="text-zinc-400">-</span>
                                  <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                    {match.awayScore}
                                  </span>
                                </div>
                                <div className="flex-1 text-left">
                                  <span className="font-medium text-zinc-900 dark:text-white">
                                    {teams.find(t => t.id === match.awayTeam)?.name}
                                  </span>
                                </div>
                              </div>
                              {match.venue && (
                                <div className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  <MapPin className="w-3 h-3" />
                                  <span>{match.venue}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {filterBy === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team Statistics */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">อันดับปัจจุบัน</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Top 5 ทีม
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    {teamStats.slice(0, 5).map((team, index) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {team.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-zinc-900 dark:text-white">{team.points} คะแนน</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {team.won}ชนะ {team.drawn}เสมอ {team.lost}แพ้
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Matches */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">แมทช์ล่าสุด</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      5 แมทช์ที่ผ่านมา
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    {finishedMatches.slice(-5).reverse().map(match => (
                      <div key={match.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-right">
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">
                              {teams.find(t => t.id === match.homeTeam)?.name}
                            </span>
                          </div>
                          <div className="px-4 flex items-center gap-2">
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {match.homeScore}
                            </span>
                            <span className="text-zinc-400">-</span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {match.awayScore}
                            </span>
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">
                              {teams.find(t => t.id === match.awayTeam)?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>นัดที่ {match.round}</span>
                          <span>{match.venue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}