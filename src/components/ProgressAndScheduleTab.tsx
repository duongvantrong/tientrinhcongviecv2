import React from 'react';
import { PpctDataset, TimeframeConfig, ExamEvent } from '../types';
import { PpctSidebar } from './PpctSidebar';
import { TimeframeSidebar } from './TimeframeSidebar';
import { StatCards } from './StatCards';
import { ProgressCharts } from './ProgressCharts';
import { UpcomingExams } from './UpcomingExams';
import { ExamScheduleTable } from './ExamScheduleTable';
import { LessonPlanSection } from './lessonPlan/LessonPlanSection';

interface ProgressAndScheduleTabProps {
  datasets: PpctDataset[];
  activeDatasetId: string;
  activeDataset: PpctDataset;
  timeframeConfig: TimeframeConfig;
  currentWeek: number;
  term: 1 | 2;
  isBeforeTerm: boolean;
  exams: ExamEvent[];
  onSelectDataset: (id: string) => void;
  onAddDataset: (dataset: PpctDataset) => void;
  onDeleteDataset: (id: string) => void;
  onUpdateDatasetName: (id: string, newName: string) => void;
  onUpdateAcademicYear?: (id: string, newYear: string) => void;
  onUpdateTimeframeConfig: (updated: Partial<TimeframeConfig>) => void;
  onResetTimeframeConfig: () => void;
  onOpenManualEditor: () => void;
  onOpenFullPpct: () => void;
  onExportPpctExcel: () => void;
  onSelectExamForMatrix: (exam: ExamEvent) => void;
  onOpenUploadModal?: (grade?: string) => void;
  isRealTime?: boolean;
  onSyncRealTime?: () => void;
  onStandardizeDataset?: (id: string) => void;
}

