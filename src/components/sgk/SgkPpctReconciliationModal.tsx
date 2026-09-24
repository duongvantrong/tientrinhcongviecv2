import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TableProperties,
  Layers,
  Calendar,
  Clock,
  Award,
  Check,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Eye,
  Sliders,
  ChevronRight,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import {
  SgkBook,
  SgkChapter,
  SgkLesson,
  PpctDataset,
  MatrixRow,
  MatrixConfig,
} from '../../types';
import { parseSgkFile } from '../../utils/sgkParser';
import {
  reconcileChapterWithPpct,
  calculateBalancedDistribution,
  convertReconciledLessonsToMatrixRows,
  ReconciledLessonItem,
} from '../../utils/sgkPpctReconciler';

interface SgkPpctReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sgkBooks: SgkBook[];
  onUpdateSgkBooks: (books: SgkBook[]) => void;
  activePpct?: PpctDataset;
  allPpctDatasets?: PpctDataset[];
  matrixConfig: MatrixConfig;
  onApplyMatrixRows: (rows: MatrixRow[], configUpdates?: Partial<MatrixConfig>) => void;
}

export const SgkPpctReconciliationModal: React.FC<SgkPpctReconciliationModalProps> = ({
  isOpen,
  onClose,
  sgkBooks,
  onUpdateSgkBooks,
  activePpct,
  allPpctDatasets = [],
  matrixConfig,
  onApplyMatrixRows,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Khối lớp đang chọn (lấy theo MatrixConfig hoặc PPCT đang mở)
  const currentGradeNorm = String(matrixConfig.grade || activePpct?.grade || '9').replace(/\D/g, '') || '9';
  const [selectedGrade, setSelectedGrade] = useState<string>(currentGradeNorm);

  // Lọc danh sách SGK phù hợp với khối lớp
  const booksForGrade = useMemo(() => {
    return sgkBooks.filter((b) => (b.grade || '9') === selectedGrade);
  }, [sgkBooks, selectedGrade]);

  // Bộ sách SGK đang chọn
  const [selectedBookId, setSelectedBookId] = useState<string>(() => {
    const matched = sgkBooks.find((b) => (b.grade || '9') === selectedGrade);
    return matched?.id || sgkBooks[0]?.id || '';
  });

  // Tự động cập nhật selectedBookId nếu thay đổi khối
  useEffect(() => {
    const book = booksForGrade[0];
    if (book && (!selectedBookId || !booksForGrade.some((b) => b.id === selectedBookId))) {
      setSelectedBookId(book.id);
    }
  }, [selectedGrade, booksForGrade]);

  const currentBook = useMemo(() => {
    return sgkBooks.find((b) => b.id === selectedBookId) || booksForGrade[0] || sgkBooks[0];
  }, [sgkBooks, selectedBookId, booksForGrade]);

  // Chương cần thực hiện (mặc định là chương 1 của sách)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');

  useEffect(() => {
    if (currentBook && currentBook.chapters.length > 0) {
      if (!selectedChapterId || !currentBook.chapters.some((c) => c.id === selectedChapterId)) {
        setSelectedChapterId(currentBook.chapters[0].id);
      }
    }
  }, [currentBook]);

  const currentChapter = useMemo(() => {
    if (!currentBook) return null;
    return currentBook.chapters.find((c) => c.id === selectedChapterId) || currentBook.chapters[0] || null;
  }, [currentBook, selectedChapterId]);

  // Tùy chọn: Dùng số tiết thực tế trong PPCT hay SGK
  const [usePpctPeriods, setUsePpctPeriods] = useState<boolean>(true);

  // Danh sách các bài đã chọn trong chương
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [previewObjectiveLesson, setPreviewObjectiveLesson] = useState<ReconciledLessonItem | null>(null);

  // PPCT dùng để đối chiếu
  const effectivePpct = useMemo(() => {
    if (activePpct && (activePpct.grade || '9') === selectedGrade) {
      return activePpct;
    }
    const match = allPpctDatasets.find((d) => (d.grade || '9') === selectedGrade);
    return match || activePpct;
  }, [activePpct, allPpctDatasets, selectedGrade]);

  // Thực hiện đối chiếu ban đầu
  const initialReconciliation = useMemo(() => {
    if (!currentChapter || !effectivePpct) return null;
    return reconcileChapterWithPpct(currentChapter, effectivePpct, {
      usePpctPeriods,
    });
  }, [currentChapter, effectivePpct, usePpctPeriods]);

  // Khởi tạo các bài được chọn ban đầu khi đổi chương
  useEffect(() => {
    if (initialReconciliation) {
      const defaultSelected = initialReconciliation.lessons
        .filter((l) => l.matchStatus !== 'not_in_ppct')
        .map((l) => l.id);
      setSelectedLessonIds(defaultSelected.length > 0 ? defaultSelected : initialReconciliation.lessons.map((l) => l.id));
    }
  }, [currentChapter?.id]);

  // Tính toán cân đối thời lượng và điểm số
  const reconciledWithDistribution = useMemo(() => {
    if (!initialReconciliation) return [];

    const lessonsWithSelection = initialReconciliation.lessons.map((l) => ({
      ...l,
      isSelected: selectedLessonIds.includes(l.id),
      effectivePeriods: usePpctPeriods && l.ppctPeriods > 0 ? l.ppctPeriods : l.sgkPeriods,
    }));

    return calculateBalancedDistribution(lessonsWithSelection, {
      targetScore: 10.0,
      structureType: matrixConfig.structureType || 'moet_2025_new',
    });
  }, [initialReconciliation, selectedLessonIds, usePpctPeriods, matrixConfig.structureType]);

  // Thống kê tổng hợp
  const summaryStats = useMemo(() => {
    const selected = reconciledWithDistribution.filter((l) => l.isSelected);
    const totalPeriods = selected.reduce((s, l) => s + l.effectivePeriods, 0);
    const totalScore = selected.reduce((s, l) => s + l.balancedScore, 0);

    let totalNlc = 0;
    let totalDs = 0;
    let totalTln = 0;
    let totalTl = 0;

    selected.forEach((l) => {
      if (l.allocatedQuestions) {
        totalNlc += l.allocatedQuestions.nlc.biet + l.allocatedQuestions.nlc.hieu;
        totalDs += l.allocatedQuestions.ds.biet + l.allocatedQuestions.ds.hieu;
        totalTln += l.allocatedQuestions.tln.biet + l.allocatedQuestions.tln.hieu;
        totalTl += l.allocatedQuestions.tl.vanDung + l.allocatedQuestions.tl.vanDungCao;
      }
    });

    return {
      selectedCount: selected.length,
      totalLessons: reconciledWithDistribution.length,
      totalPeriods,
      totalScore: Number(totalScore.toFixed(1)),
      totalQuestions: totalNlc + totalDs + totalTln + totalTl,
      totalNlc,
      totalDs,
      totalTln,
      totalTl,
    };
  }, [reconciledWithDistribution]);

  // Xử lý tải lên file SGK mới (Word, Excel, PDF, JSON)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage(null);

      const parsedBook = await parseSgkFile(file, selectedGrade);
      parsedBook.grade = selectedGrade;

      const updatedBooks = [parsedBook, ...sgkBooks.filter((b) => b.id !== parsedBook.id)];
      onUpdateSgkBooks(updatedBooks);
      setSelectedBookId(parsedBook.id);

      setUploadMessage({
        type: 'success',
        text: `Đã đọc và tải lên thành công bộ SGK "${parsedBook.title}" gồm ${parsedBook.chapters.length} chương!`,
      });
    } catch (err: any) {
      setUploadMessage({
        type: 'error',
        text: err.message || 'Không thể đọc file SGK. Vui lòng thử lại với file Word, Excel, PDF hoặc JSON chuẩn.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Chọn / bỏ chọn bài học
  const toggleLesson = (id: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllLessons = () => {
    setSelectedLessonIds(reconciledWithDistribution.map((l) => l.id));
  };

  const deselectAllLessons = () => {
    setSelectedLessonIds([]);
  };

  // Áp dụng vào Ma trận đề & Bảng đặc tả
  const handleApplyToMatrix = () => {
    if (summaryStats.selectedCount === 0) {
      alert('Vui lòng chọn ít nhất 1 bài học trong chương để tạo ma trận.');
      return;
    }

    const newRows = convertReconciledLessonsToMatrixRows(
      reconciledWithDistribution,
      currentChapter?.title || 'Chương I'
    );

    const configUpdates: Partial<MatrixConfig> = {
      grade: selectedGrade,
      activeSgkBookId: selectedBookId,
      examPeriod: `Kiểm tra ${currentChapter?.shortTitle || currentChapter?.title || 'định kỳ'}`,
    };

    onApplyMatrixRows(newRows, configUpdates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Đối chiếu SGK với PPCT & Phân chia điểm cân đối
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  Chuẩn GDPT 2018
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Đọc qua các bài trong chương cần thực hiện, đối chiếu với PPCT để hiển thị nội dung chính xác, tính toán số tiết và phân chia điểm cân đối (10.0đ).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {uploadMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-medium flex items-center justify-between gap-2 border-b ${
              uploadMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{uploadMessage.text}</span>
            </div>
            <button
              onClick={() => setUploadMessage(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar / Selectors Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Grade Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-600">Khối:</span>
              <div className="flex gap-1">
                {['6', '7', '8', '9'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                      selectedGrade === g
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* SGK Book Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs max-w-xs">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="text-xs font-medium text-slate-800 bg-transparent border-none focus:outline-none truncate w-full cursor-pointer"
              >
                {booksForGrade.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.publisher})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            {currentBook && currentBook.chapters.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-300 shadow-2xs max-w-sm">
                <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-950 shrink-0">Chương:</span>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="text-xs font-bold text-emerald-900 bg-transparent border-none focus:outline-none truncate w-full cursor-pointer"
                >
                  {currentBook.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title} ({ch.lessons.length} bài)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.xlsx,.xls,.pdf,.json"
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Tải lên file SGK định dạng Word (.docx), Excel (.xlsx), PDF hoặc JSON"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUploading ? 'Đang đọc...' : 'Tải lên SGK mới'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Active PPCT Reference Banner */}
          <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                K{selectedGrade}
              </div>
              <div>
                <span className="font-bold text-emerald-950">
                  Đối chiếu với PPCT: {effectivePpct ? effectivePpct.name : `Môn Toán Khối ${selectedGrade}`}
                </span>
                <p className="text-[11px] text-emerald-800">
                  Năm học {effectivePpct?.academicYear || '2026 - 2027'} • Tổng {effectivePpct?.totalLessons || effectivePpct?.lessons.length || 140} tiết dạy
                </p>
              </div>
            </div>

            {/* Toggle Source of Periods */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
              <span className="text-[11px] font-medium text-slate-600">Tính số tiết theo:</span>
              <button
                type="button"
                onClick={() => setUsePpctPeriods(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  usePpctPeriods
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thực tế PPCT
              </button>
              <button
                type="button"
                onClick={() => setUsePpctPeriods(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  !usePpctPeriods
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quy định SGK
              </button>
            </div>
          </div>

          {/* Statistics summary card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Số bài trong chương</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {summaryStats.selectedCount} / {summaryStats.totalLessons} bài
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tổng số tiết dạy</span>
              </div>
              <div className="mt-1 text-lg font-bold text-emerald-950">
                {summaryStats.totalPeriods} tiết
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-blue-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Tổng điểm phân chia</span>
              </div>
              <div className="mt-1 text-lg font-bold text-blue-950 flex items-baseline gap-1">
                <span>{summaryStats.totalScore}</span>
                <span className="text-xs font-normal text-blue-700">/ 10.0 điểm</span>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
              <div className="text-[11px] font-medium text-purple-700 flex items-center gap-1">
                <TableProperties className="w-3.5 h-3.5 text-purple-600" />
                <span>Cấu trúc câu hỏi</span>
              </div>
              <div className="mt-1 text-xs font-bold text-purple-950 space-y-0.5">
                <div>{summaryStats.totalNlc} TN 4LC • {summaryStats.totalDs} Đúng/Sai</div>
                <div>{summaryStats.totalTln} Trả lời ngắn • {summaryStats.totalTl} Tự luận</div>
              </div>
            </div>
          </div>

          {/* Lessons Table with Reconciliation and Calculated Balanced Score */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Bảng đối chiếu chi tiết các bài trong {currentChapter?.title}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllLessons}
                  className="text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
                >
                  Chọn tất cả
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={deselectAllLessons}
                  className="text-slate-500 hover:text-slate-700 font-medium hover:underline"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-3 w-10 text-center">Chọn</th>
                    <th className="p-3 w-12 text-center">STT</th>
                    <th className="p-3 min-w-[200px]">Tên bài học chuẩn (SGK)</th>
                    <th className="p-3 min-w-[140px]">Đối chiếu PPCT</th>
                    <th className="p-3 w-24 text-center">Tuần & Tiết</th>
                    <th className="p-3 w-20 text-center">Số tiết</th>
                    <th className="p-3 w-20 text-center">% Thời lượng</th>
                    <th className="p-3 w-24 text-center">Điểm cân đối</th>
                    <th className="p-3 min-w-[160px] text-center">Phân bổ câu hỏi</th>
                    <th className="p-3 w-16 text-center">YCCĐ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reconciledWithDistribution.map((lesson, idx) => {
                    const isSelected = lesson.isSelected;
                    const q = lesson.allocatedQuestions;

                    return (
                      <tr
                        key={lesson.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-white hover:bg-emerald-50/30' : 'bg-slate-50/60 opacity-60'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLesson(lesson.id)}
                            className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                        </td>

                        {/* STT */}
                        <td className="p-3 text-center font-bold text-slate-700">
                          {lesson.lessonNumber || idx + 1}
                        </td>

                        {/* Lesson Title */}
                        <td className="p-3 font-semibold text-slate-900 leading-snug">
                          {lesson.title}
                          {lesson.shortTitle && lesson.shortTitle !== lesson.title && (
                            <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                              {lesson.shortTitle}
                            </span>
                          )}
                        </td>

                        {/* PPCT Reconciliation Status */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {lesson.matchStatus === 'exact' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : lesson.matchStatus === 'partial' ? (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span
                              className={`text-[11px] font-semibold ${
                                lesson.matchStatus === 'exact'
                                  ? 'text-emerald-800'
                                  : lesson.matchStatus === 'partial'
                                  ? 'text-amber-800'
                                  : 'text-slate-500'
                              }`}
                            >
                              {lesson.statusLabel}
                            </span>
                          </div>
                          {lesson.matchingPpctLessons.length > 0 && (
                            <span className="block text-[10px] text-slate-500 italic mt-0.5 truncate max-w-[150px]">
                              {lesson.matchingPpctLessons.map((l) => l.baiHoc).join('; ')}
                            </span>
                          )}
                        </td>

                        {/* Weeks & Periods */}
                        <td className="p-3 text-center text-slate-600">
                          <div className="font-medium text-[11px] text-slate-800">{lesson.ppctWeeksText}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{lesson.ppctPeriodsText}</div>
                        </td>

                        {/* Periods Count */}
                        <td className="p-3 text-center">
                          <span className="font-bold text-slate-900 text-xs">
                            {lesson.effectivePeriods} tiết
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            (SGK: {lesson.sgkPeriods})
                          </span>
                        </td>

                        {/* Time Ratio % */}
                        <td className="p-3 text-center font-semibold text-slate-700">
                          {isSelected ? `${lesson.timeRatioPct}%` : '—'}
                        </td>

                        {/* Balanced Score */}
                        <td className="p-3 text-center">
                          {isSelected ? (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                              {lesson.balancedScore % 1 === 0 ? lesson.balancedScore : lesson.balancedScore.toFixed(1).replace('.', ',')} đ
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Allocated Questions */}
                        <td className="p-3 text-center">
                          {isSelected && q ? (
                            <div className="text-[11px] text-slate-700 font-medium space-y-0.5">
                              {(q.nlc.biet + q.nlc.hieu > 0) && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 mr-1 text-[10px]">
                                  {q.nlc.biet + q.nlc.hieu} câu 4LC
                                </span>
                              )}
                              {(q.ds.biet + q.ds.hieu > 0) && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 mr-1 text-[10px]">
                                  {q.ds.biet + q.ds.hieu} Đ/S
                                </span>
                              )}
                              {(q.tln.biet + q.tln.hieu > 0) && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 mr-1 text-[10px]">
                                  {q.tln.biet + q.tln.hieu} TL ngắn
                                </span>
                              )}
                              {(q.tl.vanDung + q.tl.vanDungCao > 0) && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px]">
                                  {q.tl.vanDung + q.tl.vanDungCao} Tự luận
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Objectives View */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => setPreviewObjectiveLesson(lesson)}
                            className="p-1 hover:bg-slate-100 text-slate-600 hover:text-emerald-800 rounded transition-colors"
                            title="Xem Yêu cầu cần đạt chi tiết của bài"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Objective Preview Drawer if open */}
          {previewObjectiveLesson && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-300 shadow-inner space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Yêu cầu cần đạt: {previewObjectiveLesson.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewObjectiveLesson(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-emerald-900">Mức 1: Nhận biết</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {previewObjectiveLesson.objectives.nhanBiet || 'Nhận biết các khái niệm và tính chất cơ bản.'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-blue-900">Mức 2: Thông hiểu</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {previewObjectiveLesson.objectives.thongHieu || 'Thông hiểu và giải thích được các tính chất, công thức.'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-purple-900">Mức 3: Vận dụng</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {previewObjectiveLesson.objectives.vanDung || 'Vận dụng giải quyết các bài toán và tình huống thực tiễn.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Đã chọn <strong>{summaryStats.selectedCount} bài học</strong> • Tổng{' '}
              <strong>{summaryStats.totalPeriods} tiết</strong> • Điểm cân đối:{' '}
              <strong className="text-emerald-800">{summaryStats.totalScore} / 10.0 điểm</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={summaryStats.selectedCount === 0}
              onClick={handleApplyToMatrix}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Áp dụng vào Ma trận & Bảng đặc tả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
