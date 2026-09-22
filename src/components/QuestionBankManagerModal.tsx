import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Trash2,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Plus,
  BookOpen,
  Filter,
  Check,
  FileCode,
  Tag,
  GraduationCap,
  Cloud,
  Eye,
  Info,
  Camera,
  Image as ImageIcon,
  ClipboardPaste,
  Loader2,
  Edit3,
} from 'lucide-react';
import { BankQuestionTemplate, CognitiveLevel, QuestionType } from '../types';
import {
  parseUploadedQuestionFile,
  parseQuestionText,
  generateSampleTextContent,
} from '../utils/questionBankParser';
import {
  getStoredUploadedQuestions,
  saveUploadedQuestions,
  addQuestionsToBank,
  removeQuestionFromBank,
  clearUploadedQuestionBank,
  exportQuestionBankToDocx,
  exportQuestionBankToJSON,
  filterQuestions,
} from '../utils/questionBankStorage';
import { renderLatexToHtml } from '../utils/latexUtils';
import { auth } from '../lib/firebase';
import { saveAs } from 'file-saver';

interface QuestionBankManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated?: (questions: BankQuestionTemplate[]) => void;
  initialGrade?: string;
}

export const QuestionBankManagerModal: React.FC<QuestionBankManagerModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated,
  initialGrade = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'manual' | 'screenshot'>('browse');

  // Ngân hàng câu hỏi
  const [questions, setQuestions] = useState<BankQuestionTemplate[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [defaultGradeForUpload, setDefaultGradeForUpload] = useState<string>('auto');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedPreview, setParsedPreview] = useState<BankQuestionTemplate[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Screenshot / Clipboard Paste OCR state
  const [screenshotImage, setScreenshotImage] = useState<string | null>(null);
  const [isScreenshotOcrLoading, setIsScreenshotOcrLoading] = useState<boolean>(false);
  const [screenshotOcrGrade, setScreenshotOcrGrade] = useState<string>(initialGrade === 'all' ? '9' : initialGrade);
  const [screenshotParsedQuestions, setScreenshotParsedQuestions] = useState<BankQuestionTemplate[]>([]);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [editingOcrIndex, setEditingOcrIndex] = useState<number | null>(null);
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);

  // Manual Add Form State
  const [manualGrade, setManualGrade] = useState<string>('9');
  const [manualSection, setManualSection] = useState<'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay'>('part1_mcq');
  const [manualLevel, setManualLevel] = useState<CognitiveLevel>('nhanBiet');
  const [manualPrompt, setManualPrompt] = useState<string>('');
  const [manualOptA, setManualOptA] = useState<string>('');
  const [manualOptB, setManualOptB] = useState<string>('');
  const [manualOptC, setManualOptC] = useState<string>('');
  const [manualOptD, setManualOptD] = useState<string>('');
  const [manualCorrectOpt, setManualCorrectOpt] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [manualSolution, setManualSolution] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load questions on open
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredUploadedQuestions();
      setQuestions(stored);
      if (initialGrade && initialGrade !== 'all') {
        setSelectedGrade(initialGrade);
        setScreenshotOcrGrade(initialGrade);
      }
    }
  }, [isOpen, initialGrade]);

  // Global paste handler to capture screenshots from Clipboard (Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleProcessScreenshotFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen, screenshotOcrGrade]);

  const handleProcessScreenshotFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setScreenshotImage(base64);
        setActiveTab('screenshot');
        await handleRunScreenshotOcr(base64, file.type, screenshotOcrGrade);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunScreenshotOcr = async (base64Data: string, mimeType?: string, gradeTarget?: string) => {
    setIsScreenshotOcrLoading(true);
    setScreenshotError(null);
    setScreenshotParsedQuestions([]);

    try {
      const res = await fetch('/api/parse-question-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType || 'image/png',
          grade: gradeTarget || screenshotOcrGrade || '9',
          subject: 'Toán',
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setScreenshotParsedQuestions(data.questions);
      } else {
        setScreenshotError(data.error || 'Không nhận diện được câu hỏi từ ảnh. Bạn có thể tự soạn hoặc thử ảnh rõ nét hơn.');
      }
    } catch (err: any) {
      console.error('[Question Bank] OCR error:', err);
      setScreenshotError(err?.message || 'Lỗi kết nối máy chủ nhận diện hình ảnh.');
    } finally {
      setIsScreenshotOcrLoading(false);
    }
  };

  if (!isOpen) return null;

  // Thống kê theo khối
  const countGrade6 = questions.filter((q) => q.grade === '6').length;
  const countGrade7 = questions.filter((q) => q.grade === '7').length;
  const countGrade8 = questions.filter((q) => q.grade === '8').length;
  const countGrade9 = questions.filter((q) => q.grade === '9').length;

  // Lọc câu hỏi
  const filteredQuestions = filterQuestions(questions, {
    grade: selectedGrade,
    section: selectedSection,
    cognitiveLevel: selectedLevel,
    keyword: searchQuery,
  });

  // Xử lý tải file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setParseErrors([]);
    setSuccessMessage('');
    setIsParsing(true);

    try {
      const g = defaultGradeForUpload === 'auto' ? '9' : defaultGradeForUpload;
      const res = await parseUploadedQuestionFile(file, g);
      setParsedPreview(res.questions);
      if (res.errors.length > 0) {
        setParseErrors(res.errors);
      }
    } catch (err: any) {
      setParseErrors([`Lỗi khi đọc file: ${err?.message || String(err)}`]);
    } finally {
      setIsParsing(false);
    }
  };

  // Xử lý phân tích văn bản dán vào
  const handleParseRawText = () => {
    if (!rawText.trim()) return;
    setParseErrors([]);
    setSuccessMessage('');
    setIsParsing(true);

    try {
      const g = defaultGradeForUpload === 'auto' ? '9' : defaultGradeForUpload;
      const res = parseQuestionText(rawText, g, 'Nhập trực tiếp');
      setParsedPreview(res.questions);
      if (res.errors.length > 0) {
        setParseErrors(res.errors);
      }
    } catch (err: any) {
      setParseErrors([`Lỗi khi phân tích: ${err?.message || String(err)}`]);
    } finally {
      setIsParsing(false);
    }
  };

  // Lưu các câu hỏi đã preview vào ngân hàng
  const handleSaveParsedQuestions = async () => {
    if (parsedPreview.length === 0) return;
    const updated = await addQuestionsToBank(parsedPreview, auth.currentUser?.uid);
    setQuestions(updated);
    onQuestionsUpdated?.(updated);
    setSuccessMessage(`Đã ghi nhận và phân loại thành công ${parsedPreview.length} câu hỏi vào ngân hàng!`);
    setParsedPreview([]);
    setUploadFile(null);
    setRawText('');
    setTimeout(() => {
      setActiveTab('browse');
      setSuccessMessage('');
    }, 1200);
  };

  // Xóa một câu hỏi
  const handleDeleteQuestion = async (id?: string) => {
    if (!id) return;
    if (confirm('Thầy/Cô có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng tham khảo?')) {
      const updated = await removeQuestionFromBank(id, auth.currentUser?.uid);
      setQuestions(updated);
      onQuestionsUpdated?.(updated);
    }
  };

  // Xóa toàn bộ
  const handleClearAll = async () => {
    if (confirm(`CẢNH BÁO: Thầy/Cô có chắc chắn muốn xóa toàn bộ ${questions.length} câu hỏi đã tải lên?`)) {
      await clearUploadedQuestionBank(auth.currentUser?.uid);
      setQuestions([]);
      onQuestionsUpdated?.([]);
    }
  };

  // Thêm thủ công 1 câu hỏi
  const handleAddManualQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPrompt.trim()) return;

    const newQ: BankQuestionTemplate = {
      id: `manual_${Date.now()}`,
      subject: 'Toán',
      grade: manualGrade,
      topicKeywords: ['Toán THCS', `Khối ${manualGrade}`],
      section: manualSection,
      type:
        manualSection === 'part1_mcq'
          ? 'multiple_choice'
          : manualSection === 'part2_true_false'
          ? 'true_false'
          : manualSection === 'part3_short_answer'
          ? 'short_answer'
          : 'essay',
      cognitiveLevel: manualLevel,
      prompt: manualPrompt.trim(),
      options:
        manualSection === 'part1_mcq'
          ? [
              { key: 'A', text: manualOptA || 'Phương án A' },
              { key: 'B', text: manualOptB || 'Phương án B' },
              { key: 'C', text: manualOptC || 'Phương án C' },
              { key: 'D', text: manualOptD || 'Phương án D' },
            ]
          : undefined,
      correctOption: manualSection === 'part1_mcq' ? manualCorrectOpt : undefined,
      solutionExplanation: manualSolution.trim() || 'Lời giải chi tiết.',
      learningObjective: `Nắm vững kiến thức toán học Khối ${manualGrade}.`,
      source: 'uploaded',
      sourceFileName: 'Nhập thủ công',
      createdAt: new Date().toISOString(),
    };

    const updated = await addQuestionsToBank([newQ], auth.currentUser?.uid);
    setQuestions(updated);
    onQuestionsUpdated?.(updated);
    setManualPrompt('');
    setManualOptA('');
    setManualOptB('');
    setManualOptC('');
    setManualOptD('');
    setManualSolution('');
    setSuccessMessage('Đã thêm câu hỏi vào ngân hàng thành công!');
    setTimeout(() => {
      setActiveTab('browse');
      setSuccessMessage('');
    }, 1000);
  };

  // Tải file Word mẫu
  const handleDownloadSample = () => {
    const text = generateSampleTextContent();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'mau_ngan_hang_cau_hoi_toan_thcs.txt');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Ngân hàng Câu hỏi Tham khảo Kết hợp AI Soạn Đề
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  Phân loại Khối 6-9
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Tải lên câu hỏi Word/Excel/JSON để hệ thống tự động ghi nhận, phân loại và kết hợp nguồn hoàn chỉnh cùng AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS & ACTIONS */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Kho Ngân hàng ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              Tải lên & Nhận diện
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              Tạo câu hỏi Online
            </button>
            <button
              onClick={() => setActiveTab('screenshot')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'screenshot'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Dán ảnh chụp màn hình trực tiếp bằng Ctrl+V hoặc tải ảnh lên"
            >
              <Camera className="w-4 h-4 text-rose-600" />
              <span>Dán ảnh màn hình chụp</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                Ctrl+V
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
              title="Tải văn bản mẫu để soạn đúng cấu trúc nhận diện"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Tải mẫu câu hỏi
            </button>
            {questions.length > 0 && (
              <>
                <button
                  onClick={() => exportQuestionBankToDocx(questions)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-sm"
                  title="Xuất danh sách câu hỏi ra Word"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Xuất Word (.docx)
                </button>
                <button
                  onClick={() => exportQuestionBankToJSON(questions)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-300 hover:bg-indigo-100 transition-colors shadow-sm"
                  title="Xuất file JSON sao lưu"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  Xuất JSON
                </button>
                <button
                  onClick={handleClearAll}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                  title="Xóa toàn bộ câu hỏi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* THÔNG BÁO THÀNH CÔNG */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* CONTENT TABS */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: KHO NGÂN HÀNG & PHÂN LOẠI */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              
              {/* THANH THỐNG KÊ NHANH THEO KHỐI */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => setSelectedGrade('all')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGrade === 'all'
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500">Tất cả khối lớp</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">{questions.length} <span className="text-xs font-normal text-slate-500">câu</span></div>
                </button>
                <button
                  onClick={() => setSelectedGrade('6')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGrade === '6'
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>Khối 6</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  </div>
                  <div className="text-xl font-bold text-indigo-700 mt-1">{countGrade6} <span className="text-xs font-normal text-slate-500">câu</span></div>
                </button>
                <button
                  onClick={() => setSelectedGrade('7')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGrade === '7'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>Khối 7</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">{countGrade7} <span className="text-xs font-normal text-slate-500">câu</span></div>
                </button>
                <button
                  onClick={() => setSelectedGrade('8')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGrade === '8'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>Khối 8</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                  <div className="text-xl font-bold text-amber-700 mt-1">{countGrade8} <span className="text-xs font-normal text-slate-500">câu</span></div>
                </button>
                <button
                  onClick={() => setSelectedGrade('9')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGrade === '9'
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>Khối 9</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="text-xl font-bold text-rose-700 mt-1">{countGrade9} <span className="text-xs font-normal text-slate-500">câu</span></div>
                </button>
              </div>

              {/* BỘ LỌC TÌM KIẾM VÀ DẠNG CÂU HỎI */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo từ khóa câu hỏi, nội dung, chủ đề hoặc lời giải..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Lọc dạng câu hỏi */}
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700"
                >
                  <option value="all">Tất cả dạng câu hỏi</option>
                  <option value="part1_mcq">Phần I: TN 4 lựa chọn</option>
                  <option value="part2_true_false">Phần II: Đúng / Sai 4 ý</option>
                  <option value="part3_short_answer">Phần III: Trả lời ngắn</option>
                  <option value="part4_essay">Phần IV: Tự luận</option>
                </select>

                {/* Lọc mức độ nhận thức */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="nhanBiet">Nhận biết</option>
                  <option value="thongHieu">Thông hiểu</option>
                  <option value="vanDung">Vận dụng</option>
                  <option value="vanDungCao">Vận dụng cao</option>
                </select>

                <div className="text-xs text-slate-500 font-medium">
                  Hiển thị: <span className="font-bold text-slate-800">{filteredQuestions.length}</span> / {questions.length} câu
                </div>
              </div>

              {/* DANH SÁCH CÂU HỎI */}
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700">Chưa có câu hỏi nào trong mục này</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    Thầy/Cô có thể tải lên file Word (.docx), Excel (.xlsx) hoặc dán văn bản câu hỏi vào tab "Tải lên & Nhận diện".
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Tải lên câu hỏi ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((q, idx) => {
                    const gradeColor =
                      q.grade === '6'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : q.grade === '7'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : q.grade === '8'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';

                    const levelColor =
                      q.cognitiveLevel === 'nhanBiet'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : q.cognitiveLevel === 'thongHieu'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : q.cognitiveLevel === 'vanDung'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200';

                    const levelLabel =
                      q.cognitiveLevel === 'nhanBiet'
                        ? 'Nhận biết'
                        : q.cognitiveLevel === 'thongHieu'
                        ? 'Thông hiểu'
                        : q.cognitiveLevel === 'vanDung'
                        ? 'Vận dụng'
                        : 'Vận dụng cao';

                    const sectionLabel =
                      q.section === 'part1_mcq'
                        ? 'Phần I: TN 4 lựa chọn'
                        : q.section === 'part2_true_false'
                        ? 'Phần II: Đúng / Sai 4 ý'
                        : q.section === 'part3_short_answer'
                        ? 'Phần III: Trả lời ngắn'
                        : 'Phần IV: Tự luận';

                    return (
                      <div
                        key={q.id || idx}
                        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-all group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${gradeColor}`}>
                              Khối {q.grade}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {sectionLabel}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${levelColor}`}>
                              {levelLabel}
                            </span>
                            {q.mathDomainLabel && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {q.mathDomainLabel}
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Nguồn tham khảo
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-80 group-hover:opacity-100"
                              title="Xóa câu hỏi khỏi ngân hàng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* NỘI DUNG CÂU HỎI */}
                        <div
                          className="text-sm font-medium text-slate-800 mb-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderLatexToHtml(q.prompt) }}
                        />

                        {/* PHẦN 1: MCQ */}
                        {q.section === 'part1_mcq' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                            {q.options.map((opt) => {
                              const isCorrect = opt.key === q.correctOption;
                              return (
                                <div
                                  key={opt.key}
                                  className={`p-2 rounded-lg text-xs flex items-start gap-2 border ${
                                    isCorrect
                                      ? 'bg-emerald-50/80 border-emerald-300 font-semibold text-emerald-900 shadow-sm'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded flex items-center justify-center font-bold shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  <span
                                    className="leading-snug pt-0.5"
                                    dangerouslySetInnerHTML={{ __html: renderLatexToHtml(opt.text) }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* PHẦN 2: ĐÚNG / SAI */}
                        {q.section === 'part2_true_false' && q.tfStatements && (
                          <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-100">
                            {q.tfStatements.map((st) => (
                              <div
                                key={st.subKey}
                                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-slate-700">{st.subKey})</span>
                                  <span
                                    className="text-slate-800"
                                    dangerouslySetInnerHTML={{ __html: renderLatexToHtml(st.text) }}
                                  />
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                    st.isCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {st.isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* PHẦN 3: TRẢ LỜI NGẮN */}
                        {q.section === 'part3_short_answer' && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs flex items-center gap-2">
                            <span className="font-bold text-slate-600">Đáp số chính xác:</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 font-bold text-emerald-800 border border-emerald-300">
                              {q.shortAnswerText || 'Chưa cập nhật'}
                            </span>
                          </div>
                        )}

                        {/* LỜI GIẢI CHI TIẾT */}
                        {q.solutionExplanation && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
                            <span className="font-bold text-emerald-700">Lời giải chi tiết: </span>
                            <span
                              className="leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: renderLatexToHtml(q.solutionExplanation) }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TẢI LÊN & NHẬN DIỆN THÔNG MINH */}
          {activeTab === 'upload' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* LỰA CHỌN KHỐI LỚP MẶC ĐỊNH */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Cấu hình phân loại theo khối lớp</h4>
                    <p className="text-xs text-slate-600">
                      Hệ thống tự động đọc từ khóa nội dung để xếp vào Khối 6, 7, 8, 9 hoặc dùng chỉ định dưới đây:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700">Khối ưu tiên:</label>
                  <select
                    value={defaultGradeForUpload}
                    onChange={(e) => setDefaultGradeForUpload(e.target.value)}
                    className="text-xs font-bold bg-white border border-blue-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-blue-900 shadow-sm"
                  >
                    <option value="auto">✨ Tự động nhận diện theo nội dung</option>
                    <option value="6">Toán Khối 6</option>
                    <option value="7">Toán Khối 7</option>
                    <option value="8">Toán Khối 8</option>
                    <option value="9">Toán Khối 9</option>
                  </select>
                </div>
              </div>

              {/* KHU VỰC KÉO THẢ FILE */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-8 text-center cursor-pointer transition-all shadow-sm group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.xlsx,.xls,.csv,.txt,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform text-blue-600">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {uploadFile ? uploadFile.name : 'Chọn file hoặc kéo thả tài liệu câu hỏi vào đây'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Hỗ trợ định dạng Word (<span className="font-semibold text-blue-600">.docx</span>), Excel (
                  <span className="font-semibold text-emerald-600">.xlsx, .xls</span>), Plain Text (
                  <span className="font-semibold text-slate-700">.txt</span>), hoặc JSON.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tự nhận dạng A, B, C, D
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đúng / Sai 4 ý
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Công thức Toán LaTeX
                  </span>
                </div>
              </div>

              {/* HOẶC DÁN TRỰC TIẾP VĂN BẢN */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Hoặc dán văn bản câu hỏi trực tiếp (Copy từ Word / PDF):
                  </label>
                  <button
                    onClick={handleDownloadSample}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Xem định dạng mẫu
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder={`Ví dụ:\nCâu 1: [NB] Căn bậc hai số học của 49 là:\nA. 7\nB. -7\nC. 49\nD. 14\nĐáp án: A\nLời giải: Căn bậc hai số học là 7.`}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full text-xs p-3 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleParseRawText}
                    disabled={isParsing || !rawText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    {isParsing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Phân tích & Trích xuất câu hỏi
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* HIỂN THỊ LỖI NẾU CÓ */}
              {parseErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Lưu ý khi phân tích file:
                  </div>
                  {parseErrors.map((err, i) => (
                    <div key={i} className="pl-5 list-disc">{err}</div>
                  ))}
                </div>
              )}

              {/* PREVIEW KẾT QUẢ TRÍCH XUẤT */}
              {parsedPreview.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-lg space-y-4 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Đã trích xuất thành công {parsedPreview.length} câu hỏi
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kiểm tra nhanh danh sách phân loại trước khi lưu vào ngân hàng chính thức
                      </p>
                    </div>

                    <button
                      onClick={handleSaveParsedQuestions}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Lưu {parsedPreview.length} câu vào Ngân hàng tham khảo
                    </button>
                  </div>

                  {/* DANH SÁCH PREVIEW NHANH */}
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {parsedPreview.map((q, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">Câu {i + 1}:</span>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                              Khối {q.grade}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[10px]">
                              {q.section}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium text-[10px]">
                              {q.cognitiveLevel}
                            </span>
                          </div>
                          {q.correctOption && (
                            <span className="font-bold text-emerald-700">Đáp án: {q.correctOption}</span>
                          )}
                        </div>
                        <div
                          className="text-slate-800 font-medium"
                          dangerouslySetInnerHTML={{ __html: renderLatexToHtml(q.prompt) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THÊM CÂU HỎI THỦ CÔNG */}
          {activeTab === 'manual' && (
            <form onSubmit={handleAddManualQuestion} className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Thêm câu hỏi mới vào ngân hàng tham khảo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Khối lớp:</label>
                  <select
                    value={manualGrade}
                    onChange={(e) => setManualGrade(e.target.value)}
                    className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="6">Toán Khối 6</option>
                    <option value="7">Toán Khối 7</option>
                    <option value="8">Toán Khối 8</option>
                    <option value="9">Toán Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Dạng thức câu hỏi:</label>
                  <select
                    value={manualSection}
                    onChange={(e) => setManualSection(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="part1_mcq">Phần I: TN 4 lựa chọn (MCQ)</option>
                    <option value="part2_true_false">Phần II: Đúng / Sai 4 ý</option>
                    <option value="part3_short_answer">Phần III: Trả lời ngắn</option>
                    <option value="part4_essay">Phần IV: Tự luận</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                  <select
                    value={manualLevel}
                    onChange={(e) => setManualLevel(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="nhanBiet">Nhận biết</option>
                    <option value="thongHieu">Thông hiểu</option>
                    <option value="vanDung">Vận dụng</option>
                    <option value="vanDungCao">Vận dụng cao</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nội dung câu hỏi (Hỗ trợ công thức LaTeX $...$):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập đề bài câu hỏi..."
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {manualSection === 'part1_mcq' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700">4 Phương án trả lời & Đáp án đúng:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                        A
                      </span>
                      <input
                        type="text"
                        placeholder="Phương án A"
                        value={manualOptA}
                        onChange={(e) => setManualOptA(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                        B
                      </span>
                      <input
                        type="text"
                        placeholder="Phương án B"
                        value={manualOptB}
                        onChange={(e) => setManualOptB(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                        C
                      </span>
                      <input
                        type="text"
                        placeholder="Phương án C"
                        value={manualOptC}
                        onChange={(e) => setManualOptC(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                        D
                      </span>
                      <input
                        type="text"
                        placeholder="Phương án D"
                        value={manualOptD}
                        onChange={(e) => setManualOptD(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700">Chọn phương án đúng:</label>
                    <select
                      value={manualCorrectOpt}
                      onChange={(e) => setManualCorrectOpt(e.target.value as any)}
                      className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      <option value="D">Phương án D</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Lời giải chi tiết & Hướng dẫn chấm:
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập hướng dẫn giải chi tiết..."
                  value={manualSolution}
                  onChange={(e) => setManualSolution(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Thêm vào ngân hàng
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DÁN TỪ MÀN HÌNH CHỤP (CLIPBOARD / SCREENSHOT OCR) */}
          {activeTab === 'screenshot' && (
            <div className="space-y-4">
              {/* Header Guidance */}
              <div className="p-4 bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs mt-0.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Nhận diện Câu hỏi từ Màn hình chụp & Ảnh đề thi</span>
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Phím tắt: Ctrl + V
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Chụp màn hình câu hỏi (phím <strong>Win + Shift + S</strong> hoặc <strong>PrintScreen</strong>), sau đó nhấn <strong>Ctrl + V</strong> trực tiếp để hệ thống trích xuất công thức Toán và lời giải.
                    </p>
                  </div>
                </div>

                {/* Grade Selector for Screenshot */}
                <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl border border-rose-200/80 shrink-0">
                  <span className="text-xs text-slate-600 font-semibold pl-1.5">Khối:</span>
                  {['6', '7', '8', '9'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setScreenshotOcrGrade(g);
                        if (screenshotImage) {
                          handleRunScreenshotOcr(screenshotImage, undefined, g);
                        }
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        screenshotOcrGrade === g
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-rose-100'
                      }`}
                    >
                      K{g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paste & Drop Zone */}
              <input
                type="file"
                ref={screenshotFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessScreenshotFile(file);
                }}
              />

              {!screenshotImage ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      handleProcessScreenshotFile(file);
                    }
                  }}
                  onClick={() => screenshotFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDraggingOver
                      ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
                      : 'border-slate-300 hover:border-rose-400 hover:bg-rose-50/20 bg-slate-50/60'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-inner">
                    <ClipboardPaste className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Nhấn Ctrl + V để dán ảnh chụp màn hình ngay tại đây
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Hoặc kéo thả file ảnh (.png, .jpg, .webp) vào đây hoặc bấm để chọn tệp từ máy tính.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-white hover:bg-slate-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs"
                  >
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>Chọn tệp ảnh từ máy tính</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Left Column: Image Preview */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ảnh chụp màn hình đã nạp</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRunScreenshotOcr(screenshotImage, undefined, screenshotOcrGrade)}
                          disabled={isScreenshotOcrLoading}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1"
                          title="Nhận diện lại câu hỏi"
                        >
                          <RefreshCw className={`w-3 h-3 ${isScreenshotOcrLoading ? 'animate-spin' : ''}`} />
                          <span>Quét lại</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotImage(null);
                            setScreenshotParsedQuestions([]);
                            setScreenshotError(null);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        >
                          Đổi ảnh khác
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[460px] overflow-auto rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-1">
                      <img
                        src={screenshotImage}
                        alt="Ảnh chụp màn hình đề thi"
                        className="max-w-full h-auto rounded-lg shadow-2xs object-contain"
                      />
                    </div>
                  </div>

                  {/* Right Column: OCR Results */}
                  <div className="lg:col-span-7 space-y-3">
                    {isScreenshotOcrLoading ? (
                      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3 shadow-xs">
                        <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            Đang nhận diện câu hỏi từ ảnh chụp màn hình...
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Hệ thống đang trích xuất công thức Toán học, các phương án A/B/C/D và mức độ nhận thức.
                          </p>
                        </div>
                      </div>
                    ) : screenshotError ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2 shadow-xs">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Thông báo nhận diện ảnh</span>
                        </div>
                        <p className="text-xs text-amber-800">{screenshotError}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRunScreenshotOcr(screenshotImage, undefined, screenshotOcrGrade)}
                            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold"
                          >
                            Thử nhận diện lại
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setManualGrade(screenshotOcrGrade);
                              setActiveTab('manual');
                            }}
                            className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100"
                          >
                            Nhập câu hỏi thủ công
                          </button>
                        </div>
                      </div>
                    ) : screenshotParsedQuestions.length > 0 ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-900">
                              Đã nhận diện được {screenshotParsedQuestions.length} câu hỏi (Khối {screenshotOcrGrade})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = await addQuestionsToBank(screenshotParsedQuestions, auth.currentUser?.uid);
                              setQuestions(updated);
                              onQuestionsUpdated?.(updated);
                              setSuccessMessage(`Đã thêm thành công ${screenshotParsedQuestions.length} câu hỏi từ ảnh chụp vào Ngân hàng!`);
                              setScreenshotParsedQuestions([]);
                              setScreenshotImage(null);
                              setTimeout(() => {
                                setActiveTab('browse');
                                setSuccessMessage('');
                              }, 1200);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Lưu tất cả vào Ngân hàng</span>
                          </button>
                        </div>

                        {/* List of recognized questions */}
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {screenshotParsedQuestions.map((q, qIdx) => (
                            <div
                              key={q.id || qIdx}
                              className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                                    Câu {qIdx + 1}
                                  </span>
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                                    {q.section === 'part1_mcq'
                                      ? 'Trắc nghiệm 4 lựa chọn'
                                      : q.section === 'part2_true_false'
                                      ? 'Trắc nghiệm Đúng/Sai'
                                      : q.section === 'part3_short_answer'
                                      ? 'Trả lời ngắn'
                                      : 'Tự luận'}
                                  </span>
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-medium border border-blue-200">
                                    {q.cognitiveLevel === 'nhanBiet'
                                      ? 'Nhận biết'
                                      : q.cognitiveLevel === 'thongHieu'
                                      ? 'Thông hiểu'
                                      : q.cognitiveLevel === 'vanDung'
                                      ? 'Vận dụng'
                                      : 'Vận dụng cao'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const updated = await addQuestionsToBank([q], auth.currentUser?.uid);
                                    setQuestions(updated);
                                    onQuestionsUpdated?.(updated);
                                    setScreenshotParsedQuestions((prev) => prev.filter((_, i) => i !== qIdx));
                                    setSuccessMessage(`Đã thêm Câu ${qIdx + 1} vào Ngân hàng!`);
                                    setTimeout(() => setSuccessMessage(''), 2000);
                                  }}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md font-semibold text-[11px] border border-blue-200 transition-colors"
                                >
                                  Lưu câu này
                                </button>
                              </div>

                              {/* Question prompt with LaTeX rendering */}
                              <div
                                className="text-slate-800 font-medium leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100"
                                dangerouslySetInnerHTML={{
                                  __html: renderLatexToHtml(q.prompt || ''),
                                }}
                              />

                              {/* Options if MCQ */}
                              {q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                  {q.options.map((opt) => (
                                    <div
                                      key={opt.key}
                                      className={`p-2 rounded-lg border text-[11.5px] flex items-start gap-1.5 ${
                                        q.correctOption === opt.key
                                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                                          : 'bg-white border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10.5px] font-bold shrink-0 ${
                                        q.correctOption === opt.key ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                      }`}>
                                        {opt.key}
                                      </span>
                                      <span
                                        className="flex-1"
                                        dangerouslySetInnerHTML={{
                                          __html: renderLatexToHtml(opt.text || ''),
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Solution explanation */}
                              {q.solutionExplanation && (
                                <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                                  <strong className="text-amber-900 block font-semibold mb-0.5">Lời giải / Hướng dẫn:</strong>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: renderLatexToHtml(q.solutionExplanation),
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 bg-slate-100/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Khi soạn đề theo ma trận, AI sẽ ưu tiên lựa chọn câu hỏi phù hợp nhất từ ngân hàng tham khảo này theo đúng khối lớp và YCCĐ.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
