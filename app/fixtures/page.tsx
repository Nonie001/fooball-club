'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MatchCard from '@/components/MatchCard';
import { matchesDb } from '@/lib/database/operations';
import { Match } from '@/lib/types';

export default function FixturesPage() {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'finished'>('all');
  const [roundFilter, setRoundFilter] = useState<number | 'all'>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [tempScores, setTempScores] = useState<{[key: string]: {home: string, away: string}}>({});

  // โหลดข้อมูลจาก Supabase
  useEffect(() => {
    // ตรวจสอบสถานะ admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    const loadMatches = async () => {
      try {
        console.log('Loading matches from Supabase...');
        const loadedMatches = await matchesDb.getAll();
        console.log('Loaded matches:', loadedMatches);
        setMatches(loadedMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
        alert('ไม่สามารถโหลดข้อมูลแมตช์ได้: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();

    // ฟังการอัพเดทจาก admin
    const handleDataUpdate = () => {
      console.log('Data updated, reloading matches...');
      loadMatches();
    };

    window.addEventListener('localStorageUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('localStorageUpdated', handleDataUpdate);
    };
  }, []);

  // ฟังก์ชันสำหรับเริ่มแก้ไขสกอร์
  const startEditScore = (matchId: string, homeScore?: number, awayScore?: number) => {
    setEditingMatch(matchId);
    setTempScores({
      ...tempScores,
      [matchId]: {
        home: homeScore?.toString() || '',
        away: awayScore?.toString() || ''
      }
    });
  };

  // ฟังก์ชันบันทึกสกอร์
  const saveScore = async (matchId: string) => {
    const scores = tempScores[matchId];
    if (!scores || scores.home === '' || scores.away === '') return;

    try {
      const homeScore = parseInt(scores.home);
      const awayScore = parseInt(scores.away);
      
      if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
        alert('กรุณาใส่คะแนนที่ถูกต้อง (ตัวเลขที่มากกว่าหรือเท่ากับ 0)');
        return;
      }

      await matchesDb.update(matchId, {
        homeScore,
        awayScore,
        status: 'finished' as const
      });

      // อัพเดทข้อมูลในหน้า
      const updatedMatches = await matchesDb.getAll();
      setMatches(updatedMatches);
      
      // ล้างการแก้ไข
      setEditingMatch(null);
      const newTempScores = { ...tempScores };
      delete newTempScores[matchId];
      setTempScores(newTempScores);

    } catch (error) {
      console.error('Error saving score:', error);
      alert('ไม่สามารถบันทึกผลการแข่งขันได้');
    }
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const cancelEdit = (matchId: string) => {
    setEditingMatch(null);
    const newTempScores = { ...tempScores };
    delete newTempScores[matchId];
    setTempScores(newTempScores);
  };

  // หาจำนวนนัดทั้งหมด
  const totalRounds = matches.length > 0 ? Math.max(...matches.map(m => m.round || 1)) : 0;
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  const filteredMatches = matches.filter(match => {
    // กรองตามสถานะ
    if (filter !== 'all' && match.status !== filter) return false;
    
    // กรองตามนัด
    if (roundFilter !== 'all' && match.round !== roundFilter) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <Navigation activePage="fixtures" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-600 dark:text-zinc-400">กำลังโหลดตารางการแข่งขัน...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {/* Navigation */}
      <Navigation activePage="fixtures" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              ตารางการแข่งขัน
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              กำหนดการแข่งขัน Brotherhood FC
            </p>
          </div>
          {isAdmin && (
            <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              โหมด Admin
            </div>
          )}
        </div>

        {/* Statistics Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {matches.length}
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                แมทช์ทั้งหมด
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {matches.filter(m => m.status === 'finished').length}
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                จบแล้ว
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {matches.filter(m => m.status === 'scheduled').length}
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                ที่จะแข่ง
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalRounds}
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                นัดทั้งหมด
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {matches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">ความคืบหน้า</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {Math.round((matches.filter(m => m.status === 'finished').length / matches.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(matches.filter(m => m.status === 'finished').length / matches.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="space-y-4 mb-6 sm:mb-8">
          {/* สถานะการแข่งขัน */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              สถานะ
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                ทั้งหมด ({matches.length})
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  filter === 'scheduled'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                ที่จะแข่ง ({matches.filter(m => m.status === 'scheduled').length})
              </button>
              <button
                onClick={() => setFilter('finished')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  filter === 'finished'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                แข่งแล้ว ({matches.filter(m => m.status === 'finished').length})
              </button>
            </div>
          </div>

          {/* นัดการแข่งขัน */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              นัด
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRoundFilter('all')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  roundFilter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                ทุกนัด
              </button>
              {rounds.map(round => {
                const roundMatches = matches.filter(m => m.round === round);
                const finishedRoundMatches = roundMatches.filter(m => m.status === 'finished');
                
                return (
                  <button
                    key={round}
                    onClick={() => setRoundFilter(round)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                      roundFilter === round
                        ? 'bg-green-600 text-white'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                    title={`นัดที่ ${round}: ${roundMatches.length} แมทช์ (จบแล้ว ${finishedRoundMatches.length})`}
                  >
                    <div className="flex flex-col items-center">
                      <span>นัดที่ {round}</span>
                      <span className="text-xs opacity-75">
                        {finishedRoundMatches.length}/{roundMatches.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Matches Display */}
        {matches.length > 0 ? (
          roundFilter === 'all' ? (
            // แสดงทุกนัด - แบ่งตามนัด
            <div className="space-y-8">
              {rounds.map(round => {
                const roundMatches = matches.filter(m => m.round === round && 
                  (filter === 'all' || m.status === filter));
                
                if (roundMatches.length === 0) return null;
                
                return (
                  <div key={round} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        นัดที่ {round}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {roundMatches.length} แมทช์ • {roundMatches.filter(m => m.status === 'finished').length} จบแล้ว
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roundMatches.map(match => (
                          <MatchCard 
                            key={match.id} 
                            match={match}
                            isAdmin={isAdmin}
                            isEditing={editingMatch === match.id}
                            tempScores={tempScores[match.id]}
                            onEditScore={startEditScore}
                            onSaveScore={saveScore}
                            onCancelEdit={cancelEdit}
                            onScoreChange={(matchId, type, value) => {
                              setTempScores({
                                ...tempScores,
                                [matchId]: {
                                  ...tempScores[matchId],
                                  [type]: value
                                }
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // แสดงเฉพาะนัดที่เลือก
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  นัดที่ {roundFilter}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {filteredMatches.length} แมทช์ • {filteredMatches.filter(m => m.status === 'finished').length} จบแล้ว
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMatches.map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match}
                      isAdmin={isAdmin}
                      isEditing={editingMatch === match.id}
                      tempScores={tempScores[match.id]}
                      onEditScore={startEditScore}
                      onSaveScore={saveScore}
                      onCancelEdit={cancelEdit}
                      onScoreChange={(matchId, type, value) => {
                        setTempScores({
                          ...tempScores,
                          [matchId]: {
                            ...tempScores[matchId],
                            [type]: value
                          }
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">
              ยังไม่มีการแข่งขัน
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
              กรุณาไปที่ Admin Dashboard เพื่อสร้างตารางการแข่งขัน
            </p>
            <a 
              href="/admin/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              ไปยัง Admin
            </a>
          </div>
        )}

        {filteredMatches.length === 0 && matches.length > 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              ไม่พบการแข่งขันตามเงื่อนไขที่เลือก
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              ลองเปลี่ยนตัวกรองเพื่อดูแมตช์อื่น
            </p>
          </div>
        )}

        {/* Debug Info - เฉพาะ development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              Debug Info:
            </h3>
            <pre className="text-xs text-yellow-700 dark:text-yellow-400">
              Total Matches: {matches.length}{'\n'}
              Filtered Matches: {filteredMatches.length}{'\n'}
              Filter: {filter}{'\n'}
              Round Filter: {roundFilter}{'\n'}
              Total Rounds: {totalRounds}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}