import React, { useState, useRef } from 'react';
import {
  HelpCircle,
  BookOpen,
  Target,
  Sparkles,
  RefreshCw,
  Edit3,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ExamQuestion } from '../../types';
import { LatexRenderer } from '../../utils/latexUtils';

interface QuestionGuidanceTooltipProps {
  question: ExamQuestion;
  questionIndex: number;
  onRegenerateEquivalent?: (question: ExamQuestion) => void;
  onOpenSuggestions?: (question: ExamQuestion) => void;
  onEditQuestion?: (question: ExamQuestion) => void;
  showRawLatex?: boolean;
}

export const QuestionGuidanceTooltip: React.FC<QuestionGuidanceTooltipProps> = ({
  question,
  questionIndex,
  onRegenerateEquivalent,
  onOpenSuggestions,
  onEditQuestion,
  showRawLatex = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const cogBadgeClasses = {
    nhanBiet: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    thongHieu: 'bg-blue-50 text-blue-800 border-blue-200',
    vanDung: 'bg-amber-50 text-amber-900 border-amber-200',
    vanDungCao: 'bg-purple-50 text-purple-800 border-purple-200',
  }[question.cognitiveLevel] || 'bg-slate-50 text-slate-800 border-slate-200';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${cogBadgeClasses} hover:ring-2 hover:ring-indigo-300`}
        title="Rê chuột để xem Yêu cầu cần đạt (YCCĐ) và Chủ đề của câu này"
      >
        <Target className="w-3 h-3 shrink-0" />
        <span>{question.cognitiveLevelLabel || question.cognitiveLevel}</span>
        <span className="text-[10px] opacity-75">({question.score}đ)</span>
      </button>

      {/* Popover Card Guidance */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 top-full mt-1.5 w-80 sm:w-96 p-3.5 bg-white rounded-xl shadow-xl border border-slate-300 text-slate-800 font-sans text-xs animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Chỉ dẫn sư phạm Câu {questionIndex}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${cogBadgeClasses}`}>
                  {question.cognitiveLevelLabel}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="truncate">{question.chapter || 'Toán học'}</span>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">{question.lesson || 'Kiến thức trọng tâm'}</span>
              </div>
            </div>
          </div>

          {/* Body: Yêu cầu cần đạt */}
          <div className="my-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Yêu cầu cần đạt (YCCĐ chuẩn GDPT 2018):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed italic pl-4">
              {question.learningObjective ||
                `${question.cognitiveLevelLabel} kiến thức trọng tâm về ${question.lesson || 'bài học'} theo khung Ma trận & Bảng đặc tả.`}
            </p>
          </div>

          {/* Đáp án tóm tắt */}
          <div className="mb-2.5 p-2 bg-emerald-50/60 rounded-lg border border-emerald-200 text-[11px] text-slate-700">
            <div className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đáp án & Lời giải:</span>
            </div>
            {question.section === 'part1_mcq' && question.correctOption && (
              <div className="font-semibold text-emerald-800 pl-4">
                Đáp án đúng: <span className="text-xs font-bold underline text-emerald-950">{question.correctOption}</span>
                {question.options && (
                  <span className="font-normal text-slate-600 ml-1">
                    ({question.options.find((o) => o.key === question.correctOption)?.text})
                  </span>
                )}
              </div>
            )}
            {question.section === 'part2_true_false' && question.tfStatements && (
              <div className="grid grid-cols-2 gap-1 pl-4 font-semibold text-slate-700">
                {question.tfStatements.map((st) => (
                  <span key={st.subKey}>
                    Ý {st.subKey}):{' '}
                    <strong className={st.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                      {st.isCorrect ? 'Đúng' : 'Sai'}
                    </strong>
                  </span>
                ))}
              </div>
            )}
            {question.section === 'part3_short_answer' && question.shortAnswerText && (
              <div className="font-semibold text-emerald-800 pl-4">
                Kết quả điền: <strong className="text-emerald-950">{question.shortAnswerText}</strong>
              </div>
            )}
            {question.section === 'part4_essay' && question.essayGradingSteps && (
              <div className="text-slate-600 pl-4">
                Barem: {question.essayGradingSteps.length} bước tính ({question.score}đ)
              </div>
            )}
            {question.solutionExplanation && (
              <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-2 pl-4">
                HD: {question.solutionExplanation}
              </p>
            )}
          </div>

          {/* Actions: Tùy chọn câu hỏi cụ thể */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium">Tùy chọn câu này:</span>
            <div className="flex items-center gap-1">
              {onOpenSuggestions && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSuggestions(question);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold transition-colors cursor-pointer"
                  title="Chọn câu khác từ Ngân hàng gợi ý"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Chọn câu khác</span>
                </button>
              )}

              {onRegenerateEquivalent && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onRegenerateEquivalent(question);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  title="Đổi câu tương đương (tự động cập nhật đáp án)"
                >
                  <RefreshCw className="w-3 h-3 text-slate-600" />
                  <span>Đổi câu</span>
                </button>
              )}

              {onEditQuestion && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onEditQuestion(question);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  title="Sửa nội dung câu và đáp án thủ công"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Sửa</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