export const ProgressAndScheduleTab: React.FC<ProgressAndScheduleTabProps> = ({
  datasets,
  activeDatasetId,
  activeDataset,
  timeframeConfig,
  currentWeek,
  term,
  isBeforeTerm,
  exams,
  onSelectDataset,
  onAddDataset,
  onDeleteDataset,
  onUpdateDatasetName,
  onUpdateAcademicYear,
  onUpdateTimeframeConfig,
  onResetTimeframeConfig,
  onOpenManualEditor,
  onOpenFullPpct,
  onExportPpctExcel,
  onSelectExamForMatrix,
  onOpenUploadModal,
  isRealTime = true,
  onSyncRealTime,
  onStandardizeDataset,
}) => {
  const totalPeriods =
    activeDataset?.lessons?.reduce((sum, l) => sum + (l.soTiet || 1), 0) || activeDataset?.totalLessons || 140;
  const hk1Periods =
    activeDataset?.lessons?.filter((l) => l.hocKy === 1).reduce((sum, l) => sum + (l.soTiet || 1), 0) || 72;
  const hk2Periods =
    activeDataset?.lessons?.filter((l) => l.hocKy === 2).reduce((sum, l) => sum + (l.soTiet || 1), 0) || 68;
  const isPpctStandardMatch = totalPeriods === 140 && hk1Periods === 72 && hk2Periods === 68;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Sidebars */}
      <div className="lg:col-span-4 xl:col-span-3.5 space-y-6">
        <PpctSidebar
          datasets={datasets}
          activeDatasetId={activeDatasetId}
          onSelectDataset={onSelectDataset}
          onAddDataset={onAddDataset}
          onDeleteDataset={onDeleteDataset}
          onUpdateDatasetName={onUpdateDatasetName}
          onUpdateAcademicYear={onUpdateAcademicYear}
          onOpenManualEditor={onOpenManualEditor}
          onOpenFullPpct={onOpenFullPpct}
          onExportPpctExcel={onExportPpctExcel}
          onOpenUploadModal={onOpenUploadModal}
        />

        <TimeframeSidebar
          config={timeframeConfig}
          isRealTime={isRealTime}
          onSyncRealTime={onSyncRealTime}
          onChange={onUpdateTimeframeConfig}
          onReset={onResetTimeframeConfig}
        />
      </div>

      {/* Right Column: Dashboard Stats, Charts & Exam Schedules */}
      <div className="lg:col-span-8 xl:col-span-8.5 space-y-6">
        {/* Empty state prompt if no PPCT has been uploaded */}
        {datasets.length === 0 && (
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 bg-emerald-700/80 rounded-full text-xs font-semibold text-emerald-100 uppercase tracking-wider mb-2">
                  Chuẩn GDPT 2018 — 140 tiết / 35 tuần
                </span>
                <h3 className="text-lg font-bold text-white">
                  Chưa có PPCT nào — Tùy chỉnh khối và tải lên PPCT môn Toán
                </h3>
                <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                  Hệ thống không tải sẵn PPCT mặc định. Thầy/Cô vui lòng chọn Khối lớp bên dưới và tải lên file Word (.docx) hoặc Excel (.xlsx) để quản lý tiến độ và ma trận đề.
                </p>
              </div>
            </div>

            {/* 4 Grade buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[
                { g: '6', label: 'Khối 6', desc: 'Toán 6 — 140 tiết' },
                { g: '7', label: 'Khối 7', desc: 'Toán 7 — 140 tiết' },
                { g: '8', label: 'Khối 8', desc: 'Toán 8 — 140 tiết' },
                { g: '9', label: 'Khối 9', desc: 'Toán 9 — 140 tiết' },
              ].map((item) => (
                <button
                  key={item.g}
                  onClick={() => onOpenUploadModal?.(item.g)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-emerald-300 rounded-xl p-3.5 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{item.label}</span>
                    <span className="text-emerald-300 group-hover:translate-x-0.5 transition-transform font-bold text-xs">&rarr;</span>
                  </div>
                  <p className="text-[11px] text-emerald-200">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PPCT Standard Status & Discrepancy Alert */}
        {activeDataset && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              isPpctStandardMatch
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isPpctStandardMatch ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
                    }`}
                  />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Định mức chuẩn GDPT 2018 môn Toán: 140 tiết • 35 tuần (4 tiết/tuần)
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPpctStandardMatch
                        ? 'bg-emerald-200/70 text-emerald-800'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {isPpctStandardMatch ? 'Khớp chuẩn 100%' : 'Cần cân chỉnh'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    <strong>HK1:</strong> 18 tuần • 72 tiết (Tiết 1 – 72)
                  </span>
                  <span>•</span>
                  <span>
                    <strong>HK2:</strong> 17 tuần • 68 tiết (Tiết 73 – 140)
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Hiện tại:</strong> Cả năm {totalPeriods} tiết (HK1: {hk1Periods}t, HK2: {hk2Periods}t)
                  </span>
                </div>
              </div>

              {!isPpctStandardMatch && onStandardizeDataset && (
                <button
                  type="button"
                  onClick={() => onStandardizeDataset(activeDataset.id)}
                  className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs hover:shadow flex-shrink-0"
                >
                  Tự động cân chỉnh chuẩn 140 tiết (4 tiết/tuần)
                </button>
              )}
            </div>
          </div>
        )}

        <StatCards
          ppct={activeDataset}
          config={timeframeConfig}
          currentWeek={currentWeek}
          term={term}
          isBeforeTerm={isBeforeTerm}
        />

        <ProgressCharts
          ppct={activeDataset}
          config={timeframeConfig}
          currentWeek={currentWeek}
          term={term}
          isBeforeTerm={isBeforeTerm}
        />

        <LessonPlanSection
          activeDataset={activeDataset}
          currentWeek={currentWeek}
        />

        <UpcomingExams
          exams={exams}
          onSelectExamForMatrix={onSelectExamForMatrix}
        />

        <ExamScheduleTable
          exams={exams}
          onSelectExamForMatrix={onSelectExamForMatrix}
        />
      </div>
    </div>
  );
};
