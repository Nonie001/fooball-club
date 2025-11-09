import { Team } from '@/lib/types';
import { sortTeamsByStanding } from '@/lib/utils';
import { Trophy, Medal, Award, Shield, Zap, Star, Circle, Square, Triangle, Heart, Crown, Flag, Gem, Hexagon } from 'lucide-react';

interface StandingsTableProps {
  teams: Team[];
}

export default function StandingsTable({ teams }: StandingsTableProps) {
  const sortedTeams = sortTeamsByStanding(teams);

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

  const getTeamIcon = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    if (iconData) {
      const IconComponent = iconData.icon;
      return <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${iconData.color}`} />;
    }
    return <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs lg:text-sm font-semibold sticky left-0 bg-blue-600 z-10">อันดับ</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs lg:text-sm font-semibold sticky left-8 sm:left-10 lg:left-12 bg-blue-600 z-10 min-w-[120px] sm:min-w-[140px]">ทีม</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">แข่ง</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">ชนะ</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">เสมอ</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">แพ้</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">ได้</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">เสีย</th>
              <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">+/-</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs lg:text-sm font-semibold bg-blue-700 sticky right-0 z-10 whitespace-nowrap">คะแนน</th>
            </tr>
          </thead>
        <tbody>
          {sortedTeams.map((team, index) => {
            const position = index + 1;
            let positionColorClass = '';
            let PositionIcon = null;
            
            // Top 3 get special colors and icons
            if (position === 1) {
              positionColorClass = 'bg-yellow-50 dark:bg-yellow-900/20 border-l-2 sm:border-l-4 border-yellow-500';
              PositionIcon = Trophy;
            } else if (position === 2) {
              positionColorClass = 'bg-gray-50 dark:bg-gray-800/50 border-l-2 sm:border-l-4 border-gray-400';
              PositionIcon = Medal;
            } else if (position === 3) {
              positionColorClass = 'bg-orange-50 dark:bg-orange-900/20 border-l-2 sm:border-l-4 border-orange-600';
              PositionIcon = Award;
            }

            return (
              <tr
                key={team.id}
                className={`border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${positionColorClass}`}
              >
                <td className="px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 text-center font-bold text-zinc-900 dark:text-zinc-100 sticky left-0 bg-inherit z-10">
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    {PositionIcon && <PositionIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />}
                    <span className="text-xs sm:text-sm lg:text-base">{position}</span>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 sticky left-8 sm:left-10 lg:left-12 bg-inherit z-10">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="flex-shrink-0">
                      {getTeamIcon(team.logo || 'Shield')}
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] sm:text-sm lg:text-base">
                      {team.name}
                    </span>
                  </div>
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm lg:text-base">
                  {team.played}
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm lg:text-base">
                  {team.won}
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-yellow-600 dark:text-yellow-400 font-medium text-xs sm:text-sm lg:text-base">
                  {team.drawn}
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm lg:text-base">
                  {team.lost}
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm lg:text-base">
                  {team.goalsFor}
                </td>
                <td className="px-1 sm:px-2 py-2.5 sm:py-3 text-center text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm lg:text-base">
                  {team.goalsAgainst}
                </td>
                <td className={`px-1 sm:px-2 py-2.5 sm:py-3 text-center font-medium text-xs sm:text-sm lg:text-base ${
                  team.goalDifference > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : team.goalDifference < 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}>
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 text-center font-bold text-sm sm:text-base lg:text-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 sticky right-0 z-10 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">
                  {team.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
