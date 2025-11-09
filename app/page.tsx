'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import StandingsTable from "@/components/StandingsTable";
import MatchCard from "@/components/MatchCard";
import { teamsDb, matchesDb } from "@/lib/database/operations";
import { Team, Match } from "@/lib/types";

export default function Home() {
  const [eventName, setEventName] = useState('Brotherhood FC');
  const [eventDate, setEventDate] = useState('2024-12-07');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [calculatedTeams, setCalculatedTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // คำนวณตารางคะแนนจากผลการแข่งขัน
  const calculateStandings = (baseTeams: Team[], finishedMatches: Match[]) => {
    // Reset stats
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

    // คำนวณจากผลแมตช์ที่จบแล้ว
    finishedMatches.forEach(match => {
      if (match.status !== 'finished' || match.homeScore === undefined || match.awayScore === undefined) {
        return;
      }

      const homeTeam = teamsMap.get(match.homeTeam);
      const awayTeam = teamsMap.get(match.awayTeam);

      if (!homeTeam || !awayTeam) return;

      // อัพเดทสถิติ
      homeTeam.played++;
      awayTeam.played++;

      homeTeam.goalsFor += match.homeScore;
      homeTeam.goalsAgainst += match.awayScore;
      awayTeam.goalsFor += match.awayScore;
      awayTeam.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        // ทีมเหย้าชนะ
        homeTeam.won++;
        homeTeam.points += 3;
        awayTeam.lost++;
      } else if (match.homeScore < match.awayScore) {
        // ทีมเยือนชนะ
        awayTeam.won++;
        awayTeam.points += 3;
        homeTeam.lost++;
      } else {
        // เสมอ
        homeTeam.drawn++;
        awayTeam.drawn++;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }

      homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
      awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
    });

    return Array.from(teamsMap.values());
  };

  // ฟังก์ชันโหลดข้อมูล
  const loadData = async () => {
    try {
      setLoading(true);
      
      // โหลด event settings จาก localStorage
      const savedEvent = localStorage.getItem('eventSettings');
      if (savedEvent) {
        const settings = JSON.parse(savedEvent);
        setEventName(settings.eventName || 'Brotherhood FC');
        setEventDate(settings.eventDate || '2024-12-07');
      }

      // โหลดข้อมูลจาก Supabase
      const [loadedTeams, loadedMatches] = await Promise.all([
        teamsDb.getAll(),
        matchesDb.getAll()
      ]);
      
      setTeams(loadedTeams);
      setMatches(loadedMatches);

      // คำนวณตารางคะแนน
      const standings = calculateStandings(loadedTeams, loadedMatches);
      setCalculatedTeams(standings);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // ถ้า error ให้ fallback เป็น array ว่าง
      setTeams([]);
      setMatches([]);
      setCalculatedTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลจาก Supabase
  useEffect(() => {
    loadData();

    // ฟังเหตุการณ์ที่กำหนดเอง (สำหรับการอัพเดทในแท็บเดียวกัน)
    const handleCustomUpdate = () => {
      loadData();
    };

    window.addEventListener('localStorageUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('localStorageUpdated', handleCustomUpdate);
    };
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

  // Get upcoming matches
  const upcomingMatches = matches
    .filter((m: Match) => m.status === 'scheduled')
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <Navigation activePage="home" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white mb-1 sm:mb-2">
            ตารางคะแนน
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400">
              {eventName}
            </p>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <p className="text-xs sm:text-sm lg:text-base text-blue-600 dark:text-blue-400 font-medium">
              {formatThaiDate(eventDate)}
            </p>
          </div>
        </div>

        {/* Standings Table Card */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <StandingsTable teams={calculatedTeams} />
          </div>
        </div>

        {/* Upcoming Matches Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white">
                คู่ต่อไป
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                แมตช์ที่กำลังจะแข่งขัน
              </p>
            </div>
            <Link 
              href="/fixtures"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <span>ดูทั้งหมด</span>
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
          
          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {upcomingMatches.map((match: Match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 sm:p-12 text-center border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                ไม่มีแมตช์ที่กำลังจะแข่งขัน
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 lg:mt-16 py-6 sm:py-8 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Brotherhood FC
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
            สร้างโดยบังนัทโกล NO.1
          </p>
        </div>
      </footer>
    </div>
  );
}
