import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Camera,
  Layers,
  CheckCircle2,
  Circle,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  Sparkles,
  ExternalLink,
  Printer,
  Edit3,
  Award,
} from 'lucide-react';
import {
  TeacherTimetableConfig,
  WeeklyScheduledPeriod,
  PpctDataset,
  TimeframeConfig,
} from '../../types';
import {
  generateWeeklySchedule,
  getTodayLessons,
  getWeekDates,
} from '../../utils/timetableScheduler';
import { TimetableUploadModal } from './TimetableUploadModal';
import { getDayOfWeekVN, formatDateVN } from '../../utils/dateCalculations';

interface WeeklyTimetableSectionProps {
  currentConfig: TeacherTimetableConfig;
  onUpdateConfig: (newConfig: TeacherTimetableConfig) => void;
  datasets: PpctDataset[];
  timeframeConfig: TimeframeConfig;
  currentWeek: number;
  term: 1 | 2;
}

export const WeeklyTimetableSection: React.FC<WeeklyTimetableSectionProps> = ({
  currentConfig,
  onUpdateConfig,
  datasets,
  timeframeConfig,
  currentWeek,
  term,
}) => {
  // Navigation week for viewing schedule (defaults to currentWeek or 1)
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    return currentWeek > 0 && currentWeek <= 35 ? currentWeek : 1;
  });

  // Modal upload / edit
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Filter by class or grade ('all' or '9A1', '7A1', '9', '7'...)
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // View mode: 'grid' (Ma trận TKB) or 'table' (Lịch báo giảng chi tiết)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selected period detail modal
  const [detailPeriod, setDetailPeriod] = useState<WeeklyScheduledPeriod | null>(null);

  // Today date string (from timeframe config or real Date)
  const todayDateStr = timeframeConfig.currentDate || new Date().toISOString().split('T')[0];

  // Calculate schedule for the selected week
  const weeklySchedule = useMemo(() => {
    return generateWeeklySchedule(
      currentConfig,
      datasets,
      selectedWeek,
      currentConfig.appliedDate || timeframeConfig.startDateWeek1 || '2026-09-07'
    );
  }, [currentConfig, datasets, selectedWeek, timeframeConfig.startDateWeek1]);

  // Distinct classes in the timetable
  const distinctClasses = useMemo(() => {
    const set = new Set<string>();
    currentConfig.slots.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set).sort();
  }, [currentConfig.slots]);

  // Filtered periods
  const filteredSchedule = useMemo(() => {
    if (selectedFilter === 'all') return weeklySchedule;
    if (['6', '7', '8', '9'].includes(selectedFilter)) {
      return weeklySchedule.filter((p) => p.grade === selectedFilter);
    }
    return weeklySchedule.filter((p) => p.className === selectedFilter);
  }, [weeklySchedule, selectedFilter]);

  // Today lessons
  const todayLessons = useMemo(() => {
    return getTodayLessons(weeklySchedule, todayDateStr);
  }, [weeklySchedule, todayDateStr]);

  // Week dates info (Monday to Saturday)
  const weekDays = useMemo(() => {
    return getWeekDates(
      currentConfig.appliedDate || timeframeConfig.startDateWeek1 || '2026-09-07',
      selectedWeek
    );
  }, [currentConfig.appliedDate, timeframeConfig.startDateWeek1, selectedWeek]);

  // Toggle lesson completed status
  const handleToggleCompleted = (className: string, tietPpctNumber: number) => {
    const key = `${className}_tiet_${tietPpctNumber}`;
    const currentStatus = !!currentConfig.completedLessons?.[key];
    const updatedLessons = {
      ...(currentConfig.completedLessons || {}),
      [key]: !currentStatus,
    };

    onUpdateConfig({
      ...currentConfig,
      completedLessons: updatedLessons,
    });
  };

  // Build grid map: [period 1..5][dayOfWeek 2..7] -> WeeklyScheduledPeriod[]
  const gridMatrix = useMemo(() => {
    const matrix: Record<number, Record<number, WeeklyScheduledPeriod[]>> = {
      1: { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
      2: { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
      3: { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
      4: { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
      5: { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
    };

    filteredSchedule.forEach((periodItem) => {
      const p = periodItem.period;
      const dow = periodItem.dayOfWeek;
      if (matrix[p] && matrix[p][dow]) {
        matrix[p][dow].push(periodItem);
      }
    });

    return matrix;
  }, [filteredSchedule]);

  const periodsTimetable = [
    { period: 1, time: '07:00 - 07:45' },
    { period: 2, time: '07:50 - 08:35' },
    { period: 3, time: '08:50 - 09:35' },
    { period: 4, time: '09:40 - 10:25' },
    { period: 5, time: '10:30 - 11:15' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Thời khóa biểu môn Toán & Lịch giảng dạy chi tiết theo PPCT
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Áp dụng từ 07/09/2026 (Tuần 1)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Căn cứ thời gian thực • Tự động xếp trực tiếp nội dung bài học PPCT vào từng tiết dạy trong tuần
              {currentConfig.teacherName ? ` • GV: ${currentConfig.teacherName}` : ''}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>+ Chụp ảnh / Tải lên ảnh TKB</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Tùy chỉnh phân công tiết"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chỉnh sửa TKB</span>
          </button>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ma trận TKB
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch báo giảng
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Indicator & Week Navigation */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Real-time Today Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Thời gian thực hôm nay:</span>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                {todayDateStr === '2026-09-08'
                  ? 'Thứ Ba, ngày 08/09/2026 (Tuần 1)'
                  : `${todayDateStr}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {todayLessons.length > 0
                ? `Hôm nay Thầy/Cô có ${todayLessons.length} tiết giảng dạy môn Toán.`
                : 'Hôm nay không có tiết dạy theo thời khóa biểu.'}
            </p>
          </div>
        </div>

        {/* Week Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
            disabled={selectedWeek <= 1}
            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg text-slate-700 transition-colors"
            title="Tuần trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              Đang xem: Tuần {selectedWeek}{' '}
              {selectedWeek <= 18 ? '(Học kỳ I)' : '(Học kỳ II)'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedWeek((w) => Math.min(35, w + 1))}
            disabled={selectedWeek >= 35}
            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg text-slate-700 transition-colors"
            title="Tuần sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {selectedWeek !== currentWeek && (
            <button
              type="button"
              onClick={() => setSelectedWeek(currentWeek > 0 ? currentWeek : 1)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline px-2"
            >
              Về tuần hiện tại (Tuần {currentWeek})
            </button>
          )}
        </div>
      </div>

      {/* TODAY'S LESSONS HIGHLIGHT CARD (If viewing week that matches today or has today lessons) */}
      {todayLessons.length > 0 && selectedWeek === currentWeek && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <span>Nội dung giảng dạy hôm nay</span>
                <span className="text-xs font-normal normal-case text-emerald-800">
                  (Thứ Ba, 08/09/2026 • {todayLessons.length} tiết)
                </span>
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
              Tuần 1 chuẩn PPCT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayLessons.map((item) => (
              <div
                key={item.slotId}
                className="bg-white border border-emerald-200/80 rounded-xl p-3.5 shadow-xs flex items-start justify-between gap-3 hover:border-emerald-400 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-bold">
                      Tiết {item.period} ({item.session === 'sang' ? 'Sáng' : 'Chiều'})
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-200 rounded text-[11px] font-bold">
                      Lớp {item.className}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Tiết {item.tietPpctNumber} PPCT
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                    {item.baiHoc}
                  </h4>

                  {item.chuong && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.chuong}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCompleted(item.className, item.tietPpctNumber)}
                  className={`p-2 rounded-xl border transition-all shrink-0 flex items-center gap-1 text-xs font-bold ${
                    item.completed
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200'
                  }`}
                  title={item.completed ? 'Đã dạy (Nhấn để hủy)' : 'Đánh dấu đã dạy xong'}
                >
                  {item.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Đã dạy</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span className="hidden sm:inline">Chưa dạy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Grade / Class Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc hiển thị:</span>
        </div>

        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          Tất cả các lớp ({weeklySchedule.length} tiết)
        </button>

        {/* Lọc Khối 9 & Khối 7 */}
        {['9', '7'].map((g) => {
          const count = weeklySchedule.filter((p) => p.grade === g).length;
          if (count === 0) return null;
          return (
            <button
              key={`grade-${g}`}
              type="button"
              onClick={() => setSelectedFilter(g)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === g
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Khối {g} ({count} tiết)
            </button>
          );
        })}

        {/* Lọc theo từng lớp cụ thể */}
        {distinctClasses.map((cls) => {
          const count = weeklySchedule.filter((p) => p.className === cls).length;
          return (
            <button
              key={`class-${cls}`}
              type="button"
              onClick={() => setSelectedFilter(cls)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === cls
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/60'
              }`}
            >
              Lớp {cls} ({count}t)
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: GRID TIMETABLE (MA TRẬN THỜI KHÓA BIỂU TUẦN) */}
      {viewMode === 'grid' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs font-bold">
                  <th className="py-3 px-3 w-28 text-center bg-slate-200/70 border-r border-slate-200">
                    Tiết \ Thứ
                  </th>
                  {weekDays.map((day) => {
                    const isToday = day.dateStr === todayDateStr;
                    return (
                      <th
                        key={day.dayOfWeek}
                        className={`py-3 px-3 text-center border-r border-slate-200 transition-colors ${
                          isToday
                            ? 'bg-emerald-100/90 text-emerald-950 font-bold'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs uppercase">{day.dayName}</span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {day.dateFormatted}
                          </span>
                          {isToday && (
                            <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-700 text-white">
                              HÔM NAY
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {periodsTimetable.map((periodRow) => (
                  <tr key={periodRow.period} className="hover:bg-slate-50/50 transition-colors">
                    {/* Period number and time */}
                    <td className="py-3 px-3 text-center font-bold bg-slate-50 border-r border-slate-200">
                      <div className="text-xs text-slate-900">Tiết {periodRow.period}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{periodRow.time}</div>
                    </td>

                    {/* Columns for Monday (2) to Saturday (7) */}
                    {weekDays.map((day) => {
                      const isToday = day.dateStr === todayDateStr;
                      const cellPeriods = gridMatrix[periodRow.period]?.[day.dayOfWeek] || [];

                      return (
                        <td
                          key={day.dayOfWeek}
                          className={`py-2 px-2.5 border-r border-slate-200 align-top transition-colors ${
                            isToday ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          {cellPeriods.length > 0 ? (
                            <div className="space-y-2">
                              {cellPeriods.map((periodItem) => (
                                <div
                                  key={periodItem.slotId}
                                  onClick={() => setDetailPeriod(periodItem)}
                                  className={`rounded-xl p-2.5 border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                                    periodItem.completed
                                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                                      : isToday
                                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                                      : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-900'
                                  }`}
                                >
                                  {/* Badges: Class & PPCT Period */}
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        periodItem.grade === '9'
                                          ? 'bg-blue-100 text-blue-900'
                                          : 'bg-purple-100 text-purple-900'
                                      }`}
                                    >
                                      {periodItem.className}
                                    </span>

                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                      Tiết {periodItem.tietPpctNumber}
                                    </span>
                                  </div>

                                  {/* Lesson Title */}
                                  <div className="font-bold text-[11px] line-clamp-2 leading-snug">
                                    {periodItem.baiHoc}
                                  </div>

                                  {/* Status Indicator */}
                                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                                    <span>Khối {periodItem.grade}</span>
                                    {periodItem.completed ? (
                                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                        <CheckCircle2 className="w-3 h-3" /> Đã dạy
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">Chưa dạy</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-14 flex items-center justify-center text-slate-300 text-[11px]">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW (LỊCH BÁO GIẢNG CHI TIẾT THEO NGÀY) */}
      {viewMode === 'table' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 text-center w-12">STT</th>
                  <th className="py-2.5 px-3 w-32">Thứ, Ngày</th>
                  <th className="py-2.5 px-3 text-center w-20">Tiết TKB</th>
                  <th className="py-2.5 px-3 text-center w-20">Lớp</th>
                  <th className="py-2.5 px-3 text-center w-24">Tiết PPCT</th>
                  <th className="py-2.5 px-4">Tên bài dạy / Nội dung PPCT</th>
                  <th className="py-2.5 px-3 w-36">Chương / Chủ đề</th>
                  <th className="py-2.5 px-3 text-center w-28">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedule.map((item, index) => {
                  const isToday = item.dateStr === todayDateStr;

                  return (
                    <tr
                      key={item.slotId}
                      className={`hover:bg-slate-50 transition-colors ${
                        isToday ? 'bg-emerald-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.dayName}</div>
                        <div className="text-[11px] text-slate-500">{item.dateFormatted}</div>
                        {isToday && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Hôm nay
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                        Tiết {item.period}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-xs">
                          {item.className}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                        Tiết {item.tietPpctNumber}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <div
                          className="hover:text-emerald-800 cursor-pointer"
                          onClick={() => setDetailPeriod(item)}
                        >
                          {item.baiHoc}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 line-clamp-1">
                        {item.chuong || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCompleted(item.className, item.tietPpctNumber)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                            item.completed
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                        >
                          {item.completed ? 'Đã dạy' : 'Chưa dạy'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL LESSON MODAL */}
      {detailPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-xs font-bold">
                  Tiết {detailPeriod.tietPpctNumber} PPCT
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-xs font-bold">
                  Lớp {detailPeriod.className}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailPeriod(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {detailPeriod.dayName}, {detailPeriod.dateFormatted} • Tiết {detailPeriod.period} ({detailPeriod.session === 'sang' ? 'Buổi sáng' : 'Buổi chiều'})
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {detailPeriod.baiHoc}
              </h3>
              <p className="text-xs text-slate-600">
                <strong>Chương:</strong> {detailPeriod.chuong || 'Chưa cập nhật'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
              <div>
                <strong>Khối lớp:</strong> Khối {detailPeriod.grade} • Môn {detailPeriod.subject}
              </div>
              <div>
                <strong>Học kỳ:</strong> Học kỳ {detailPeriod.hocKy} • Tuần PPCT: {detailPeriod.tuanPpct}
              </div>
              <div>
                <strong>Thời lượng bài:</strong> {detailPeriod.soTietCuaBai} tiết (Đây là tiết thứ {detailPeriod.tietThuCuaBai} của bài học này)
              </div>
              {detailPeriod.room && (
                <div>
                  <strong>Phòng học:</strong> {detailPeriod.room}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleCompleted(detailPeriod.className, detailPeriod.tietPpctNumber);
                  setDetailPeriod((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  detailPeriod.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{detailPeriod.completed ? 'Đã hoàn thành tiết dạy' : 'Đánh dấu đã dạy'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailPeriod(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD & OCR MODAL */}
      <TimetableUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentConfig={currentConfig}
        onSaveConfig={onUpdateConfig}
      />
    </div>
  );
};
