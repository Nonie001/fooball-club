import { Match } from '@/lib/types';
import { MapPin, Edit, Save, X } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  isAdmin?: boolean;
  isEditing?: boolean;
  tempScores?: {home: string, away: string};
  onEditScore?: (matchId: string, homeScore?: number, awayScore?: number) => void;
  onSaveScore?: (matchId: string) => void;
  onCancelEdit?: (matchId: string) => void;
  onScoreChange?: (matchId: string, type: 'home' | 'away', value: string) => void;
}

export default function MatchCard({ 
  match, 
  isAdmin = false, 
  isEditing = false, 
  tempScores,
  onEditScore,
  onSaveScore,
  onCancelEdit,
  onScoreChange
}: MatchCardProps) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 border border-zinc-200 dark:border-zinc-700">
      {/* Header: Status */}
      <div className="flex items-center justify-end mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
              </span>
              LIVE
            </span>
          )}
          {match.round && (
            <span className="text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
              นัดที่ {match.round}
            </span>
          )}
        </div>
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex-1 text-right pr-2 sm:pr-0">
          <div className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 break-words">
            {match.homeTeamName}
          </div>
        </div>

        {/* Score or VS */}
        <div className="px-3 sm:px-6 flex items-center justify-center">
          {isEditing ? (
            // โหมดแก้ไขสกอร์
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="99"
                value={tempScores?.home || ''}
                onChange={(e) => onScoreChange?.(match.id, 'home', e.target.value)}
                className="w-16 text-center text-xl font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md p-1"
                placeholder="0"
              />
              <span className="text-xl text-zinc-400">-</span>
              <input
                type="number"
                min="0"
                max="99"
                value={tempScores?.away || ''}
                onChange={(e) => onScoreChange?.(match.id, 'away', e.target.value)}
                className="w-16 text-center text-xl font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md p-1"
                placeholder="0"
              />
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onSaveScore?.(match.id)}
                  className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                  title="บันทึก"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCancelEdit?.(match.id)}
                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                  title="ยกเลิก"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isFinished || isLive ? (
            // แสดงสกอร์ปกติ
            <div className="flex items-center gap-2 sm:gap-4 relative group">
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {match.homeScore}
              </span>
              <span className="text-base sm:text-xl text-zinc-400 dark:text-zinc-600">-</span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {match.awayScore}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onEditScore?.(match.id, match.homeScore, match.awayScore)}
                  className="absolute -right-8 opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-opacity"
                  title="แก้ไขผลการแข่งขัน"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            // แสดง VS และปุ่มใส่สกอร์สำหรับ admin
            <div className="bg-zinc-100 dark:bg-zinc-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg relative group">
              <span className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                VS
              </span>
              {isAdmin && (
                <button
                  onClick={() => onEditScore?.(match.id)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-600/90 text-white text-xs font-semibold rounded-lg transition-opacity"
                  title="ใส่ผลการแข่งขัน"
                >
                  ใส่สกอร์
                </button>
              )}
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 text-left pl-2 sm:pl-0">
          <div className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 break-words">
            {match.awayTeamName}
          </div>
        </div>
      </div>

      {/* Footer: Venue */}
      {match.venue && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{match.venue}</span>
          </div>
        </div>
      )}
    </div>
  );
}
