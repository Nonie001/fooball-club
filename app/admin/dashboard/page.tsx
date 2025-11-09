'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { teamsDb, matchesDb, seasonsDb } from '@/lib/database/operations';
import { supabase } from '@/lib/supabase';
import { Team, Match } from '@/lib/types';
import { Shield, ArrowLeft, LogOut, Users, Calendar, Target, Plus, Trash2, MapPin, Archive, RotateCcw, Trophy, Zap, Star, Circle, Square, Triangle, Heart, Crown, Flag, Gem, Hexagon } from 'lucide-react';
import { Season } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'event' | 'teams' | 'matches' | 'scores' | 'season'>('event');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagueStatus, setLeagueStatus] = useState<'closed' | 'open'>('closed');
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check authentication และโหลดข้อมูล
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    // โหลดสถานะลีก
    const savedLeagueStatus = localStorage.getItem('leagueStatus');
    if (savedLeagueStatus) {
      setLeagueStatus(savedLeagueStatus as 'closed' | 'open');
    } else {
      setLeagueStatus('closed');
      localStorage.setItem('leagueStatus', 'closed');
    }

    // โหลดข้อมูลจาก Supabase
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loadedTeams, loadedMatches] = await Promise.all([
        teamsDb.getAll(),
        matchesDb.getAll()
      ]);
      setTeams(loadedTeams);
      setMatches(loadedMatches);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white dark:bg-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            <div className="flex items-center gap-3 sm:gap-4">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">
                  Brotherhood FC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">กลับหน้าแรก</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <LogOut className="w-5 h-5 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* League Status Banner */}
        <div className={`mb-6 p-4 rounded-xl border-2 ${
          leagueStatus === 'open' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                leagueStatus === 'open' ? 'bg-green-500' : 'bg-orange-500'
              }`}></div>
              <div>
                <h3 className={`text-lg font-bold ${
                  leagueStatus === 'open' 
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-orange-800 dark:text-orange-300'
                }`}>
                  สถานะลีก: {leagueStatus === 'open' ? 'เปิดดำเนินการ' : 'ปิด'}
                </h3>
                <p className={`text-sm ${
                  leagueStatus === 'open'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {leagueStatus === 'open' 
                    ? 'สามารถจัดการทีม แมตช์ และใส่ผลการแข่งขันได้'
                    : 'ต้องเปิดลีกก่อนเพื่อจัดการข้อมูล'
                  }
                </p>
              </div>
            </div>
            {leagueStatus === 'closed' && (
              <button
                onClick={() => {
                  setLeagueStatus('open');
                  localStorage.setItem('leagueStatus', 'open');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                เปิดลีก
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-white dark:bg-zinc-900 p-1 sm:p-2 rounded-lg shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('event')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'event'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>ตั้งค่าวันแข่ง</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            disabled={leagueStatus === 'closed'}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'teams'
                ? 'bg-blue-600 text-white shadow-lg'
                : leagueStatus === 'closed'
                ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>จัดการทีม</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('season')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'season'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>จัดการลีก</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            disabled={leagueStatus === 'closed'}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white shadow-lg'
                : leagueStatus === 'closed'
                ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>จัดการแมตช์</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            disabled={leagueStatus === 'closed'}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'scores'
                ? 'bg-blue-600 text-white shadow-lg'
                : leagueStatus === 'closed'
                ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>ใส่สกอร์</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'event' && <EventManager />}
        {activeTab === 'season' && <SeasonManager teams={teams} matches={matches} setTeams={setTeams} setMatches={setMatches} leagueStatus={leagueStatus} setLeagueStatus={setLeagueStatus} />}
        {activeTab === 'teams' && (
          leagueStatus === 'closed' ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                ต้องเปิดลีกก่อนเพื่อจัดการทีม
              </p>
              <button
                onClick={() => {
                  setLeagueStatus('open');
                  localStorage.setItem('leagueStatus', 'open');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                เปิดลีก
              </button>
            </div>
          ) : (
            <TeamsManager teams={teams} setTeams={setTeams} />
          )
        )}
        {activeTab === 'matches' && (
          leagueStatus === 'closed' ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                ต้องเปิดลีกก่อนเพื่อจัดการแมตช์
              </p>
              <button
                onClick={() => {
                  setLeagueStatus('open');
                  localStorage.setItem('leagueStatus', 'open');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                เปิดลีก
              </button>
            </div>
          ) : (
            <MatchesManager matches={matches} setMatches={setMatches} teams={teams} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
          )
        )}
        {activeTab === 'scores' && (
          leagueStatus === 'closed' ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                ต้องเปิดลีกก่อนเพื่อใส่ผลการแข่งขัน
              </p>
              <button
                onClick={() => {
                  setLeagueStatus('open');
                  localStorage.setItem('leagueStatus', 'open');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                เปิดลีก
              </button>
            </div>
          ) : (
            <ScoresManager matches={matches} setMatches={setMatches} teams={teams} />
          )
        )}
      </main>
        </>
      )}
    </div>
  );
}

// Season Manager Component  
function SeasonManager({ teams, matches, setTeams, setMatches, leagueStatus, setLeagueStatus }: { 
  teams: Team[]; 
  matches: Match[]; 
  setTeams: (teams: Team[]) => void;
  setMatches: (matches: Match[]) => void;
  leagueStatus: 'closed' | 'open';
  setLeagueStatus: (status: 'closed' | 'open') => void;
}) {
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const savedSeasons = localStorage.getItem('seasonHistory');
    if (savedSeasons) {
      setSeasons(JSON.parse(savedSeasons));
    }
  }, []);

  // คำนวณตารางคะแนน
  const calculateStandings = (baseTeams: Team[], finishedMatches: Match[]) => {
    const teamsMap = new Map<string, Team>();
    baseTeams.forEach(team => {
      teamsMap.set(team.id, {
        ...team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });

    finishedMatches.forEach(match => {
      if (match.status !== 'finished' || match.homeScore === undefined || match.awayScore === undefined) {
        return;
      }

      const homeTeam = teamsMap.get(match.homeTeam);
      const awayTeam = teamsMap.get(match.awayTeam);
      if (!homeTeam || !awayTeam) return;

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
    });

    return Array.from(teamsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  };

  const handleCloseSeason = async () => {
    if (teams.length === 0) {
      alert('ไม่มีทีมในลีก');
      return;
    }

    const finishedMatches = matches.filter(m => m.status === 'finished');
    if (finishedMatches.length === 0) {
      alert('ยังไม่มีการแข่งขันที่จบแล้ว');
      return;
    }

    if (!confirm('คุณต้องการปิดลีกและบันทึกเป็นประวัติหรือไม่?\n\nข้อมูลลีกปัจจุบันจะถูกบันทึก และระบบจะรีเซ็ตเพื่อเริ่มลีกใหม่')) {
      return;
    }

    // คำนวณตารางคะแนนสุดท้าย
    const standings = calculateStandings(teams, matches);

    // ดึงข้อมูล event settings
    const eventSettingsStr = localStorage.getItem('eventSettings');
    const eventSettings = eventSettingsStr ? JSON.parse(eventSettingsStr) : null;

    // สร้าง Season object
    const newSeason: Season = {
      id: Date.now().toString(),
      name: eventSettings?.eventName || 'Brotherhood FC',
      eventDate: eventSettings?.eventDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      status: 'closed',
      teams: JSON.parse(JSON.stringify(teams)),
      matches: JSON.parse(JSON.stringify(matches)),
      standings: standings,
    };

    // บันทึกลง seasonHistory
    const updatedSeasons = [newSeason, ...seasons];
    localStorage.setItem('seasonHistory', JSON.stringify(updatedSeasons));
    setSeasons(updatedSeasons);

    // รีเซ็ตข้อมูลปัจจุบัน - ลบแมตช์ทั้งหมดจาก Supabase
    try {
      const currentMatches = await matchesDb.getAll();
      for (const match of currentMatches) {
        await matchesDb.delete(match.id);
      }
      setMatches([]);
    } catch (error) {
      console.error('Error clearing matches:', error);
    }

    // ปิดลีก
    setLeagueStatus('closed');
    localStorage.setItem('leagueStatus', 'closed');

    alert('ปิดลีกและบันทึกประวัติเรียบร้อย!\n\nสามารถเริ่มลีกใหม่ได้เลย');
    
    // ส่งสัญญาณให้หน้าอื่นอัพเดท
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  const handleReopenSeason = async (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;

    if (!confirm(`คุณต้องการเปิดลีก "${season.name}" เพื่อแก้ไขหรือไม่?\n\nข้อมูลลีกปัจจุบัน (ถ้ามี) จะถูกลบ`)) {
      return;
    }

    try {
      // ลบข้อมูลเดิมใน Supabase
      const currentTeams = await teamsDb.getAll();
      const currentMatches = await matchesDb.getAll();
      
      for (const team of currentTeams) {
        await teamsDb.delete(team.id);
      }
      
      for (const match of currentMatches) {
        await matchesDb.delete(match.id);
      }

      // เพิ่มข้อมูลจาก season กลับเข้าไปใน Supabase
      for (const team of season.teams) {
        await teamsDb.create(team);
      }
      
      for (const match of season.matches) {
        await matchesDb.create(match);
      }

      // อัพเดท state
      setTeams(season.teams);
      setMatches(season.matches);

      // เปิดลีกอัตโนมัติ
      setLeagueStatus('open');
      localStorage.setItem('leagueStatus', 'open');

      // ลบ season นี้ออกจากประวัติ
      const updatedSeasons = seasons.filter(s => s.id !== seasonId);
      localStorage.setItem('seasonHistory', JSON.stringify(updatedSeasons));
      setSeasons(updatedSeasons);

      alert('เปิดลีกเรียบร้อย! สามารถแก้ไขข้อมูลได้แล้ว');
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
    } catch (error) {
      console.error('Error reopening season:', error);
      alert('เกิดข้อผิดพลาดในการเปิดลีก: ' + (error as Error).message);
    }
  };

  const handleDeleteSeason = (seasonId: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบประวัติลีกนี้?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
      return;
    }

    const updatedSeasons = seasons.filter(s => s.id !== seasonId);
    localStorage.setItem('seasonHistory', JSON.stringify(updatedSeasons));
    setSeasons(updatedSeasons);
    alert('ลบประวัติลีกเรียบร้อย');
  };

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          จัดการลีก
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          ปิดลีกเพื่อบันทึกประวัติ หรือเปิดลีกเก่าเพื่อแก้ไข
        </p>
      </div>

      {/* Close Current Season Button */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 mb-6 border-2 border-orange-300 dark:border-orange-700">
        <div className="flex items-start gap-4">
          <Archive className="w-8 h-8 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              ปิดลีกปัจจุบัน
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              บันทึกผลการแข่งขันปัจจุบันเป็นประวัติ และเริ่มลีกใหม่<br />
              <span className="text-xs text-orange-600 dark:text-orange-400">
                ⚠️ ทีมจะยังคงอยู่ แต่ตารางแข่งขันจะถูกเคลียร์
              </span>
            </p>
            <button
              onClick={handleCloseSeason}
              disabled={leagueStatus === 'closed'}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                leagueStatus === 'closed'
                  ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <Archive className="w-5 h-5" />
              ปิดลีกและบันทึกประวัติ
            </button>
            {leagueStatus === 'closed' && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                ต้องเปิดลีกก่อนเพื่อปิดลีก
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Season History */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
          ประวัติลีกที่ปิดแล้ว ({seasons.length})
        </h3>

        {seasons.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              ยังไม่มีประวัติลีก
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {seasons.map((season) => {
              const champion = season.standings[0];
              return (
                <div
                  key={season.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                          {season.name}
                        </h4>
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 rounded">
                          {formatThaiDate(season.eventDate)}
                        </span>
                      </div>

                      {champion && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 px-3 py-2 rounded-lg">
                          <Trophy className="w-4 h-4 text-yellow-700 dark:text-yellow-400" />
                          <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                            {champion.name}
                          </span>
                          <span className="text-xs text-yellow-700 dark:text-yellow-500">
                            {champion.points} คะแนน
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReopenSeason(season.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        title="เปิดเพื่อแก้ไข"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">เปิดแก้ไข</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSeason(season.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">ทีม</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{season.teams.length}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">แมตช์</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{season.matches.length}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">แข่งเสร็จ</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {season.matches.filter(m => m.status === 'finished').length}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Event Manager Component
function EventManager() {
  const [eventDate, setEventDate] = useState('2024-12-07');
  const [eventName, setEventName] = useState('Brotherhood FC');
  const [location, setLocation] = useState('สนามกีฬา');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // บันทึกข้อมูลลง localStorage
    const eventSettings = {
      eventDate,
      eventName,
      location,
    };
    localStorage.setItem('eventSettings', JSON.stringify(eventSettings));
    setSaved(true);
    alert('บันทึกข้อมูลสำเร็จ!');
    
    // รีโหลดหน้าเพื่ออัพเดทข้อมูล
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem('eventSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setEventDate(settings.eventDate || '2024-12-07');
      setEventName(settings.eventName || 'Brotherhood FC');
      setLocation(settings.location || 'สนามกีฬา');
    }
  }, []);

  // แปลงวันที่เป็นภาษาไทย
  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    
    return `${day} ${month} ${year}`;
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          ตั้งค่าวันที่การแข่งขัน
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          กำหนดวันที่และรายละเอียดการแข่งขัน
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-4 sm:space-y-6">
          {/* ชื่อการแข่งขัน */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              ชื่อการแข่งขัน
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="เช่น Brotherhood FC"
            />
          </div>

          {/* วันที่แข่งขัน */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              วันที่จัดการแข่งขัน
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            {eventDate && (
              <p className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                แสดงเป็น: {formatThaiDate(eventDate)}
              </p>
            )}
          </div>

          {/* สถานที่ */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              สถานที่จัด (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="เช่น สนามกีฬา"
            />
          </div>

          {/* ปุ่มบันทึก */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>

      {/* ตัวอย่างการแสดงผล */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
          ตัวอย่างการแสดงผลในหน้าหลัก:
        </h3>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg">
          <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            ตารางคะแนน
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {eventName}
            </p>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {formatThaiDate(eventDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Teams Manager Component
function TeamsManager({ teams, setTeams }: { teams: Team[]; setTeams: (teams: Team[]) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('Shield');

  // ไอคอนที่ใช้ได้สำหรับทีม
  const availableIcons = [
    { name: 'Shield', icon: Shield, color: 'text-blue-600' },
    { name: 'Zap', icon: Zap, color: 'text-yellow-500' },
    { name: 'Star', icon: Star, color: 'text-orange-500' },
    { name: 'Circle', icon: Circle, color: 'text-green-500' },
    { name: 'Square', icon: Square, color: 'text-red-500' },
    { name: 'Triangle', icon: Triangle, color: 'text-purple-500' },
    { name: 'Heart', icon: Heart, color: 'text-pink-500' },
    { name: 'Crown', icon: Crown, color: 'text-yellow-600' },
    { name: 'Flag', icon: Flag, color: 'text-indigo-500' },
    { name: 'Gem', icon: Gem, color: 'text-cyan-500' },
    { name: 'Hexagon', icon: Hexagon, color: 'text-teal-500' },
  ];

  const getTeamIcon = (iconName?: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className={`w-8 h-8 ${iconData.color}`} />;
    }
    return <Shield className="w-8 h-8 text-blue-600" />;
  };

  const saveTeamsToStorage = async (updatedTeams: Team[]) => {
    setTeams(updatedTeams);
    // ส่งสัญญาณให้หน้าอื่นอัพเดท (ไม่ใช้ localStorage อีกต่อไป)
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;

    try {
      const newTeam = await teamsDb.create({
        name: newTeamName,
        logo: newTeamLogo,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });

      console.log('Created team:', newTeam);
      
      // โหลดข้อมูลใหม่จาก Supabase 
      const freshTeams = await teamsDb.getAll();
      setTeams(freshTeams);
      
      setNewTeamName('');
      setNewTeamLogo('Shield');
      setIsAdding(false);
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
    } catch (error) {
      console.error('Error adding team:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มทีม: ' + (error as Error).message);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (confirm('คุณแน่ใจว่าต้องการลบทีมนี้?')) {
      try {
        await teamsDb.delete(id);
        
        // โหลดข้อมูลใหม่จาก Supabase
        const freshTeams = await teamsDb.getAll();
        setTeams(freshTeams);
        
        // ส่งสัญญาณให้หน้าอื่นอัพเดท
        window.dispatchEvent(new Event('localStorageUpdated'));
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('เกิดข้อผิดพลาดในการลบทีม: ' + (error as Error).message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          จัดการทีม ({teams.length} ทีม)
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มทีม</span>
        </button>
      </div>

      {/* Add Team Form */}
      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg mb-6 border-2 border-green-500">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            เพิ่มทีมใหม่
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                ชื่อทีม
              </label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="กรอกชื่อทีม"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                ไอคอนทีม
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map((iconOption) => {
                  const IconComponent = iconOption.icon;
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      onClick={() => setNewTeamLogo(iconOption.name)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                        newTeamLogo === iconOption.name
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-zinc-300 dark:border-zinc-600 hover:border-green-300 dark:hover:border-green-600'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${iconOption.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddTeam}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <div
            key={team.id}
            className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTeamIcon(team.logo)}
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {team.points} คะแนน
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="ลบทีม"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Matches Manager Component
function MatchesManager({ matches, setMatches, teams, isGenerating, setIsGenerating }: { 
  matches: Match[]; 
  setMatches: (matches: Match[]) => void; 
  teams: Team[];
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('สนาม 1');
  const [round, setRound] = useState(1);

  // ไอคอนที่ใช้ได้สำหรับทีม
  const availableIcons = [
    { name: 'Shield', icon: Shield, color: 'text-blue-600' },
    { name: 'Zap', icon: Zap, color: 'text-yellow-500' },
    { name: 'Star', icon: Star, color: 'text-orange-500' },
    { name: 'Circle', icon: Circle, color: 'text-green-500' },
    { name: 'Square', icon: Square, color: 'text-red-500' },
    { name: 'Triangle', icon: Triangle, color: 'text-purple-500' },
    { name: 'Heart', icon: Heart, color: 'text-pink-500' },
    { name: 'Crown', icon: Crown, color: 'text-yellow-600' },
    { name: 'Flag', icon: Flag, color: 'text-indigo-500' },
    { name: 'Gem', icon: Gem, color: 'text-cyan-500' },
    { name: 'Hexagon', icon: Hexagon, color: 'text-teal-500' },
  ];

  const getTeamIcon = (iconName?: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className={`w-5 h-5 ${iconData.color}`} />;
    }
    return <Shield className="w-5 h-5 text-blue-600" />;
  };

  const handleAddMatch = async () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      alert('กรุณาเลือกทีมที่ถูกต้อง');
      return;
    }

    const homeTeamData = teams.find(t => t.id === homeTeam);
    const awayTeamData = teams.find(t => t.id === awayTeam);

    if (!homeTeamData || !awayTeamData) return;

    try {
      const newMatch = await matchesDb.create({
        homeTeam,
        awayTeam,
        homeTeamName: homeTeamData.name,
        awayTeamName: awayTeamData.name,
        venue,
        status: 'scheduled',
        round,
      });

      console.log('Created match:', newMatch);
      
      // โหลดข้อมูลใหม่จาก Supabase
      const freshMatches = await matchesDb.getAll();
      setMatches(freshMatches);
      
      setHomeTeam('');
      setAwayTeam('');
      setRound(1);
      setIsAdding(false);
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
    } catch (error) {
      console.error('Error adding match:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มแมตช์: ' + (error as Error).message);
    }
  };

  const handleGenerateMatches = async () => {
    if (teams.length < 2) {
      alert('ต้องมีอย่างน้อย 2 ทีมเพื่อสร้างตารางแข่งขัน');
      return;
    }

    // ถามยืนยันก่อนสุ่มเสมอ
    const confirmMessage = matches.length > 0 
      ? 'คุณต้องการสุ่มตารางแข่งขันใหม่ใช่ไหม? (แมตช์เดิมจะถูกลบทั้งหมด)'
      : 'คุณต้องการสร้างตารางแข่งขันใหม่ใช่ไหม?';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // เริ่ม loading
    setIsGenerating(true);

    try {
      // เพิ่มความหน่วงเล็กน้อยให้เห็น animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ลบแมตช์เก่าทั้งหมดก่อน (ถ้ามี)
      console.log('Deleting all old matches...');
      for (const match of matches) {
        await matchesDb.delete(match.id);
      }

      // เพิ่มความหน่วงเพื่อแสดง progress
      await new Promise(resolve => setTimeout(resolve, 300));

      // สร้างแมตช์แบบ Round Robin ที่จัดการทีมไม่ซ้ำในแต่ละนัด
      const newMatches: Match[] = [];
      const teamList = teams.map(t => ({ id: t.id, name: t.name }));
      
      // คำนวณจำนวนแมทช์ต่อรอบ
      const numTeams = teamList.length;
      const matchesPerRound = Math.floor(numTeams / 2); // จำนวนแมทช์ที่เล่นได้ในแต่ละนัด
      const teamsPlayingPerRound = matchesPerRound * 2; // จำนวนทีมที่เล่นในแต่ละนัด
      const teamsRestingPerRound = numTeams - teamsPlayingPerRound; // จำนวนทีมที่นั่งดูในแต่ละนัด
      
      console.log(`=== Round Robin Tournament ===`);
      console.log(`จำนวนทีม: ${numTeams}`);
      console.log(`แมทช์ต่อรอบ: ${matchesPerRound}`);
      console.log(`ทีมที่เล่นต่อรอบ: ${teamsPlayingPerRound}`);
      console.log(`ทีมที่นั่งดูต่อรอบ: ${teamsRestingPerRound}`);
      console.log('===============================');

      // คำนวณจำนวนรอบ - สำหรับ Round Robin ทุกทีมต้องเล่นกับทุกทีม
      // สำหรับ n ทีม จะมี n-1 รอบ (เพราะแต่ละทีมต้องเล่นกับ n-1 ทีมอื่น)
      const totalRounds = numTeams - 1;

      // ใช้อัลกอริทึมเรียบง่าย: สร้างคู่แข่งขันทั้งหมด แล้วแบ่งตามรอบอย่างสมเหตุผล
      console.log('สร้างคู่แข่งขันทั้งหมดก่อน...');
      const allPairs: { home: { id: string, name: string }, away: { id: string, name: string } }[] = [];
      
      // สร้างคู่แข่งขันทั้งหมด (n*(n-1)/2 คู่)
      for (let i = 0; i < teamList.length; i++) {
        for (let j = i + 1; j < teamList.length; j++) {
          const isHomeFirst = Math.random() < 0.5;
          allPairs.push({
            home: isHomeFirst ? teamList[i] : teamList[j],
            away: isHomeFirst ? teamList[j] : teamList[i]
          });
        }
      }
      
      console.log(`สร้างคู่แข่งขันทั้งหมด: ${allPairs.length} คู่`);
      console.log(`จำนวนแมทช์ต่อรอบ: ${matchesPerRound}`);
      console.log(`จำนวนรอบที่ต้องการ: ${Math.ceil(allPairs.length / matchesPerRound)}`);
      
      // แบ่งคู่แข่งขันเป็นรอบๆ โดยให้แต่ละรอบมีจำนวนแมทช์คงที่และไม่มีทีมซ้ำ
      let currentRound = 1;
      let pairIndex = 0;
      
      while (pairIndex < allPairs.length) {
        console.log(`\n--- สร้างรอบที่ ${currentRound} ---`);
        const roundPairs: typeof allPairs = [];
        const usedTeamsInRound = new Set<string>();
        
        // เลือกคู่แข่งขันสำหรับรอบนี้ โดยทีมไม่ซ้ำ
        for (let i = pairIndex; i < allPairs.length && roundPairs.length < matchesPerRound; i++) {
          const pair = allPairs[i];
          
          // เช็คว่าทั้งสองทีมยังไม่ได้เล่นในรอบนี้
          if (!usedTeamsInRound.has(pair.home.id) && !usedTeamsInRound.has(pair.away.id)) {
            roundPairs.push(pair);
            usedTeamsInRound.add(pair.home.id);
            usedTeamsInRound.add(pair.away.id);
            
            // ย้ายคู่นี้ไปด้านหน้า
            [allPairs[pairIndex], allPairs[i]] = [allPairs[i], allPairs[pairIndex]];
            pairIndex++;
            
            console.log(`  แมทช์ ${roundPairs.length}: ${pair.home.name} vs ${pair.away.name}`);
          }
        }
        
        // ถ้าไม่มีคู่ที่เหลือให้เล่นในรอบนี้ ข้ามไปรอบต่อไป
        if (roundPairs.length === 0) {
          console.log('ไม่มีคู่แข่งขันที่เหลือ');
          break;
        }
        
        // สร้างแมทช์จากคู่ในรอบนี้
        roundPairs.forEach((pair, matchIdx) => {
          const venue = (newMatches.length % 2 === 0) ? 'สนาม 1' : 'สนาม 2';
          
          const match: Match = {
            id: `match-${Date.now()}-${currentRound}-${matchIdx}`,
            homeTeam: pair.home.id,
            awayTeam: pair.away.id,
            homeTeamName: pair.home.name,
            awayTeamName: pair.away.name,
            venue: venue,
            status: 'scheduled',
            round: currentRound,
            matchOrder: newMatches.length,
          };
          
          newMatches.push(match);
        });
        
        console.log(`รอบที่ ${currentRound}: สร้าง ${roundPairs.length} แมทช์`);
        console.log(`ทีมที่เล่น: ${Array.from(usedTeamsInRound).map(id => teamList.find(t => t.id === id)?.name).join(', ')}`);
        
        // แสดงทีมที่นั่งดู
        const restingTeams = teamList.filter(team => !usedTeamsInRound.has(team.id));
        if (restingTeams.length > 0) {
          console.log(`ทีมที่นั่งดู: ${restingTeams.map(t => t.name).join(', ')}`);
        }
        
        currentRound++;
      }

      console.log(`Creating ${newMatches.length} new matches...`);
      
      // Debug: แสดงสรุปการจัดสนามและตรวจสอบทีมซ้ำ
      const venue1Count = newMatches.filter(m => m.venue === 'สนาม 1').length;
      const venue2Count = newMatches.filter(m => m.venue === 'สนาม 2').length;
      console.log(`\n=== สรุปการจัดสนาม ===`);
      console.log(`สนาม 1: ${venue1Count} แมทช์`);
      console.log(`สนาม 2: ${venue2Count} แมทช์`);
      
      // ตรวจสอบทีมซ้ำในแต่ละนัด
      const rounds = Math.max(...newMatches.map(m => m.round || 1));
      console.log(`\n=== ตรวจสอบทีมซ้ำในแต่ละนัด ===`);
      for (let r = 1; r <= rounds; r++) {
        const roundMatches = newMatches.filter(m => m.round === r);
        const allTeamsInRound: string[] = [];
        
        roundMatches.forEach(match => {
          allTeamsInRound.push(match.homeTeamName, match.awayTeamName);
        });
        
        const uniqueTeams = new Set(allTeamsInRound);
        const hasDuplicates = allTeamsInRound.length !== uniqueTeams.size;
        
        console.log(`รอบที่ ${r}: ${roundMatches.length} แมทช์`);
        console.log(`  ทีมทั้งหมด: ${allTeamsInRound.join(', ')}`);
        console.log(`  ทีมไม่ซ้ำ: ${uniqueTeams.size}/${allTeamsInRound.length} ${hasDuplicates ? '❌ มีทีมซ้ำ!' : '✅ ไม่มีทีมซ้ำ'}`);
      }
      
      // แสดง pattern สนาม 10 แมทช์แรก
      console.log('\n=== Pattern สนาม 10 แมทช์แรก ===');
      newMatches.slice(0, 10).forEach((match, idx) => {
        console.log(`  ${idx + 1}. ${match.venue}: ${match.homeTeamName} vs ${match.awayTeamName}`);
      });
      console.log('=====================================');
      
      // สร้างแมตช์ใหม่ใน Supabase
      const createdMatches: Match[] = [];
      for (const match of newMatches) {
        const createdMatch = await matchesDb.create(match);
        createdMatches.push(createdMatch);
      }
      
      console.log('Created matches successfully:', createdMatches.length);
      
      // โหลดข้อมูลใหม่จาก Supabase
      const freshMatches = await matchesDb.getAll();
      setMatches(freshMatches);
      
      const maxRounds = Math.max(...createdMatches.map(m => m.round || 1));
      const avgMatchesPerRound = Math.ceil(createdMatches.length / maxRounds);
      alert(`สร้างตารางแข่งขันสำเร็จ! 🎲\n` +
            `ทั้งหมด ${createdMatches.length} แมตช์\n` +
            `แบ่งเป็น ${maxRounds} รอบ (เฉลี่ย ${avgMatchesPerRound} แมทช์ต่อรอบ)\n` +
            `🏟️ สนาม: 1-2-1-2-1-2... ตามลำดับแน่นอน\n` +
            `🎯 ทีม: แต่ละนัดไม่มีทีมซ้ำ (Round Robin Algorithm)\n` +
            `✅ ระบบป้องกันทีมซ้ำในแต่ละนัดแล้ว`);
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
      
    } catch (error) {
      console.error('Error generating matches:', error);
      alert('เกิดข้อผิดพลาดในการสร้างตารางแข่งขัน: ' + (error as Error).message);
    } finally {
      // หยุด loading
      setIsGenerating(false);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (confirm('คุณแน่ใจว่าต้องการลบแมตช์นี้?')) {
      try {
        await matchesDb.delete(id);
        
        // โหลดข้อมูลใหม่จาก Supabase
        const freshMatches = await matchesDb.getAll();
        setMatches(freshMatches);
        
        // ส่งสัญญาณให้หน้าอื่นอัพเดท
        window.dispatchEvent(new Event('localStorageUpdated'));
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('เกิดข้อผิดพลาดในการลบแมตช์: ' + (error as Error).message);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          จัดการแมตช์ ({matches.length} แมตช์)
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateMatches}
            disabled={isGenerating}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-2 ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>กำลังสุ่ม...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>สุ่มลีก (ลบเก่า)</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแมตช์</span>
          </button>
        </div>
      </div>

      {/* Add Match Form */}
      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg mb-6 border-2 border-green-500">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            เพิ่มแมตช์ใหม่
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                ทีมเหย้า
              </label>
              <select
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">เลือกทีมเหย้า</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                ทีมเยือน
              </label>
              <select
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">เลือกทีมเยือน</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                สนาม
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="สนาม 1">สนาม 1</option>
                <option value="สนาม 2">สนาม 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                นัด
              </label>
              <input
                type="number"
                min="1"
                value={round}
                onChange={(e) => setRound(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="เช่น 1, 2, 3..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddMatch}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-3">
        {matches.map(match => (
          <div
            key={match.id}
            className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-end mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    match.status === 'finished' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>
                    {match.status === 'finished' ? 'แข่งแล้ว' : 'ยังไม่แข่ง'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {match.homeTeamName}
                  </div>
                  <div className="text-lg font-bold text-zinc-400">VS</div>
                  <div className="flex-1 text-left font-medium text-zinc-900 dark:text-zinc-100">
                    {match.awayTeamName}
                  </div>
                </div>
                {match.venue && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {match.venue}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteMatch(match.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="ลบแมตช์"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 max-w-sm mx-4 transform animate-scaleIn shadow-2xl">
            <div className="text-center">
              <div className="relative mb-6">
                {/* Spinning Football */}
                <div className="w-20 h-20 mx-auto mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Animated dots */}
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                🎲 กำลังสุ่มการแข่งขัน...
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                กรุณารอสักครู่ ระบบกำลังจัดตารางการแข่งขันแบบลีก<br />
                <span className="text-green-600 font-medium">8 ทีม เจอกันหมด 1 ครั้ง</span>
              </p>
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Scores Manager Component
function ScoresManager({ matches, setMatches, teams }: { matches: Match[]; setMatches: (matches: Match[]) => void; teams: Team[] }) {
  const [scores, setScores] = useState<{ [key: string]: { home: string; away: string } }>({});

  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  const handleScoreChange = (matchId: string, type: 'home' | 'away', value: string) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        home: type === 'home' ? value : (prev[matchId]?.home || ''),
        away: type === 'away' ? value : (prev[matchId]?.away || ''),
      }
    }));
  };

  const handleUpdateScore = async (matchId: string) => {
    const score = scores[matchId];
    
    // ตรวจสอบว่ามีการกรอกคะแนนหรือไม่ (รับค่า 0 ได้)
    if (!score || score.home === '' || score.away === '') {
      alert('กรุณากรอกคะแนนทั้งสองทีม');
      return;
    }

    const homeScore = parseInt(score.home);
    const awayScore = parseInt(score.away);

    // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่ (รับค่า 0 ได้)
    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
      alert('กรุณากรอกคะแนนที่ถูกต้อง (ตัวเลข 0 หรือมากกว่า)');
      return;
    }

    try {
      console.log('Updating match score:', { matchId, homeScore, awayScore });
      
      const updatedMatch = await matchesDb.update(matchId, {
        homeScore: homeScore,
        awayScore: awayScore,
        status: 'finished'
      });

      console.log('Update successful:', updatedMatch);

      // โหลดข้อมูลใหม่จาก Supabase
      const freshMatches = await matchesDb.getAll();
      setMatches(freshMatches);
      
      // Remove score from state
      const newScores = { ...scores };
      delete newScores[matchId];
      setScores(newScores);
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
      
      alert('บันทึกผลการแข่งขันเรียบร้อย!');
    } catch (error) {
      console.error('Error updating score:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกผล: ' + (error as Error).message);
    }
  };

  const handleEditScore = async (match: Match) => {
    // ใส่ค่าสกอร์เดิมลงในฟอร์ม
    setScores(prev => ({
      ...prev,
      [match.id]: {
        home: match.homeScore?.toString() || '',
        away: match.awayScore?.toString() || ''
      }
    }));

    try {
      // เปลี่ยนสถานะแมตช์กลับเป็น scheduled และล้างสกอร์
      console.log('Editing match score for:', match.id);
      
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: 'scheduled',
          home_score: null,
          away_score: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', match.id);

      if (error) {
        console.error('Direct update error:', error);
        throw error;
      }

      // อัพเดท state และรีโหลดข้อมูล
      const freshMatches = await matchesDb.getAll();
      setMatches(freshMatches);
      
      // ส่งสัญญาณให้หน้าอื่นอัพเดท
      window.dispatchEvent(new Event('localStorageUpdated'));
      
      alert('เปิดให้แก้ไขผลการแข่งขันแล้ว');
    } catch (error) {
      console.error('Error editing score:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขผล: ' + error);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">
        ใส่ผลการแข่งขัน
      </h2>

      {/* All Matches for Scoring */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          รายการแมตช์ ({matches.length})
        </h3>
        
        {matches.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              ยังไม่มีแมตช์
            </p>
          </div>
        ) : (
          matches.map(match => (
            <div
              key={match.id}
              className={`bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border-2 ${
                match.status === 'finished' 
                  ? 'border-green-300 dark:border-green-700' 
                  : 'border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {/* Match Status */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  match.status === 'finished' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {match.status === 'finished' ? 'บันทึกแล้ว' : 'ยังไม่บันทึก'}
                </span>
                {match.venue && (
                  <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {match.venue}
                  </div>
                )}
              </div>

              {/* Score Input/Display */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center mb-4">
                {/* Home Team */}
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-3">
                    {match.homeTeamName}
                  </div>
                  {match.status === 'finished' && !scores[match.id] ? (
                    // แสดงผลเมื่อแมตช์จบแล้ว
                    <div className="w-full text-center text-2xl sm:text-3xl font-bold px-2 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                      {match.homeScore}
                    </div>
                  ) : (
                    // แสดงช่องกรอกเมื่อยังไม่บันทึกหรือกำลังแก้ไข
                    <input
                      type="number"
                      min="0"
                      value={scores[match.id]?.home || ''}
                      onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                      className="w-full text-center text-2xl sm:text-3xl font-bold px-2 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="0"
                    />
                  )}
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-zinc-400 dark:text-zinc-600">
                    VS
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-3">
                    {match.awayTeamName}
                  </div>
                  {match.status === 'finished' && !scores[match.id] ? (
                    // แสดงผลเมื่อแมตช์จบแล้ว
                    <div className="w-full text-center text-2xl sm:text-3xl font-bold px-2 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                      {match.awayScore}
                    </div>
                  ) : (
                    // แสดงช่องกรอกเมื่อยังไม่บันทึกหรือกำลังแก้ไข
                    <input
                      type="number"
                      min="0"
                      value={scores[match.id]?.away || ''}
                      onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                      className="w-full text-center text-2xl sm:text-3xl font-bold px-2 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="0"
                    />
                  )}
                </div>
              </div>

              {/* Action Button */}
              {match.status === 'finished' && !scores[match.id] ? (
                // แสดงปุ่มแก้ไขเมื่อแมตช์จบแล้ว
                <button
                  onClick={() => handleEditScore(match)}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  แก้ไขผล
                </button>
              ) : (
                // แสดงปุ่มบันทึกเมื่อยังไม่บันทึกหรือกำลังแก้ไข
                <button
                  onClick={() => handleUpdateScore(match.id)}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  บันทึกผล
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
