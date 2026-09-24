import {
  TimeframeConfig,
  PpctDataset,
  ExamEvent,
  MatrixRow,
  SpecificationRow,
  SpecificationItem,
  TopicPointCalc,
  PpctReferenceItem,
  CognitiveLevel,
  SgkBook,
} from '../types';
import { getLearningObjectiveForTopic, findMatchingSgkLesson } from './sgkParser';

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateVN(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatTimeVN(date: Date): string {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function getDayOfWeekVN(date: Date): string {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  return days[date.getDay()];
}

export function formatFullDateTimeVN(date: Date): string {
  return `${getDayOfWeekVN(date)}, ngày ${formatDateVN(date)} lúc ${formatTimeVN(date)}`;
}

export function getTodayDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultStartDateWeek1(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0 is Jan, 8 is Sept
  // If Jan-July, school year started in Sept of previous year; if Aug-Dec, starts in Sept of current year
  const schoolYear = month >= 7 ? year : year - 1;
  const sept1 = new Date(schoolYear, 8, 1);
  const dayOfWeek = sept1.getDay(); // 0 is Sun, 1 is Mon
  const daysUntilMonday = dayOfWeek === 1 ? 0 : (dayOfWeek === 0 ? 1 : 8 - dayOfWeek);
  const firstMonday = new Date(schoolYear, 8, 1 + daysUntilMonday);

  const y = firstMonday.getFullYear();
  const m = (firstMonday.getMonth() + 1).toString().padStart(2, '0');
  const d = firstMonday.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekDateRange(startDateWeek1Str: string, weekNumber: number) {
  const startDate = parseDate(startDateWeek1Str);
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5); // Monday to Saturday (Vietnam school week)

  return { weekStart, weekEnd };
}

export function calculateCurrentWeek(startDateWeek1Str: string, currentDateStr: string): {
  week: number;
  term: 1 | 2;
  isBeforeTerm: boolean;
} {
  const start = parseDate(startDateWeek1Str);
  const current = parseDate(currentDateStr);

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { week: 0, term: 1, isBeforeTerm: true };
  }

  const week = Math.floor(diffDays / 7) + 1;
  const term = week <= 18 ? 1 : 2;
  return { week, term, isBeforeTerm: false };
}

// Tính ngày bắt đầu Tuần 1 từ ngày áp dụng và số tuần của TKB
export function deriveStartDateWeek1(appliedDate?: string, appliedWeek: number = 1): string {
  if (!appliedDate) return '2026-09-07';
  const app = parseDate(appliedDate);
  const weekOffset = Math.max(0, appliedWeek - 1);
  const week1Time = app.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000;
  const w1Date = new Date(week1Time);
  const y = w1Date.getFullYear();
  const m = (w1Date.getMonth() + 1).toString().padStart(2, '0');
  const d = w1Date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateDaysRemaining(targetDate: Date, currentDateStr: string): number {
  const current = parseDate(currentDateStr);
  const diffTime = targetDate.getTime() - current.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateExamSchedule(
  config: TimeframeConfig,
  ppct: PpctDataset
): ExamEvent[] {
  // If custom events are provided, use them
  if (config.customEvents && config.customEvents.length > 0) {
    return config.customEvents.map((ev) => {
      const { weekStart, weekEnd } = getWeekDateRange(config.startDateWeek1, ev.week);
      const isPeriodic = ev.type === 'giua_ky' || ev.type === 'cuoi_ky';
      
      let exactDateText = ev.customExactDateText || '';
      let targetDateForCountdown: Date;

      if (!exactDateText) {
        if (isPeriodic) {
          const offsetDays = Math.max(0, (config.examStartDayOfWeek || 5) - 2);
          const examDay1 = new Date(weekStart);
          examDay1.setDate(weekStart.getDate() + offsetDays);

          const examDay2 = new Date(examDay1);
          examDay2.setDate(examDay1.getDate() + (config.examDurationDays - 1 || 1));

          const day1VN = `Thứ ${config.examStartDayOfWeek} ${formatDateVN(examDay1)}`;
          const day2VN = `Thứ ${config.examStartDayOfWeek + 1} ${formatDateVN(examDay2)}`;
          exactDateText = `${day1VN} và ${day2VN}`;
          targetDateForCountdown = examDay1;
        } else {
          exactDateText = `Trong tuần ${ev.week} (${formatDateVN(weekStart)} – ${formatDateVN(weekEnd)})`;
          targetDateForCountdown = weekStart;
        }
      } else {
        targetDateForCountdown = weekStart;
      }

      const daysRemaining = calculateDaysRemaining(targetDateForCountdown, config.currentDate);

      const [wStart, wEnd] = ev.customScopeWeeks || [
        ev.term === 1 ? 1 : (config.totalWeeksHK1 || 18) + 1,
        ev.week
      ];

      const scopeLessons = ppct.lessons.filter(
        (l) => l.tuan >= wStart && l.tuan <= wEnd
      );

      const chapterMap = new Map<string, string[]>();
      scopeLessons.forEach((l) => {
        const list = chapterMap.get(l.chuong) || [];
        list.push(l.baiHoc);
        chapterMap.set(l.chuong, list);
      });

      const chapterSummaries = Array.from(chapterMap.entries()).map(([chapter, lessons]) => ({
        chapter,
        lessons,
      }));

      return {
        id: ev.id,
        term: ev.term,
        title: ev.title,
        type: ev.type,
        week: ev.week,
        exactDateText,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        daysRemaining,
        isPast: daysRemaining < 0,
        isCurrent: daysRemaining >= 0 && daysRemaining <= 7,
        suggestedScope: `Phạm vi: tuần ${wStart}–${wEnd}`,
        lessonCount: scopeLessons.length,
        chapterSummaries,
      };
    });
  }

  // Dynamic builder based on configuration
  const kttxWeeksHK1 = config.kttxWeeksHK1 || [3, 6, 11, 14];
  const kttxWeeksHK2 = config.kttxWeeksHK2 || [21, 23, 29, 31];
  const countHK1 = Math.min(kttxWeeksHK1.length, config.kttxCountPerTerm || 4);
  const countHK2 = Math.min(kttxWeeksHK2.length, config.kttxCountPerTerm || 4);

  const rawEvents: Array<{
    id: string;
    term: 1 | 2;
    title: string;
    type: 'kttx' | 'giua_ky' | 'cuoi_ky';
    week: number;
    scopeWeeks: [number, number];
  }> = [];

  // HK1 KTTX and Exams
  const midHK1 = config.midtermWeekHK1 || 9;
  const finHK1 = config.finalWeekHK1 || 18;

  let prevWeekHK1 = 1;
  for (let i = 0; i < countHK1; i++) {
    const currentWeek = kttxWeeksHK1[i] || (i + 1) * 3;
    rawEvents.push({
      id: `kttx-${i + 1}-hk1`,
      term: 1,
      title: `KT thường xuyên ${i + 1} — HK I`,
      type: 'kttx',
      week: currentWeek,
      scopeWeeks: [prevWeekHK1, currentWeek],
    });
    prevWeekHK1 = Math.max(1, currentWeek);
  }

  // Add Midterm HK1
  rawEvents.push({
    id: 'gk-hk1',
    term: 1,
    title: 'Kiểm tra giữa học kỳ I',
    type: 'giua_ky',
    week: midHK1,
    scopeWeeks: [1, midHK1],
  });

  // Add Final HK1
  rawEvents.push({
    id: 'ck-hk1',
    term: 1,
    title: 'Kiểm tra cuối học kỳ I',
    type: 'cuoi_ky',
    week: finHK1,
    scopeWeeks: [1, finHK1],
  });

  // HK2 KTTX and Exams
  const hk2StartWeek = (config.totalWeeksHK1 || 18) + 1;
  const midHK2 = config.midtermWeekHK2 || 26;
  const finHK2 = config.finalWeekHK2 || 33;

  let prevWeekHK2 = hk2StartWeek;
  for (let i = 0; i < countHK2; i++) {
    const currentWeek = kttxWeeksHK2[i] || hk2StartWeek + (i * 3) + 2;
    rawEvents.push({
      id: `kttx-${i + 1}-hk2`,
      term: 2,
      title: `KT thường xuyên ${i + 1} — HK II`,
      type: 'kttx',
      week: currentWeek,
      scopeWeeks: [prevWeekHK2, currentWeek],
    });
    prevWeekHK2 = Math.max(hk2StartWeek, currentWeek);
  }

  // Add Midterm HK2
  rawEvents.push({
    id: 'gk-hk2',
    term: 2,
    title: 'Kiểm tra giữa học kỳ II',
    type: 'giua_ky',
    week: midHK2,
    scopeWeeks: [hk2StartWeek, midHK2],
  });

  // Add Final HK2
  rawEvents.push({
    id: 'ck-hk2',
    term: 2,
    title: 'Kiểm tra cuối học kỳ II',
    type: 'cuoi_ky',
    week: finHK2,
    scopeWeeks: [hk2StartWeek, finHK2],
  });

  // Sort by term and week
  rawEvents.sort((a, b) => {
    if (a.term !== b.term) return a.term - b.term;
    return a.week - b.week;
  });

  return rawEvents.map((ev) => {
    const { weekStart, weekEnd } = getWeekDateRange(config.startDateWeek1, ev.week);

    let exactDateText = '';
    let targetDateForCountdown: Date;

    if (ev.type === 'giua_ky' || ev.type === 'cuoi_ky') {
      const offsetDays = Math.max(0, (config.examStartDayOfWeek || 5) - 2);
      const examDay1 = new Date(weekStart);
      examDay1.setDate(weekStart.getDate() + offsetDays);

      const examDay2 = new Date(examDay1);
      examDay2.setDate(examDay1.getDate() + (config.examDurationDays - 1 || 1));

      const day1VN = `Thứ ${config.examStartDayOfWeek} ${formatDateVN(examDay1)}`;
      const day2VN = `Thứ ${config.examStartDayOfWeek + 1} ${formatDateVN(examDay2)}`;
      exactDateText = `${day1VN} và ${day2VN}`;
      targetDateForCountdown = examDay1;
    } else {
      exactDateText = `Trong tuần ${ev.week} (${formatDateVN(weekStart)} – ${formatDateVN(weekEnd)})`;
      targetDateForCountdown = weekStart;
    }

    const daysRemaining = calculateDaysRemaining(targetDateForCountdown, config.currentDate);

    // Extract lessons in scope
    const [wStart, wEnd] = ev.scopeWeeks;
    const scopeLessons = ppct.lessons.filter(
      (l) => l.tuan >= wStart && l.tuan <= wEnd
    );

    // Group lessons by chapter
    const chapterMap = new Map<string, string[]>();
    scopeLessons.forEach((l) => {
      const list = chapterMap.get(l.chuong) || [];
      list.push(l.baiHoc);
      chapterMap.set(l.chuong, list);
    });

    const chapterSummaries = Array.from(chapterMap.entries()).map(([chapter, lessons]) => ({
      chapter,
      lessons,
    }));

    return {
      id: ev.id,
      term: ev.term,
      title: ev.title,
      type: ev.type,
      week: ev.week,
      exactDateText,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      daysRemaining,
      isPast: daysRemaining < 0,
      isCurrent: daysRemaining >= 0 && daysRemaining <= 7,
      suggestedScope: `Phạm vi: tuần ${wStart}–${wEnd}`,
      lessonCount: scopeLessons.length,
      chapterSummaries,
    };
  });
}

export interface NonTestableCheckResult {
  isNonTestable: boolean;
  reason?: string;
  category?: 'exam' | 'return_paper' | 'activity' | 'software' | 'review_exam' | 'admin';
  cleanedTopic: string;
}

/**
 * Kiểm tra xem một chuỗi có chứa mã năng lực số (NLS) hoặc các mô tả công nghệ
 * (như GeoGebra, MindMeister, Canva, Quizizz, Padlet, Kahoot, 3.1TC2a, 2.2.NC1a...) hay không.
 */
export function isTechCompetenceText(text: string): boolean {
  if (!text) return false;
  const t = text.trim();
  // Khung năng lực số mã hiệu dạng: 3.1TC2a, 5.3TC2a, 2.2.NC1a, 1.2TC, 4.3NC...
  if (/\b\d+\.\d+(?:\.\w+)?(?:TC|NC|tc|nc)\w*/i.test(t)) return true;
  // Công cụ công nghệ / phần mềm số hóa trong trường học
  if (/\b(geogebra|mindmeister|canva|padlet|quizizz|kahoot|mindmap)\b/i.test(t)) return true;
  // Mô tả nhiệm vụ số hóa, kỹ năng số
  if (
    /sử dụng công cụ mindmap|hợp tác nhóm trên môi trường số|dùng máy tính cầm tay hoặc bảng tính để tính giá trị|kiểm chứng các hệ thức bằng geogebra|tham gia quizizz/i.test(
      t
    )
  ) {
    return true;
  }
  // Các tiền tố NLS / Năng lực số
  if (/(?:NLS|Năng lực số)\s*:/i.test(t)) return true;
  return false;
}

/**
 * Làm sạch chuỗi nội dung: loại bỏ hoàn toàn phần NLS (Năng lực số), mã số hóa TC/NC,
 * các mô tả công cụ GeoGebra, MindMeister, Canva, Padlet, Quizizz, Kahoot,
 * các ghi chú (NLS: ...), [NLS: ...], v.v., chỉ giữ lại nội dung bài học/yêu cầu cần đạt.
 */
export function cleanContentWithoutNls(text: string): string {
  if (!text) return '';
  let cleaned = text
    // Bỏ các thẻ trong ngoặc đơn hoặc ngoặc vuông chứa NLS hoặc Năng lực số: (NLS...), [NLS...]
    .replace(/\s*[\(\[]\s*(?:NLS|Năng lực số)[\s\S]*?[\)\]]/gi, '')
    // Bỏ tiền tố/hậu tố dạng "- NLS: ..." hoặc "; NLS: ..." hoặc "NLS: ..."
    .replace(/(?:[-+*•–;,]\s*)?(?:NLS|Năng lực số)\s*:[^\n.;,]*(?:[.\n;,]|$)/gi, '')
    // Bỏ từ khoá NLS / Năng lực số đứng đơn lẻ kèm dấu gạch nối hoặc hai chấm
    .replace(/\b(?:NLS|Năng lực số)\b[:\s\-–]*/gi, '')
    // Bỏ các mã khung năng lực số như: 3.1TC2a: ..., 2.2.NC1a: ..., 5.3TC2a: ...
    .replace(/(?:[-+*•–;,]\s*)?\b\d+\.\d+(?:\.\w+)?(?:TC|NC|tc|nc)\w*\s*:[^.;\n]*(?:[.;\n]|$)/gi, '')
    .replace(/\b\d+\.\d+(?:\.\w+)?(?:TC|NC|tc|nc)\w*\b/gi, '')
    // Bỏ các câu văn thuần túy mô tả công cụ số (GeoGebra, MindMeister, Canva, Padlet, Quizizz, Kahoot)
    .replace(
      /(?:^|[.;\n])\s*(?:Sử dụng|Dùng|Ứng dụng)\s+(?:công cụ\s+)?(?:GeoGebra|MindMeister|Canva|Google Docs|Padlet|Quizizz|Kahoot|mindmap)[^.;\n]*(?:[.;\n]|$)/gi,
      ''
    )
    .replace(/(?:^|[.;\n])\s*(?:Hợp tác nhóm trên môi trường số|Tham gia Quizizz\/Kahoot)[^.;\n]*(?:[.;\n]|$)/gi, '')
    // Bỏ các ngoặc rỗng sót lại
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    // Chuẩn hóa khoảng trắng và dấu câu
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/^[.,;:\s]+|[.,;:\s]+$/g, '')
    .trim();

  return cleaned;
}

/**
 * Chuyển đổi số La Mã sang số nguyên (I -> 1, II -> 2, IV -> 4, IX -> 9, X -> 10, v.v.)
 */
export function romanToNumber(roman: string): number {
  if (!roman) return 0;
  const map: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
  };
  const clean = roman.toUpperCase().trim();
  let result = 0;
  for (let i = 0; i < clean.length; i++) {
    const current = map[clean[i]] || 0;
    const next = map[clean[i + 1]] || 0;
    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}

/**
 * Trích xuất thứ tự chương (Chương I -> 1, Chương II -> 2, Chương 3 -> 3, Chủ đề 2 -> 2)
 */
export function extractChapterOrder(chapterTitle: string): number {
  if (!chapterTitle) return 999;
  const norm = chapterTitle.trim();
  const mRoman = norm.match(/(?:chương|chủ đề|chuong|chu de|ôn tập chương|bài tập cuối chương)\s+([ivxlcdm]+)\b/i);
  if (mRoman) {
    const num = romanToNumber(mRoman[1]);
    if (num > 0) return num;
  }
  const mDigit = norm.match(/(?:chương|chủ đề|chuong|chu de)\s+(\d+)\b/i);
  if (mDigit) {
    return parseInt(mDigit[1], 10);
  }
  return 999;
}

/**
 * Chuẩn hóa tên bài học về tên bài học chính thức (canonical lesson title):
 * - Loại bỏ hoàn toàn mã năng lực số (NLS), công cụ GeoGebra, Mindmap...
 * - Loại bỏ các phân nhánh phụ trong bài: ví dụ " 1. Phương trình tích", " 2. Phương trình chứa ẩn ở mẫu", " Bài tập thực hành..."
 * - Loại bỏ các thẻ tiết: (t1), (tiết 1), (tiết 1-3), 1 tiết (T4)...
 * - Đảm bảo các dòng cùng thuộc một bài học sẽ có CÙNG CHÍNH XÁC một tên bài chuẩn
 */
export function extractCanonicalLessonTitle(rawTopic: string): string {
  if (!rawTopic) return '';
  let text = cleanContentWithoutNls(rawTopic);

  // Loại bỏ các thẻ tiết: (t1), (tiết 1), (tiết 1-3), 1 tiết (T4), ...
  text = text
    .replace(/\s*[\(\[]\s*(?:tiết|t)\s*\d+[\s\S]*?[\)\]]/gi, '')
    .replace(/\s*\b\d+\s*tiết\s*\(T\d+.*?\)/gi, '')
    .replace(/\s*&?\s*kiểm tra thường xuyên\s*\d*.*$/i, '')
    .replace(/\s*&?\s*kttx\s*\d*.*$/i, '')
    .replace(/\s*&?\s*kt\s*15\s*phút.*$/i, '')
    .trim();

  // 1. Kiểm tra bài tập cuối chương / ôn tập chương
  const mEndCh = text.match(/(?:bài tập cuối chương|ôn tập chương|luyện tập cuối chương|bài tập chương)\s+([ivxlcdm\d]+)(.*)$/i);
  if (mEndCh) {
    const rawNum = mEndCh[1];
    const roman = romanToNumber(rawNum);
    const romanStr = roman > 0 ? (['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][roman - 1] || rawNum) : rawNum.toUpperCase();
    return `Bài tập cuối chương ${romanStr}`;
  }

  // 2. Kiểm tra Luyện tập chung
  if (/^luyện tập chung\b/i.test(text)) {
    const chMatch = text.match(/chương\s+([ivxlcdm\d]+)/i);
    if (chMatch) {
      const roman = romanToNumber(chMatch[1]);
      const romanStr = roman > 0 ? (['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][roman - 1] || chMatch[1]) : chMatch[1].toUpperCase();
      return `Luyện tập chung (Chương ${romanStr})`;
    }
    return 'Luyện tập chung';
  }

  // 3. Nếu là bài học "Bài X..."
  const mLesson = text.match(/^(\s*bài\s+\d+[\.\:\s]+)(.*)$/i);
  if (mLesson) {
    const prefix = mLesson[1].trim().replace(':', '.'); // "Bài 4."
    let rest = mLesson[2].trim();

    // Loại bỏ các phân nhánh phụ trong bài:
    // " 1. Phương trình tích", " 2. Phương trình...", " 1.1. ", " 2.1. "
    // " Bài tập thực hành...", " Luyện tập thực hành..."
    // " - Tiết 1", " - Phần 1"
    const subIdx = rest.search(/(?:\s+\d+\.\d*(?:\.\d*)*\s+[A-ZÀ-Ỹ]|\s+bài tập thực hành|\s+luyện tập thực hành|\s+thực hành giải|\s*[-–—]\s*(?:tiết|phần|mục)\s*\d+)/i);
    if (subIdx !== -1) {
      rest = rest.substring(0, subIdx).trim();
    }

    // Xóa ký tự gạch nối, dấu hai chấm hoặc chấm ở cuối
    rest = rest.replace(/[-–—:\.\s]+$/, '').trim();

    return `${prefix} ${rest}`.trim();
  }

  return text;
}

export interface SgkLessonMatchResult {
  chapter: string;
  chapterNumber: number;
  canonicalLessonTitle: string;
  lessonNumber?: number;
  isReviewOrPractice?: boolean;
}

/**
 * Đối chiếu chính xác nội dung PPCT với SGK theo chuẩn GDPT 2018:
 * - Xác định chính xác theo nội dung trong SGK: Chương 1 gồm những bài nào, Chương 2 gồm những bài nào,
 *   rồi lần lượt cho các chương khác.
 * - Nếu PPCT có Bài 4 thuộc Chương 2 thì xếp vào Chương 2 và nội dung của Bài 4.
 * - Tuyệt đối không để lẫn lộn giữa Đại số và Hình học dù dạy xen kẽ cùng tuần trong PPCT.
 * - Bài tập cuối chương X xếp chính xác vào Chương X.
 */
export function identifySgkChapterAndLesson(
  rawTopic: string,
  rawChapter: string = '',
  grade: string = '9',
  sgkBooks?: SgkBook[]
): SgkLessonMatchResult {
  const normGrade = String(grade || '9').replace(/\D/g, '') || '9';
  const canonicalTitle = extractCanonicalLessonTitle(rawTopic);
  const lowerTopic = canonicalTitle.toLowerCase();

  // Danh mục tên chuẩn các chương môn Toán THCS (KNTT / chuẩn GDPT 2018)
  const officialChaptersGrade9: Record<number, string> = {
    1: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    2: 'Chương II: Phương trình và bất phương trình bậc nhất một ẩn',
    3: 'Chương III: Căn bậc hai và căn bậc ba',
    4: 'Chương IV: Hệ thức lượng trong tam giác vuông',
    5: 'Chương V: Đường tròn',
    6: 'Chương VI: Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn',
    7: 'Chương VII: Một số yếu tố thống kê',
    8: 'Chương VIII: Một số yếu tố xác suất',
    9: 'Chương IX: Đường tròn và đa giác đều',
    10: 'Chương X: Một số hình khối trong thực tiễn',
  };

  const officialChaptersGrade6: Record<number, string> = {
    1: 'Chương I: Tập hợp các số tự nhiên',
    2: 'Chương II: Tính chia hết trong tập hợp các số tự nhiên',
    3: 'Chương III: Số nguyên',
    4: 'Chương IV: Một số hình phẳng trong thực tiễn',
    5: 'Chương V: Tính đối xứng của hình phẳng trong tự nhiên',
    6: 'Chương VI: Phân số',
    7: 'Chương VII: Số thập phân',
    8: 'Chương VIII: Những hình hình học cơ bản',
    9: 'Chương IX: Dữ liệu và xác suất thực nghiệm',
  };

  const officialChaptersGrade7: Record<number, string> = {
    1: 'Chương I: Số hữu tỉ',
    2: 'Chương II: Số thực',
    3: 'Chương III: Góc và đường thẳng song song',
    4: 'Chương IV: Tam giác bằng nhau',
    5: 'Chương V: Thu thập và biểu diễn dữ liệu',
    6: 'Chương VI: Tỉ lệ thức và đại lượng tỉ lệ',
    7: 'Chương VII: Biểu thức đại số và đa thức một biến',
    8: 'Chương VIII: Làm quen với biến cố và xác suất của biến cố',
    9: 'Chương IX: Quan hệ giữa các yếu tố trong một tam giác',
    10: 'Chương X: Một số hình khối trong thực tiễn',
  };

  const officialChaptersGrade8: Record<number, string> = {
    1: 'Chương I: Đa thức nhiều biến',
    2: 'Chương II: Hằng đẳng thức đáng nhớ và ứng dụng',
    3: 'Chương III: Tứ giác',
    4: 'Chương IV: Định lí Thalès trong tam giác',
    5: 'Chương V: Dữ liệu và biểu đồ',
    6: 'Chương VI: Phân thức đại số',
    7: 'Chương VII: Phương trình bậc nhất và hàm số bậc nhất',
    8: 'Chương VIII: Mở đầu về tính xác suất của biến cố',
    9: 'Chương IX: Tam giác đồng dạng',
    10: 'Chương X: Một số hình khối trong thực tiễn',
  };

  const officialMap =
    normGrade === '6'
      ? officialChaptersGrade6
      : normGrade === '7'
      ? officialChaptersGrade7
      : normGrade === '8'
      ? officialChaptersGrade8
      : officialChaptersGrade9;

  // 1. Kiểm tra nếu là Bài tập cuối chương / Ôn tập chương X
  const mEndCh = lowerTopic.match(/(?:bài tập cuối chương|ôn tập chương|luyện tập cuối chương|bài tập chương)\s+([ivxlcdm\d]+)/i);
  if (mEndCh) {
    let chNum = romanToNumber(mEndCh[1]);
    if (!chNum || chNum <= 0) {
      chNum = parseInt(mEndCh[1], 10) || 1;
    }
    const officialTitle = officialMap[chNum] || `Chương ${chNum}`;
    return {
      chapter: officialTitle,
      chapterNumber: chNum,
      canonicalLessonTitle: canonicalTitle,
      isReviewOrPractice: true,
    };
  }

  // 2. Tra cứu nếu bài học có số thứ tự "Bài N"
  const mLesson = canonicalTitle.match(/\bbài\s+(\d+)\b/i);
  if (mLesson) {
    const lessonNum = parseInt(mLesson[1], 10);

    // Đối chiếu với bộ SGK hiện hành (Grade 9)
    if (normGrade === '9') {
      let chNum = 1;
      if (lessonNum >= 1 && lessonNum <= 3) chNum = 1; // Bài 1, 2, 3 -> Chương 1
      else if (lessonNum >= 4 && lessonNum <= 6) chNum = 2; // Bài 4, 5, 6 -> Chương 2
      else if (lessonNum >= 7 && lessonNum <= 10) chNum = 3; // Bài 7, 8, 9, 10 -> Chương 3
      else if (lessonNum >= 11 && lessonNum <= 12) chNum = 4; // Bài 11, 12 -> Chương 4
      else if (lessonNum >= 13 && lessonNum <= 15) chNum = 5; // Bài 13, 14, 15 -> Chương 5
      else if (lessonNum >= 16 && lessonNum <= 19) chNum = 6; // Bài 16, 17, 18, 19 -> Chương 6
      else if (lessonNum >= 20 && lessonNum <= 21) chNum = 7; // Bài 20, 21 -> Chương 7
      else if (lessonNum >= 22 && lessonNum <= 23) chNum = 8; // Bài 22, 23 -> Chương 8
      else if (lessonNum >= 24 && lessonNum <= 27) chNum = 9; // Bài 24, 25, 26, 27 -> Chương 9
      else if (lessonNum >= 28 && lessonNum <= 30) chNum = 10; // Bài 28, 29, 30 -> Chương 10

      // Nếu bộ sách Cánh diều (số bài học đánh số lại từ 1 trong mỗi chương), phân biệt bằng từ khóa
      if (lowerTopic.includes('tỉ số lượng giác') || lowerTopic.includes('hệ thức về cạnh và góc')) {
        chNum = 4;
      } else if (lowerTopic.includes('đường tròn') || lowerTopic.includes('tiếp tuyến')) {
        chNum = 5;
      } else if (lowerTopic.includes('bất đẳng thức') || lowerTopic.includes('bất phương trình') || lowerTopic.includes('phương trình quy về')) {
        chNum = 2;
      } else if (lowerTopic.includes('hệ hai phương trình') || lowerTopic.includes('phương trình bậc nhất hai ẩn')) {
        chNum = 1;
      } else if (lowerTopic.includes('căn thức') || lowerTopic.includes('căn bậc hai')) {
        chNum = 3;
      }

      return {
        chapter: officialMap[chNum] || `Chương ${chNum}`,
        chapterNumber: chNum,
        canonicalLessonTitle: canonicalTitle,
        lessonNumber: lessonNum,
      };
    }

    // Grade 6
    if (normGrade === '6') {
      let chNum = 1;
      if (lessonNum >= 1 && lessonNum <= 7) chNum = 1;
      else if (lessonNum >= 8 && lessonNum <= 13) chNum = 2;
      else if (lessonNum >= 14 && lessonNum <= 19) chNum = 3;
      else if (lessonNum >= 20 && lessonNum <= 22) chNum = 4;
      else if (lessonNum >= 23 && lessonNum <= 27) chNum = 5;
      else if (lessonNum >= 28 && lessonNum <= 37) chNum = 6;
      return {
        chapter: officialMap[chNum] || `Chương ${chNum}`,
        chapterNumber: chNum,
        canonicalLessonTitle: canonicalTitle,
        lessonNumber: lessonNum,
      };
    }

    // Grade 7
    if (normGrade === '7') {
      let chNum = 1;
      if (lessonNum >= 1 && lessonNum <= 4) chNum = 1;
      else if (lessonNum >= 5 && lessonNum <= 7) chNum = 2;
      else if (lessonNum >= 8 && lessonNum <= 11) chNum = 3;
      else if (lessonNum >= 12 && lessonNum <= 16) chNum = 4;
      else if (lessonNum >= 17 && lessonNum <= 19) chNum = 5;
      return {
        chapter: officialMap[chNum] || `Chương ${chNum}`,
        chapterNumber: chNum,
        canonicalLessonTitle: canonicalTitle,
        lessonNumber: lessonNum,
      };
    }

    // Grade 8
    if (normGrade === '8') {
      let chNum = 1;
      if (lessonNum >= 1 && lessonNum <= 2) chNum = 1;
      else if (lessonNum >= 3 && lessonNum <= 5) chNum = 2;
      else if (lessonNum >= 6 && lessonNum <= 9) chNum = 3;
      else if (lessonNum >= 10 && lessonNum <= 13) chNum = 4;
      else if (lessonNum >= 14 && lessonNum <= 17) chNum = 5;
      return {
        chapter: officialMap[chNum] || `Chương ${chNum}`,
        chapterNumber: chNum,
        canonicalLessonTitle: canonicalTitle,
        lessonNumber: lessonNum,
      };
    }
  }

  // 3. Nếu là Luyện tập chung
  if (lowerTopic.includes('luyện tập chung')) {
    const mChInLtc = lowerTopic.match(/chương\s+([ivxlcdm\d]+)/i);
    let chNum = 0;
    if (mChInLtc) {
      chNum = romanToNumber(mChInLtc[1]) || parseInt(mChInLtc[1], 10);
    }
    if (!chNum && rawChapter) {
      chNum = extractChapterOrder(rawChapter);
    }
    if (!chNum || chNum === 999) {
      chNum = 1;
    }
    return {
      chapter: officialMap[chNum] || (rawChapter ? rawChapter : `Chương ${chNum}`),
      chapterNumber: chNum,
      canonicalLessonTitle: canonicalTitle,
      isReviewOrPractice: true,
    };
  }

  // 4. Tra cứu từ khóa nội dung theo SGK (khi không có số thứ tự bài)
  if (normGrade === '9') {
    if (
      lowerTopic.includes('tỉ số lượng giác') ||
      lowerTopic.includes('hệ thức về cạnh và góc') ||
      lowerTopic.includes('tam giác vuông') ||
      lowerTopic.includes('sin, cos')
    ) {
      return {
        chapter: officialMap[4],
        chapterNumber: 4,
        canonicalLessonTitle: canonicalTitle,
      };
    }
    if (
      lowerTopic.includes('đường tròn') ||
      lowerTopic.includes('tiếp tuyến') ||
      lowerTopic.includes('dây cung') ||
      lowerTopic.includes('cung và dây')
    ) {
      return {
        chapter: officialMap[5],
        chapterNumber: 5,
        canonicalLessonTitle: canonicalTitle,
      };
    }
    if (
      lowerTopic.includes('phương trình bậc nhất hai ẩn') ||
      lowerTopic.includes('hệ hai phương trình') ||
      lowerTopic.includes('phương pháp thế') ||
      lowerTopic.includes('cộng đại số')
    ) {
      return {
        chapter: officialMap[1],
        chapterNumber: 1,
        canonicalLessonTitle: canonicalTitle,
      };
    }
    if (
      lowerTopic.includes('bất đẳng thức') ||
      lowerTopic.includes('bất phương trình') ||
      lowerTopic.includes('phương trình quy về')
    ) {
      return {
        chapter: officialMap[2],
        chapterNumber: 2,
        canonicalLessonTitle: canonicalTitle,
      };
    }
    if (
      lowerTopic.includes('căn bậc hai') ||
      lowerTopic.includes('căn thức') ||
      lowerTopic.includes('căn bậc ba') ||
      lowerTopic.includes('khai phương')
    ) {
      return {
        chapter: officialMap[3],
        chapterNumber: 3,
        canonicalLessonTitle: canonicalTitle,
      };
    }
  }

  // 5. Nếu không khớp từ khóa nội dung, dựa vào rawChapter có sẵn
  if (rawChapter && rawChapter.trim() !== '' && rawChapter !== 'Chủ đề chung') {
    const chOrder = extractChapterOrder(rawChapter);
    const resolvedTitle = officialMap[chOrder] || rawChapter;
    return {
      chapter: resolvedTitle,
      chapterNumber: chOrder,
      canonicalLessonTitle: canonicalTitle,
    };
  }

  // Fallback: Chương 1
  return {
    chapter: officialMap[1] || 'Chương I',
    chapterNumber: 1,
    canonicalLessonTitle: canonicalTitle,
  };
}

/**
 * Tự động đối chiếu văn bản (kể cả văn bản chứa mã NLS hay text công cụ) với
 * chương trình SGK Toán hiện nay (GDPT 2018 - Kết nối tri thức / Cánh diều / Chân trời sáng tạo)
 * để trả về Tên Chương và Tên Bài học chuẩn xác nhất theo SGK.
 */
export function getOfficialSgkTopicAndChapter(
  text: string,
  grade: string = '9',
  sgkBooks?: SgkBook[]
): { chapter: string; topic: string } | null {
  if (!text) return null;
  const res = identifySgkChapterAndLesson(text, '', grade, sgkBooks);
  if (res && res.chapter) {
    return {
      chapter: res.chapter,
      topic: res.canonicalLessonTitle,
    };
  }
  return null;
}

/**
 * Trả về Tên chương chuẩn theo SGK GDPT 2018 dựa vào khối lớp, từ khóa bài học hoặc tuần học
 * Đảm bảo KHÔNG BAO GIỜ ĐỂ TRỐNG tên chương hay chủ đề
 */
export function getDefaultSgkChapter(grade: string = '9', topicText: string = '', week: number = 1): string {
  const normGrade = String(grade || '9').replace(/\D/g, '') || '9';
  const res = identifySgkChapterAndLesson(topicText, '', normGrade);
  return res.chapter;
}

/**
 * Rà soát và chuẩn hóa toàn bộ các dòng Ma trận / Bảng đặc tả bám sát chuẩn SGK hiện hành (GDPT 2018),
 * tự động loại bỏ triệt để các mã năng lực số (3.1TC2a, 2.2.NC1a...) và công cụ số (GeoGebra, Canva, MindMeister, Padlet, Quizizz),
 * đảm bảo tên chủ đề / chương và tên bài học không bao giờ bị để trống.
 */
export function standardizeRowsToCurrentSgk(
  rows: MatrixRow[],
  grade: string = '9',
  sgkBooks?: SgkBook[]
): { rows: MatrixRow[]; changedCount: number } {
  let changedCount = 0;
  const newRows = rows.map((row) => {
    let newChapter = row.chuong;
    let newTopic = row.noiDung;
    let modified = false;

    // 1. Kiểm tra nếu chứa mã năng lực số hoặc text công cụ số
    if (isTechCompetenceText(row.chuong) || isTechCompetenceText(row.noiDung)) {
      const combined = `${row.chuong} ${row.noiDung}`;
      const sgkMatch = getOfficialSgkTopicAndChapter(combined, grade, sgkBooks);
      if (sgkMatch) {
        newChapter = sgkMatch.chapter;
        newTopic = sgkMatch.topic;
        modified = true;
      } else {
        newChapter = cleanContentWithoutNls(row.chuong) || getDefaultSgkChapter(grade, row.noiDung);
        newTopic = cleanContentWithoutNls(row.noiDung) || 'Nội dung kiến thức theo SGK';
        modified = true;
      }
    } else {
      // Làm sạch thông thường
      const cleanedCh = cleanContentWithoutNls(row.chuong);
      const cleanedTopic = cleanContentWithoutNls(row.noiDung);
      if (cleanedCh !== row.chuong || cleanedTopic !== row.noiDung) {
        newChapter = cleanedCh;
        newTopic = cleanedTopic;
        modified = true;
      }
    }

    // 2. Tuyệt đối không để trống tên chương / chủ đề, tuân thủ SGK hiện hành
    if (!newChapter || newChapter.trim() === '' || newChapter === 'Chủ đề chung' || newChapter.toLowerCase() === 'chủ đề khác') {
      const sgkMatch = getOfficialSgkTopicAndChapter(`${newChapter} ${newTopic}`, grade, sgkBooks);
      newChapter = sgkMatch?.chapter || getDefaultSgkChapter(grade, newTopic);
      modified = true;
    }

    // 3. Tuyệt đối không để trống tên bài học / nội dung
    if (!newTopic || newTopic.trim() === '') {
      const sgkMatch = getOfficialSgkTopicAndChapter(newChapter, grade, sgkBooks);
      newTopic = sgkMatch?.topic || 'Nội dung kiến thức theo SGK';
      modified = true;
    }

    if (modified) {
      changedCount++;
      return {
        ...row,
        chuong: newChapter,
        noiDung: newTopic,
      };
    }
    return row;
  });

  return { rows: newRows, changedCount };
}

/**
 * Làm sạch tên bài học để lấy phần nội dung kiến thức cốt lõi (bỏ ghi chú tiết, KTTX đi kèm, bỏ NLS)
 * Gom các tiết phụ của cùng một bài học (ví dụ tiết 1-2 pp thế, tiết 3-4 pp cộng đại số) về cùng tên bài học chuẩn
 */
export function cleanLessonTopic(rawTopic: string): string {
  return extractCanonicalLessonTitle(rawTopic);
}

/**
 * Kiểm tra xem một bài học/chủ đề có phải là nội dung không cần thiết ra đề hay không
 * (Tiết kiểm tra, trả bài, hoạt động trải nghiệm, phần mềm, ôn tập kiểm tra chung, v.v.)
 */
export function checkNonTestableContent(rawTopic: string, rawChapter: string = ''): NonTestableCheckResult {
  const cleanedTopic = cleanLessonTopic(rawTopic);
  const lowerTopic = cleanedTopic.toLowerCase();
  const lowerChapter = (rawChapter || '').toLowerCase();

  // 1. Tiết kiểm tra / đánh giá định kỳ hoặc thường xuyên (khi bài học là kiểm tra)
  const isExam =
    /^(kiểm tra|đánh giá|thi học k[ỳì]|kttx|khảo sát|bài kiểm tra)/i.test(lowerTopic) ||
    /kiểm tra (giữa|cuối|định|thường|học k[ỳì]|15 ph|1 tiết|45 ph)|thi học k[ỳì]|khảo sát (đầu năm|chất lượng)/i.test(lowerTopic) ||
    (lowerChapter.includes('kiểm tra cuối học kỳ') && !lowerTopic.includes('bài'));

  if (isExam) {
    return {
      isNonTestable: true,
      reason: 'Tiết kiểm tra / Đánh giá',
      category: 'exam',
      cleanedTopic,
    };
  }

  // 2. Tiết trả bài / chữa bài kiểm tra / rút kinh nghiệm
  const isReturnPaper =
    /trả bài|chữa bài|sửa bài|rút kinh nghiệm|sơ kết đánh giá|tổng kết và đánh giá kết quả/i.test(lowerTopic);
  if (isReturnPaper) {
    return {
      isNonTestable: true,
      reason: 'Tiết trả bài / Sửa bài',
      category: 'return_paper',
      cleanedTopic,
    };
  }

  // 3. Hoạt động thực hành và trải nghiệm, dự án học tập, tham quan, thực địa
  const isActivity =
    /hoạt động thực hành|thực hành và trải nghiệm|thực hành trải nghiệm|hoạt động trải nghiệm|dự án học tập|thực địa|ngoài trời|tham quan/i.test(lowerTopic) ||
    /thực hành trải nghiệm|hoạt động trải nghiệm/i.test(lowerChapter);
  if (isActivity) {
    return {
      isNonTestable: true,
      reason: 'Hoạt động trải nghiệm / Thực hành',
      category: 'activity',
      cleanedTopic,
    };
  }

  // 4. Thực hành phần mềm / Máy tính cầm tay
  const isSoftware =
    /thực hành phần mềm|geogebra|geonext|sử dụng máy tính cầm tay|phần mềm vẽ hình/i.test(lowerTopic);
  if (isSoftware) {
    return {
      isNonTestable: true,
      reason: 'Thực hành phần mềm / Máy tính cầm tay',
      category: 'software',
      cleanedTopic,
    };
  }

  // 5. Tiết ôn tập định kỳ / ôn tập kiểm tra chung
  const isReviewExam =
    /ôn tập (kiểm tra|giữa k[ỳì]|cuối k[ỳì]|thi|tổng kết|chuyên đề: rèn kĩ năng)/i.test(lowerTopic) ||
    /ôn tập & kiểm tra|ôn tập cuối học kỳ|tổng kết năm học|ôn tập tổng kết/i.test(lowerChapter);
  if (isReviewExam) {
    return {
      isNonTestable: true,
      reason: 'Tiết ôn tập định kỳ / Tổng kết',
      category: 'review_exam',
      cleanedTopic,
    };
  }

  // 6. Hướng dẫn học tập, giới thiệu môn học, đọc thêm
  const isAdmin =
    /hướng dẫn học tập|hướng dẫn sử dụng sách|giới thiệu môn học|hướng dẫn ôn hè|sinh hoạt lớp|đọc thêm|em có biết|tự học có hướng dẫn/i.test(lowerTopic);
  if (isAdmin) {
    return {
      isNonTestable: true,
      reason: 'Hướng dẫn học tập / Đọc thêm',
      category: 'admin',
      cleanedTopic,
    };
  }

  return {
    isNonTestable: false,
    cleanedTopic,
  };
}

/**
 * Automatically generates a balanced Exam Matrix from PPCT up to the target exam week
 * Supports:
 * - Limiting content to specific week (e.g. up to Week 9)
 * - Filtering out non-testable content (Kiểm tra, Trả bài, Hoạt động trải nghiệm, Ôn tập...)
 * - Configurable TN / TL ratio (e.g. 70% TN / 30% TL)
 * - MOET 2025 New Structure (Phần I: 4 lựa chọn, Phần II: Đúng/Sai, Phần III: Trả lời ngắn, Phần IV: Tự luận)
 * - Standard 2018 Structure (TNKQ & TL theo 4 mức độ)
 * - Exact taught periods and % thời lượng balancing
 */
export function generateMatrixFromPpct(
  ppct: PpctDataset,
  options: {
    targetWeek?: number;
    limitWeekFrom?: number;
    limitWeekTo?: number;
    limitPeriodTo?: number;
    selectedLessonKeys?: string[];
    sgkBooks?: SgkBook[];
    cutOffExamWeek?: boolean;
    incompleteLessonPolicy?: 'exclude' | 'partial_only' | 'include_all';
    excludeNonTestable?: boolean;
    ratioTn?: number;
    ratioTl?: number;
    structureType?: 'moet_2025_new' | 'standard_2018';
    matrixGroupBy?: 'chapter' | 'lesson';
    scorePerTn?: number;
    scorePerTn1?: number;
    scorePerTn2?: number;
    scorePerTn3?: number;
    scorePerTl?: number;
    targetScore?: number;
    cognitiveRatios?: { nhanBiet: number; thongHieu: number; vanDung: number; vanDungCao: number };
  } | number = 9,
  legacyScorePerTn = 0.25,
  legacyScorePerTl = 1.0,
  legacyTargetScore = 10
): MatrixRow[] {
  // Normalize arguments
  const config = typeof options === 'number' ? {
    limitWeekFrom: 1,
    limitWeekTo: options,
    limitPeriodTo: undefined as number | undefined,
    selectedLessonKeys: undefined as string[] | undefined,
    sgkBooks: undefined as SgkBook[] | undefined,
    cutOffExamWeek: true,
    incompleteLessonPolicy: 'exclude' as const,
    excludeNonTestable: true,
    ratioTn: 70,
    ratioTl: 30,
    structureType: 'moet_2025_new' as const,
    matrixGroupBy: 'chapter' as const,
    scorePerTn: legacyScorePerTn,
    scorePerTn1: 0.25,
    scorePerTn2: 1.0,
    scorePerTn3: 0.5,
    scorePerTl: legacyScorePerTl,
    targetScore: legacyTargetScore,
    cognitiveRatios: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
  } : {
    limitWeekFrom: Math.max(1, options.limitWeekFrom ?? 1),
    limitWeekTo: Math.max(options.limitWeekFrom ?? 1, options.limitWeekTo ?? options.targetWeek ?? 9),
    limitPeriodTo: options.limitPeriodTo,
    selectedLessonKeys: options.selectedLessonKeys,
    sgkBooks: options.sgkBooks,
    cutOffExamWeek: options.cutOffExamWeek !== false,
    incompleteLessonPolicy: options.incompleteLessonPolicy ?? 'exclude',
    excludeNonTestable: options.excludeNonTestable !== false,
    ratioTn: options.ratioTn ?? 70,
    ratioTl: options.ratioTl ?? 30,
    structureType: options.structureType ?? 'moet_2025_new',
    matrixGroupBy: options.matrixGroupBy ?? 'chapter',
    scorePerTn: options.scorePerTn ?? 0.25,
    scorePerTn1: options.scorePerTn1 ?? 0.25,
    scorePerTn2: options.scorePerTn2 ?? 1.0,
    scorePerTn3: options.scorePerTn3 ?? 0.5,
    scorePerTl: options.scorePerTl ?? 1.0,
    targetScore: options.targetScore ?? 10,
    cognitiveRatios: options.cognitiveRatios ?? { nhanBiet: 30, thongHieu: 40, vanDung: 20, vanDungCao: 10 },
  };

  // 1. Quy tắc tuần kiểm tra: Khi kiểm tra ở tuần 9 (hoặc limitWeekTo = 9),
  // nội dung lấy theo PPCT đến tuần 8 (tuần 9 là tuần ôn tập & thi)
  const shouldCutOffWeek9 = config.cutOffExamWeek && config.limitWeekTo === 9;
  const effectiveWeekTo = shouldCutOffWeek9 ? 8 : config.limitWeekTo;

  // 2. Nhận diện các bài học dở dang vắt qua tuần kiểm tra (ví dụ học 1 tiết ở tuần 8, 2 tiết ở tuần 9)
  // Xây dựng bản đồ tiết dạy theo từng bài học
  const lessonTaughtSpanMap = new Map<string, {
    beforeOrAtCutoffPeriods: number;
    afterCutoffPeriods: number;
    totalPpctPeriods: number;
    firstLessonRef: (typeof ppct.lessons)[0];
  }>();

  ppct.lessons.forEach((l) => {
    const coreKey = cleanLessonTopic(l.baiHoc).toLowerCase();
    if (!coreKey) return;
    const existing = lessonTaughtSpanMap.get(coreKey) || {
      beforeOrAtCutoffPeriods: 0,
      afterCutoffPeriods: 0,
      totalPpctPeriods: 0,
      firstLessonRef: l,
    };
    const p = l.soTiet || 1;
    existing.totalPpctPeriods += p;
    if (l.tuan >= config.limitWeekFrom && l.tuan <= effectiveWeekTo) {
      existing.beforeOrAtCutoffPeriods += p;
    } else if (l.tuan > effectiveWeekTo && l.tuan <= config.limitWeekTo) {
      existing.afterCutoffPeriods += p;
    }
    lessonTaughtSpanMap.set(coreKey, existing);
  });

  // 3. Lọc danh sách bài học nằm trong phạm vi tuần [config.limitWeekFrom, effectiveWeekTo]
  let lessons = ppct.lessons.filter((l) => {
    if (l.tuan < config.limitWeekFrom || l.tuan > effectiveWeekTo) return false;
    if (config.limitPeriodTo && l.tietPPCT && l.tietPPCT > config.limitPeriodTo) return false;
    return true;
  });

  // If specific lesson keys are provided, filter by those
  if (config.selectedLessonKeys && config.selectedLessonKeys.length > 0) {
    const selectedSet = new Set(config.selectedLessonKeys);
    lessons = lessons.filter((l) => {
      const cleaned = cleanLessonTopic(l.baiHoc);
      const resolvedChapter = identifySgkChapterAndLesson(cleaned, l.chuong, ppct.grade || '9', config.sgkBooks).chapter;
      const key = `${resolvedChapter}:::${cleaned}`;
      const rawKey = `${l.chuong}:::${cleaned}`;
      return selectedSet.has(key) || selectedSet.has(rawKey);
    });
  }

  if (lessons.length === 0) return [];

  // 4. Nhóm theo chương & bài học chuẩn SGK, áp dụng chính sách bài dở dang vắt qua tuần 8 & 9
  interface ChapterAccumulator {
    chapter: string;
    chapterNumber: number;
    totalPeriods: number;
    lessonMap: Map<string, { name: string; periods: number; minWeek: number; maxWeek: number }>;
    minWeek: number;
    maxWeek: number;
  }
  const chapterMap = new Map<string, ChapterAccumulator>();
  const lessonUnitMap = new Map<string, { chapter: string; topic: string; periods: number }>();

  lessons.forEach((l) => {
    const check = checkNonTestableContent(l.baiHoc, l.chuong);

    // If user enabled non-testable exclusion, skip non-testable rows completely
    if (config.excludeNonTestable && check.isNonTestable) {
      return;
    }

    const coreKey = cleanLessonTopic(l.baiHoc).toLowerCase();
    const spanInfo = lessonTaughtSpanMap.get(coreKey);

    // Kiểm tra xem bài học này có liên tục vắt qua tuần kiểm tra không
    // (ví dụ bài có 3 tiết, tuần 8 mới học 1 tiết, tuần 9 học tiếp các tiết còn lại)
    const isSpanningIncomplete =
      spanInfo &&
      spanInfo.beforeOrAtCutoffPeriods > 0 &&
      spanInfo.afterCutoffPeriods > 0;

    if (isSpanningIncomplete) {
      if (config.incompleteLessonPolicy === 'exclude') {
        // "nếu tuần 8 và 9 có nội dung liên tục, bài học có 3 tiết, tuần 8 chỉ có 1 tiết thì có thể không cần lấy nội dung đó"
        return;
      }
    }

    let rawCleanedTopic = check.cleanedTopic || l.baiHoc.replace(/\(t\d+\)/g, '').trim();
    let rawCleanedChapter = l.chuong || '';

    // Chuẩn hóa tên chương và bài học theo SGK hiện hành (GDPT 2018)
    const sgkRes = identifySgkChapterAndLesson(rawCleanedTopic, rawCleanedChapter, ppct.grade || '9', config.sgkBooks);
    const cleanedChapter = sgkRes.chapter;
    const cleanedTopic = sgkRes.canonicalLessonTitle;

    // "nếu lấy nội dung có liên quan trong tuần 8 thì chỉ lấy đúng nội dung được học"
    let lessonPeriods = l.soTiet || 1;
    if (isSpanningIncomplete && config.incompleteLessonPolicy === 'partial_only' && spanInfo) {
      // Chỉ lấy đúng số tiết đã học trong tuần 8
      lessonPeriods = Math.min(lessonPeriods, spanInfo.beforeOrAtCutoffPeriods);
    }

    // Accumulate for Chapter Group Mode
    let chAcc = chapterMap.get(cleanedChapter);
    if (!chAcc) {
      chAcc = {
        chapter: cleanedChapter,
        chapterNumber: sgkRes.chapterNumber || extractChapterOrder(cleanedChapter),
        totalPeriods: 0,
        lessonMap: new Map(),
        minWeek: l.tuan,
        maxWeek: l.tuan,
      };
      chapterMap.set(cleanedChapter, chAcc);
    }
    chAcc.totalPeriods += lessonPeriods;
    chAcc.minWeek = Math.min(chAcc.minWeek, l.tuan);
    chAcc.maxWeek = Math.max(chAcc.maxWeek, l.tuan);

    const lKey = cleanLessonTopic(cleanedTopic);
    const existingL = chAcc.lessonMap.get(lKey);
    if (existingL) {
      existingL.periods += lessonPeriods;
      existingL.minWeek = Math.min(existingL.minWeek, l.tuan);
      existingL.maxWeek = Math.max(existingL.maxWeek, l.tuan);
    } else {
      chAcc.lessonMap.set(lKey, {
        name: cleanedTopic,
        periods: lessonPeriods,
        minWeek: l.tuan,
        maxWeek: l.tuan,
      });
    }

    // Accumulate for Lesson Group Mode
    const key = `${cleanedChapter}:::${cleanedTopic}`;
    const existingUnit = lessonUnitMap.get(key);
    if (existingUnit) {
      existingUnit.periods += lessonPeriods;
    } else {
      lessonUnitMap.set(key, {
        chapter: cleanedChapter,
        topic: cleanedTopic,
        periods: lessonPeriods,
      });
    }
  });

  let units: { chapter: string; topic: string; periods: number }[] = [];

  if (config.matrixGroupBy === 'lesson') {
    units = Array.from(lessonUnitMap.values()).sort((a, b) => {
      const numA = extractChapterOrder(a.chapter);
      const numB = extractChapterOrder(b.chapter);
      if (numA !== numB) return numA - numB;
      return a.topic.localeCompare(b.topic, 'vi');
    });
  } else {
    // Group by Chapter / Chủ đề lớn (Chuẩn Phụ lục 1 khung ma trận Bộ GD&ĐT)
    // Sắp xếp các chương TUẦN TỰ theo thứ tự SGK: Chương 1, Chương 2, Chương 3, Chương 4...
    const sortedChapters = Array.from(chapterMap.values()).sort((a, b) => {
      const numA = (a as any).chapterNumber ?? extractChapterOrder(a.chapter);
      const numB = (b as any).chapterNumber ?? extractChapterOrder(b.chapter);
      if (numA !== numB) return numA - numB;
      return a.minWeek - b.minWeek;
    });

    units = sortedChapters.map((ch) => {
      const distinctLessons = Array.from(ch.lessonMap.values()).sort((a, b) => a.minWeek - b.minWeek);
      // Đếm các bài học chính (bắt đầu bằng Bài X hoặc có cấu trúc bài)
      const mainLessons = distinctLessons.filter((ls) => /\bbài\s+\d+/i.test(ls.name));
      const extraLessons = distinctLessons.filter((ls) => !/\bbài\s+\d+/i.test(ls.name));
      const lessonCount = mainLessons.length > 0 ? mainLessons.length : distinctLessons.length;
      
      const mainSummary = mainLessons.map((ls) => `${ls.name} (${ls.periods} tiết)`).join('; ');
      const extraSummary = extraLessons.map((ls) => `${ls.name} (${ls.periods} tiết)`).join(', ');

      let formattedTopic = `Gồm ${lessonCount} bài học: ${mainSummary}`;
      if (extraSummary) {
        formattedTopic += ` (kèm ${extraSummary})`;
      }

      return {
        chapter: ch.chapter,
        topic: formattedTopic,
        periods: ch.totalPeriods,
      };
    });
  }

  if (units.length === 0) return [];

  const totalPeriods = units.reduce((sum, u) => sum + u.periods, 0) || 1;

  if (config.structureType === 'moet_2025_new') {
    // Cài đặt mức độ nhận thức chuẩn theo yêu cầu Bộ GD&ĐT:
    // Nhận biết: 30% (3.0 điểm)
    // Thông hiểu: 40% (4.0 điểm)
    // Vận dụng: 30% (3.0 điểm) [gồm Vận dụng 20% (2.0 điểm) và Vận dụng cao 10% (1.0 điểm)]
    //
    // Đầy đủ 4 dạng câu hỏi (3 dạng trắc nghiệm + 1 dạng tự luận), KHÔNG CÓ dạng nào chiếm 0%:
    // 1. TN Nhiều lựa chọn: 12 câu = 3.0 điểm (0.25đ/câu): 6 Biết (1.50đ) + 6 Hiểu (1.50đ)
    // 2. TN Đúng/Sai: 2 câu = 2.0 điểm (1.0đ/câu): 1 Biết (1.00đ) + 1 Hiểu (1.00đ)
    // 3. TN Trả lời ngắn: 4 câu = 2.0 điểm (0.5đ/câu): 1 Biết (0.50đ) + 3 Hiểu (1.50đ)
    // 4. Tự luận: 3 bài = 3.0 điểm (1.0đ/bài): 2 Vận dụng (2.00đ) + 1 Vận dụng cao (1.00đ)
    //
    // Tổng Nhận biết: 1.50 + 1.00 + 0.50 = 3.0 điểm (30%)
    // Tổng Thông hiểu: 1.50 + 1.00 + 1.50 = 4.0 điểm (40%)
    // Tổng Vận dụng: 2.0 điểm (20%)
    // Tổng Vận dụng cao: 1.0 điểm (10%)
    // Tổng điểm: 10.0 điểm (100%)!
    
    const TARGET_D1_NB = 6;
    const TARGET_D1_TH = 6;
    const TARGET_D2_NB = 1;
    const TARGET_D2_TH = 1;
    const TARGET_D3_NB = 1;
    const TARGET_D3_TH = 3;
    const TARGET_TL_VD = 2; // 2.0đ
    const TARGET_TL_VDC = 1; // 1.0đ

    // Phân bố đa dạng: Xác định các chủ đề/bài học nhận D2, D3, TL để tránh dồn cục
    const numUnits = units.length;
    const d2_nb_idx = 0;
    const d2_th_idx = numUnits > 1 ? Math.min(numUnits - 1, Math.floor(numUnits / 2)) : 0;

    // Phân bố 4 câu Trả lời ngắn (1 NB, 3 TH) vào các bài học khác nhau
    const d3_slots: { unitIdx: number; level: 'biet' | 'hieu' }[] = [];
    if (numUnits >= 4) {
      d3_slots.push({ unitIdx: 1 % numUnits, level: 'biet' });
      d3_slots.push({ unitIdx: 2 % numUnits, level: 'hieu' });
      d3_slots.push({ unitIdx: (numUnits - 1) % numUnits, level: 'hieu' });
      d3_slots.push({ unitIdx: 3 % numUnits, level: 'hieu' });
    } else {
      d3_slots.push({ unitIdx: 0, level: 'biet' });
      d3_slots.push({ unitIdx: (1 % numUnits), level: 'hieu' });
      d3_slots.push({ unitIdx: (2 % numUnits), level: 'hieu' });
      d3_slots.push({ unitIdx: (3 % numUnits), level: 'hieu' });
    }

    // Tự luận: Vận dụng ở bài trọng tâm, Vận dụng cao ở bài tổng hợp cuối
    const tl_vd_indices = [numUnits > 1 ? Math.floor(numUnits / 2) : 0, 0];
    const tl_vdc_idx = numUnits - 1;

    let remD1_NB = TARGET_D1_NB;
    let remD1_TH = TARGET_D1_TH;
    let remD2_NB = TARGET_D2_NB;
    let remD2_TH = TARGET_D2_TH;
    let remD3_NB = TARGET_D3_NB;
    let remD3_TH = TARGET_D3_TH;
    let remTL_VD = TARGET_TL_VD;
    let remTL_VDC = TARGET_TL_VDC;

    const rowAllocations = units.map((u, index) => {
      const isLast = index === units.length - 1;
      const weight = u.periods / totalPeriods;
      const tiLeThoiLuong = Math.round(weight * 100);

      // 1. Phân bố Dạng I (Nhiều lựa chọn - 12 câu: 6 NB, 6 TH) theo tỉ lệ thời lượng
      let d1_nb = isLast ? remD1_NB : Math.min(remD1_NB, Math.round(weight * TARGET_D1_NB));
      if (d1_nb < 0) d1_nb = 0;
      remD1_NB -= d1_nb;

      let d1_th = isLast ? remD1_TH : Math.min(remD1_TH, Math.round(weight * TARGET_D1_TH));
      if (d1_th < 0) d1_th = 0;
      remD1_TH -= d1_th;

      // 2. Phân bố Dạng II (Đúng - Sai - 2 câu: 1 NB, 1 TH) ở 2 bài học khác nhau
      let d2_nb = 0;
      if (index === d2_nb_idx && remD2_NB > 0) {
        d2_nb = 1;
        remD2_NB -= 1;
      } else if (isLast && remD2_NB > 0) {
        d2_nb = remD2_NB;
        remD2_NB = 0;
      }

      let d2_th = 0;
      if (index === d2_th_idx && remD2_TH > 0) {
        d2_th = 1;
        remD2_TH -= 1;
      } else if (isLast && remD2_TH > 0) {
        d2_th = remD2_TH;
        remD2_TH = 0;
      }

      // 3. Phân bố Dạng III (Trả lời ngắn - 4 câu: 1 NB, 3 TH) trải đều
      let d3_nb = 0;
      let d3_th = 0;
      d3_slots.forEach((slot) => {
        if (slot.unitIdx === index) {
          if (slot.level === 'biet' && remD3_NB > 0) {
            d3_nb += 1;
            remD3_NB -= 1;
          } else if (slot.level === 'hieu' && remD3_TH > 0) {
            d3_th += 1;
            remD3_TH -= 1;
          }
        }
      });

      if (isLast) {
        if (remD3_NB > 0) {
          d3_nb += remD3_NB;
          remD3_NB = 0;
        }
        if (remD3_TH > 0) {
          d3_th += remD3_TH;
          remD3_TH = 0;
        }
      }

      // 4. Phân bố Tự luận (3 câu/bài: 2 Vận dụng, 1 Vận dụng cao)
      let tl_vd = 0;
      if (tl_vd_indices.includes(index) && remTL_VD > 0) {
        tl_vd = 1;
        remTL_VD -= 1;
      } else if (isLast && remTL_VD > 0) {
        tl_vd = remTL_VD;
        remTL_VD = 0;
      }

      let tl_vdc = 0;
      if (index === tl_vdc_idx && remTL_VDC > 0) {
        tl_vdc = 1;
        remTL_VDC -= 1;
      } else if (isLast && remTL_VDC > 0) {
        tl_vdc = remTL_VDC;
        remTL_VDC = 0;
      }

      // Aggregate TN totals per cell
      const nb_tn = d1_nb + d2_nb + d3_nb;
      const th_tn = d1_th + d2_th + d3_th;

      return {
        id: `moet-row-${index + 1}`,
        tt: index + 1,
        chuong: cleanContentWithoutNls(u.chapter),
        noiDung: cleanContentWithoutNls(u.topic),
        soTiet: u.periods,
        tiLeThoiLuong,
        nhieuLuaChon: {
          biet: d1_nb,
          hieu: d1_th,
          vanDung: 0,
        },
        dungSai: {
          biet: d2_nb,
          hieu: d2_th,
          vanDung: 0,
        },
        traLoiNgan: {
          biet: d3_nb,
          hieu: d3_th,
          vanDung: 0,
        },
        tuLuan: {
          biet: 0,
          hieu: 0,
          vanDung: tl_vd + tl_vdc,
        },
        nhanBiet: {
          tn: nb_tn,
          tl: 0,
          tn1: d1_nb,
          tn2: d2_nb,
          tn3: d3_nb,
        },
        thongHieu: {
          tn: th_tn,
          tl: 0,
          tn1: d1_th,
          tn2: d2_th,
          tn3: d3_th,
        },
        vanDung: {
          tn: 0,
          tl: tl_vd,
          tn1: 0,
          tn2: 0,
          tn3: 0,
        },
        vanDungCao: {
          tn: 0,
          tl: tl_vdc,
          tn1: 0,
          tn2: 0,
          tn3: 0,
        },
      };
    });

    // Final safety check to guarantee exact totals
    if (remD1_NB > 0 && rowAllocations[0]) {
      rowAllocations[0].nhanBiet.tn1 = (rowAllocations[0].nhanBiet.tn1 || 0) + remD1_NB;
      rowAllocations[0].nhanBiet.tn += remD1_NB;
      if (rowAllocations[0].nhieuLuaChon) rowAllocations[0].nhieuLuaChon.biet += remD1_NB;
    }
    if (remD1_TH > 0 && rowAllocations[0]) {
      rowAllocations[0].thongHieu.tn1 = (rowAllocations[0].thongHieu.tn1 || 0) + remD1_TH;
      rowAllocations[0].thongHieu.tn += remD1_TH;
      if (rowAllocations[0].nhieuLuaChon) rowAllocations[0].nhieuLuaChon.hieu += remD1_TH;
    }
    if (remD2_NB > 0 && rowAllocations[0]) {
      rowAllocations[0].nhanBiet.tn2 = (rowAllocations[0].nhanBiet.tn2 || 0) + remD2_NB;
      rowAllocations[0].nhanBiet.tn += remD2_NB;
      if (rowAllocations[0].dungSai) rowAllocations[0].dungSai.biet += remD2_NB;
    }
    if (remD2_TH > 0 && (rowAllocations[1] || rowAllocations[0])) {
      const targetRow = rowAllocations[1] || rowAllocations[0];
      targetRow.thongHieu.tn2 = (targetRow.thongHieu.tn2 || 0) + remD2_TH;
      targetRow.thongHieu.tn += remD2_TH;
      if (targetRow.dungSai) targetRow.dungSai.hieu += remD2_TH;
    }
    if (remD3_NB > 0 && rowAllocations[0]) {
      rowAllocations[0].nhanBiet.tn3 = (rowAllocations[0].nhanBiet.tn3 || 0) + remD3_NB;
      rowAllocations[0].nhanBiet.tn += remD3_NB;
      if (rowAllocations[0].traLoiNgan) rowAllocations[0].traLoiNgan.biet += remD3_NB;
    }
    if (remD3_TH > 0 && rowAllocations[0]) {
      rowAllocations[0].thongHieu.tn3 = (rowAllocations[0].thongHieu.tn3 || 0) + remD3_TH;
      rowAllocations[0].thongHieu.tn += remD3_TH;
      if (rowAllocations[0].traLoiNgan) rowAllocations[0].traLoiNgan.hieu += remD3_TH;
    }
    if (remTL_VD > 0 && rowAllocations[0]) {
      rowAllocations[0].vanDung.tl += remTL_VD;
      if (rowAllocations[0].tuLuan) rowAllocations[0].tuLuan.vanDung += remTL_VD;
    }
    if (remTL_VDC > 0 && rowAllocations[rowAllocations.length - 1]) {
      rowAllocations[rowAllocations.length - 1].vanDungCao.tl += remTL_VDC;
      if (rowAllocations[rowAllocations.length - 1].tuLuan) {
        rowAllocations[rowAllocations.length - 1].tuLuan!.vanDung += remTL_VDC;
      }
    }

    return rowAllocations;
  } else {
    // Standard 2018 TNKQ & TL structure (70% TN = 28 câu x 0.25đ; 30% TL = 3 câu x 1.0đ)
    const targetTnScore = (config.targetScore * config.ratioTn) / 100;
    const targetTlScore = (config.targetScore * config.ratioTl) / 100;
    const totalTnQuestions = Math.round(targetTnScore / config.scorePerTn);
    const totalTlQuestions = Math.round(targetTlScore / config.scorePerTl);

    return units.map((u, index) => {
      const weight = u.periods / totalPeriods;
      const tiLeThoiLuong = Math.round(weight * 100);

      const tnCount = Math.max(1, Math.round(weight * totalTnQuestions));
      const nb_tn = Math.ceil(tnCount * 0.5);
      const th_tn = Math.floor(tnCount * 0.35);
      const vd_tn = Math.max(0, tnCount - nb_tn - th_tn);
      const vdc_tn = 0;

      const isMajor = weight >= 0.16;
      const tl_vd = (isMajor && index === Math.floor(units.length / 2)) ? 1 : 0;
      const tl_vdc = (index === units.length - 1) ? 1 : 0;

      return {
        id: `std-row-${index + 1}`,
        tt: index + 1,
        chuong: cleanContentWithoutNls(u.chapter),
        noiDung: cleanContentWithoutNls(u.topic),
        soTiet: u.periods,
        tiLeThoiLuong,
        nhanBiet: {
          tn: nb_tn,
          tl: 0,
        },
        thongHieu: {
          tn: th_tn,
          tl: 0,
        },
        vanDung: {
          tn: vd_tn,
          tl: tl_vd,
        },
        vanDungCao: {
          tn: vdc_tn,
          tl: tl_vdc,
        },
      };
    });
  }
}

/**
 * Trích xuất và chuẩn hóa dữ liệu 19 cột cho một dòng Ma trận (Phụ lục 1)
 */
export function getMatrixRow19Values(r: MatrixRow) {
  const nlc = {
    biet: r.nhieuLuaChon?.biet ?? r.nhanBiet?.tn1 ?? r.nhanBiet?.tn ?? 0,
    hieu: r.nhieuLuaChon?.hieu ?? r.thongHieu?.tn1 ?? r.thongHieu?.tn ?? 0,
    vanDung: r.nhieuLuaChon?.vanDung ?? 0,
  };
  const ds = {
    biet: r.dungSai?.biet ?? r.nhanBiet?.tn2 ?? 0,
    hieu: r.dungSai?.hieu ?? r.thongHieu?.tn2 ?? 0,
    vanDung: r.dungSai?.vanDung ?? 0,
  };
  const tln = {
    biet: r.traLoiNgan?.biet ?? r.nhanBiet?.tn3 ?? 0,
    hieu: r.traLoiNgan?.hieu ?? r.thongHieu?.tn3 ?? 0,
    vanDung: r.traLoiNgan?.vanDung ?? 0,
  };
  const tl = {
    biet: r.tuLuan?.biet ?? r.nhanBiet?.tl ?? 0,
    hieu: r.tuLuan?.hieu ?? r.thongHieu?.tl ?? 0,
    vanDung: r.tuLuan?.vanDung ?? ((r.vanDung?.tl || 0) + (r.vanDungCao?.tl || 0)),
  };

  const tongBiet = nlc.biet + ds.biet + tln.biet + tl.biet;
  const tongHieu = nlc.hieu + ds.hieu + tln.hieu + tl.hieu;
  const tongVanDung = nlc.vanDung + ds.vanDung + tln.vanDung + tl.vanDung;

  const score =
    (nlc.biet + nlc.hieu + nlc.vanDung) * 0.25 +
    (ds.biet + ds.hieu + ds.vanDung) * 1.0 +
    (tln.biet + tln.hieu + tln.vanDung) * 0.5 +
    (tl.biet + tl.hieu + tl.vanDung) * 1.0;

  const formattedScore =
    score === 0 ? '' : score % 1 === 0 ? score.toString() : score.toFixed(1).replace('.', ',');

  return {
    nlc,
    ds,
    tln,
    tl,
    tongBiet,
    tongHieu,
    tongVanDung,
    score,
    formattedScore,
  };
}

/**
 * Tính tổng số câu hỏi được phân bổ cho một dòng ma trận
 */
export function getRowTotalQuestions(r: MatrixRow): number {
  const vals = getMatrixRow19Values(r);
  return vals.tongBiet + vals.tongHieu + vals.tongVanDung;
}

/**
 * Tính bảng điểm theo từng chủ đề dựa trên số tiết thực tế (Theo đúng Phụ lục I trong công văn)
 * Tự động phân rõ số lượng bài học và tỉ lệ thời lượng % bám sát PPCT
 */
export function calculateTopicPointSummary(
  rows: MatrixRow[],
  isMidterm: boolean = true
): {
  items: TopicPointCalc[];
  totalPeriods: number;
  totalScore: number;
} {
  // Group by chapter
  const chapterMap = new Map<string, { periods: number; lessonsSummary?: string; lessonsCount?: number }>();
  rows.forEach((r) => {
    const chuong = r.chuong || 'Chủ đề khác';
    const cur = chapterMap.get(chuong) || { periods: 0 };
    cur.periods += r.soTiet || 1;

    // Trích xuất số bài học và tóm tắt nếu có trong r.noiDung
    if (r.noiDung) {
      const matchGom = r.noiDung.match(/^gồm\s+(\d+)\s+bài\s+học[:\s]*(.*)/i);
      if (matchGom) {
        cur.lessonsCount = parseInt(matchGom[1], 10);
        cur.lessonsSummary = matchGom[2];
      } else if (!cur.lessonsSummary) {
        cur.lessonsSummary = r.noiDung;
      }
    }
    chapterMap.set(chuong, cur);
  });

  const totalPeriods = Array.from(chapterMap.values()).reduce((sum, c) => sum + c.periods, 0) || 1;
  const chapterEntries = Array.from(chapterMap.entries());

  let accumulatedScore = 0;
  const items: TopicPointCalc[] = chapterEntries.map(([name, data], idx) => {
    const isLast = idx === chapterEntries.length - 1;
    const rawScore = (data.periods * 10) / totalPeriods;
    // Round to nearest 0.25 or 0.5
    let roundedScore = Math.round(rawScore * 2) / 2;
    
    if (isLast) {
      roundedScore = Math.max(0.5, Number((10 - accumulatedScore).toFixed(1)));
    } else {
      accumulatedScore += roundedScore;
    }

    const pctThoiLuong = Math.round((data.periods / totalPeriods) * 100);

    return {
      topicIndex: idx + 1,
      topicName: name,
      periods: data.periods,
      rawScore: Number(rawScore.toFixed(2)),
      roundedScore,
      lessonsCount: data.lessonsCount,
      lessonsSummary: data.lessonsSummary,
      pctThoiLuong,
    };
  });

  const totalScore = items.reduce((sum, item) => sum + item.roundedScore, 0);

  return {
    items,
    totalPeriods,
    totalScore: Number(totalScore.toFixed(1)),
  };
}

/**
 * Trích xuất bảng tham chiếu chi tiết đối chiếu PPCT bám sát từng tuần
 * Phân rõ từng Chủ đề/Chương có bao nhiêu bài, từng bài bao nhiêu tiết, làm căn cứ chuẩn xác
 */
export function getPpctReferenceBreakdown(
  ppct: PpctDataset,
  options: {
    limitWeekFrom?: number;
    limitWeekTo?: number;
    cutOffExamWeek?: boolean;
    incompleteLessonPolicy?: 'exclude' | 'partial_only' | 'include_all';
    excludeNonTestable?: boolean;
    selectedLessonKeys?: string[];
    sgkBooks?: SgkBook[];
  }
): PpctReferenceItem[] {
  const weekFrom = Math.max(1, options.limitWeekFrom ?? 1);
  const weekTo = Math.max(weekFrom, options.limitWeekTo ?? 9);
  const cutOffExamWeek = options.cutOffExamWeek !== false;
  const effectiveWeekTo = (cutOffExamWeek && weekTo === 9) ? 8 : weekTo;

  let lessons = ppct.lessons.filter((l) => l.tuan >= weekFrom && l.tuan <= effectiveWeekTo);

  if (options.selectedLessonKeys && options.selectedLessonKeys.length > 0) {
    const selectedSet = new Set(options.selectedLessonKeys);
    lessons = lessons.filter((l) => {
      const cleaned = cleanLessonTopic(l.baiHoc);
      const resolvedChapter = identifySgkChapterAndLesson(cleaned, l.chuong, ppct.grade || '9', options.sgkBooks).chapter;
      const key = `${resolvedChapter}:::${cleaned}`;
      const rawKey = `${l.chuong}:::${cleaned}`;
      return selectedSet.has(key) || selectedSet.has(rawKey);
    });
  }

  // Tích lũy theo chương
  const chMap = new Map<string, {
    chapterNumber: number;
    totalPeriods: number;
    lessonMap: Map<string, { name: string; periods: number; week: number }>;
    minWeek: number;
    maxWeek: number;
  }>();

  lessons.forEach((l) => {
    if (options.excludeNonTestable) {
      const check = checkNonTestableContent(l.baiHoc, l.chuong);
      if (check.isNonTestable) return;
    }

    const rawCleanedTopic = l.baiHoc.replace(/\(t\d+\)/g, '').trim();
    const rawCleanedChapter = l.chuong || '';
    const sgkRes = identifySgkChapterAndLesson(rawCleanedTopic, rawCleanedChapter, ppct.grade || '9', options.sgkBooks);
    const cleanedChapter = sgkRes.chapter;
    const cleanedTopic = sgkRes.canonicalLessonTitle;

    let p = l.soTiet || 1;

    let chEntry = chMap.get(cleanedChapter);
    if (!chEntry) {
      chEntry = {
        chapterNumber: sgkRes.chapterNumber || extractChapterOrder(cleanedChapter),
        totalPeriods: 0,
        lessonMap: new Map(),
        minWeek: l.tuan,
        maxWeek: l.tuan,
      };
      chMap.set(cleanedChapter, chEntry);
    }
    chEntry.totalPeriods += p;
    chEntry.minWeek = Math.min(chEntry.minWeek, l.tuan);
    chEntry.maxWeek = Math.max(chEntry.maxWeek, l.tuan);

    const lKey = cleanLessonTopic(cleanedTopic);
    const existingL = chEntry.lessonMap.get(lKey);
    if (existingL) {
      existingL.periods += p;
      existingL.week = Math.min(existingL.week, l.tuan);
    } else {
      chEntry.lessonMap.set(lKey, {
        name: cleanedTopic,
        periods: p,
        week: l.tuan,
      });
    }
  });

  const grandTotalPeriods = Array.from(chMap.values()).reduce((s, c) => s + c.totalPeriods, 0) || 1;
  // Sắp xếp các chương theo đúng thứ tự chuẩn SGK: Chương 1, Chương 2, Chương 3...
  const sortedEntries = Array.from(chMap.entries()).sort((a, b) => {
    const numA = a[1].chapterNumber ?? extractChapterOrder(a[0]);
    const numB = b[1].chapterNumber ?? extractChapterOrder(b[0]);
    if (numA !== numB) return numA - numB;
    return a[1].minWeek - b[1].minWeek;
  });

  let accumulatedScore = 0;
  return sortedEntries.map(([chapterName, data], idx) => {
    const isLast = idx === sortedEntries.length - 1;
    const rawScore = (data.totalPeriods * 10) / grandTotalPeriods;
    let roundedScore = Math.round(rawScore * 2) / 2;
    if (isLast) {
      roundedScore = Math.max(0.5, Number((10 - accumulatedScore).toFixed(1)));
    } else {
      accumulatedScore += roundedScore;
    }

    const lessonsList = Array.from(data.lessonMap.values()).sort((a, b) => a.week - b.week);
    const mainLessons = lessonsList.filter((ls) => /\bbài\s+\d+/i.test(ls.name));
    const lessonsCount = mainLessons.length > 0 ? mainLessons.length : lessonsList.length;
    const pctThoiLuong = Math.round((data.totalPeriods / grandTotalPeriods) * 100);

    const weeksSpan = data.minWeek === data.maxWeek 
      ? `Tuần ${data.minWeek}` 
      : `Tuần ${data.minWeek} – ${data.maxWeek}`;

    return {
      topicIndex: idx + 1,
      chapterName,
      totalPeriods: data.totalPeriods,
      lessonsCount,
      pctThoiLuong,
      rawScore: Number(rawScore.toFixed(2)),
      roundedScore,
      weeksSpan,
      lessons: lessonsList,
    };
  });
}

/**
 * Tự động tạo Bảng đặc tả đề kiểm tra (Phụ lục II) bám sát yêu cầu cần đạt GDPT 2018 và ma trận 16 cột
 */
export function generateSpecificationFromMatrix(
  rows: MatrixRow[],
  arg2: string = 'Toán',
  arg3: string = '9',
  sgkBooks?: SgkBook[],
  preferredVolume?: 1 | 2 | 'all'
): SpecificationRow[] {
  // Chuẩn hóa grade và subject dù người gọi truyền theo thứ tự nào
  let grade = '9';
  let subject = 'Toán';
  if (['6', '7', '8', '9'].includes(arg2)) {
    grade = arg2;
    subject = arg3 || 'Toán';
  } else if (['6', '7', '8', '9'].includes(arg3)) {
    grade = arg3;
    subject = arg2 || 'Toán';
  } else {
    subject = arg2 || 'Toán';
    grade = arg3 || '9';
  }

  let currentD1Index = 1; // 1 -> 12 (Nhiều lựa chọn)
  let currentD2Index = 13; // 13 -> 14 (Đúng - sai)
  let currentD3Index = 15; // 15 -> 18 (Trả lời ngắn)
  let currentTLIndex = 19; // 19 -> 21 (Tự luận)

  // Chỉ lấy những nội dung có câu hỏi theo đúng yêu cầu
  const hasAnyQuestions = rows.some((r) => getRowTotalQuestions(r) > 0);
  const targetRows = hasAnyQuestions ? rows.filter((r) => getRowTotalQuestions(r) > 0) : rows;

  // Group matrix rows by chapter/topic
  const chapterGroups = new Map<string, MatrixRow[]>();
  targetRows.forEach((r) => {
    let ch = cleanContentWithoutNls(r.chuong || '');
    if (!ch || ch === 'Chủ đề chung' || ch.toLowerCase() === 'chủ đề khác') {
      const match = getOfficialSgkTopicAndChapter(`${r.noiDung}`, grade, sgkBooks);
      ch = match?.chapter || getDefaultSgkChapter(grade, r.noiDung);
    }
    const list = chapterGroups.get(ch) || [];
    list.push({
      ...r,
      chuong: ch,
      noiDung: cleanContentWithoutNls(r.noiDung || '') || 'Nội dung kiến thức theo SGK',
    });
    chapterGroups.set(ch, list);
  });

  const specRows: SpecificationRow[] = [];
  let topicNumber = 1;

  chapterGroups.forEach((chapterRows, chapterName) => {
    const totalChapterPeriods = chapterRows.reduce((sum, r) => sum + (r.soTiet || 1), 0);

    chapterRows.forEach((r) => {
      const items: SpecificationItem[] = [];
      const v = getMatrixRow19Values(r);

      // Nếu không có câu hỏi ở dòng này thì bỏ qua
      if (hasAnyQuestions && v.tongBiet + v.tongHieu + v.tongVanDung === 0) {
        return;
      }

      // Helper to format question list
      const formatQ = (startIdx: number, count: number, prefix: string = 'Câu ') => {
        if (count <= 0) return '';
        const list: number[] = [];
        for (let i = 0; i < count; i++) {
          list.push(startIdx + i);
        }
        if (list.length === 1) return `${prefix}${list[0]}`;
        return `${prefix}${list.join(', ')}`;
      };

      const getObjective = (level: CognitiveLevel) => {
        if (sgkBooks && sgkBooks.length > 0) {
          return cleanContentWithoutNls(getLearningObjectiveForTopic(level, r.noiDung, r.chuong, sgkBooks, preferredVolume, grade));
        }
        return cleanContentWithoutNls(generateLearningObjective(level, r.noiDung, subject, grade));
      };

      // 1. NHẬN BIẾT
      const nb_d1 = v.nlc.biet;
      const nb_d2 = v.ds.biet;
      const nb_d3 = v.tln.biet;
      const nb_tl = v.tl.biet;

      let q_nb_d1 = '';
      if (nb_d1 > 0) {
        q_nb_d1 = formatQ(currentD1Index, nb_d1);
        currentD1Index += nb_d1;
      }
      let q_nb_d2 = '';
      if (nb_d2 > 0) {
        q_nb_d2 = formatQ(currentD2Index, nb_d2);
        currentD2Index += nb_d2;
      }
      let q_nb_d3 = '';
      if (nb_d3 > 0) {
        q_nb_d3 = formatQ(currentD3Index, nb_d3);
        currentD3Index += nb_d3;
      }
      let q_nb_tl = '';
      if (nb_tl > 0) {
        q_nb_tl = formatQ(currentTLIndex, nb_tl, 'Câu ');
        currentTLIndex += nb_tl;
      }

      if (nb_d1 > 0 || nb_d2 > 0 || nb_d3 > 0 || nb_tl > 0) {
        items.push({
          id: `spec-nb-${r.id}`,
          mucDo: 'nhanBiet',
          mucDoLabel: 'Nhận biết',
          yeuCauCanDat: getObjective('nhanBiet'),
          nlc: { biet: q_nb_d1, hieu: '', vanDung: '' },
          ds: { biet: q_nb_d2, hieu: '', vanDung: '' },
          tln: { biet: q_nb_d3, hieu: '', vanDung: '' },
          tl: { biet: q_nb_tl, hieu: '', vanDung: '' },
          soCauTN: nb_d1 + nb_d2 + nb_d3,
          soCauTL: nb_tl,
          cauHoiTNText: [q_nb_d1, q_nb_d2, q_nb_d3].filter(Boolean).join(', '),
          cauHoiTLText: q_nb_tl,
        });
      }

      // 2. THÔNG HIỂU
      const th_d1 = v.nlc.hieu;
      const th_d2 = v.ds.hieu;
      const th_d3 = v.tln.hieu;
      const th_tl = v.tl.hieu;

      let q_th_d1 = '';
      if (th_d1 > 0) {
        q_th_d1 = formatQ(currentD1Index, th_d1);
        currentD1Index += th_d1;
      }
      let q_th_d2 = '';
      if (th_d2 > 0) {
        q_th_d2 = formatQ(currentD2Index, th_d2);
        currentD2Index += th_d2;
      }
      let q_th_d3 = '';
      if (th_d3 > 0) {
        q_th_d3 = formatQ(currentD3Index, th_d3);
        currentD3Index += th_d3;
      }
      let q_th_tl = '';
      if (th_tl > 0) {
        q_th_tl = formatQ(currentTLIndex, th_tl, 'Câu ');
        currentTLIndex += th_tl;
      }

      if (th_d1 > 0 || th_d2 > 0 || th_d3 > 0 || th_tl > 0) {
        items.push({
          id: `spec-th-${r.id}`,
          mucDo: 'thongHieu',
          mucDoLabel: 'Thông hiểu',
          yeuCauCanDat: getObjective('thongHieu'),
          nlc: { biet: '', hieu: q_th_d1, vanDung: '' },
          ds: { biet: '', hieu: q_th_d2, vanDung: '' },
          tln: { biet: '', hieu: q_th_d3, vanDung: '' },
          tl: { biet: '', hieu: q_th_tl, vanDung: '' },
          soCauTN: th_d1 + th_d2 + th_d3,
          soCauTL: th_tl,
          cauHoiTNText: [q_th_d1, q_th_d2, q_th_d3].filter(Boolean).join(', '),
          cauHoiTLText: q_th_tl,
        });
      }

      // 3. VẬN DỤNG & VẬN DỤNG CAO
      const vd_d1 = v.nlc.vanDung;
      const vd_d2 = v.ds.vanDung;
      const vd_d3 = v.tln.vanDung;
      const vd_tl = v.tl.vanDung;

      let q_vd_d1 = '';
      if (vd_d1 > 0) {
        q_vd_d1 = formatQ(currentD1Index, vd_d1);
        currentD1Index += vd_d1;
      }
      let q_vd_d2 = '';
      if (vd_d2 > 0) {
        q_vd_d2 = formatQ(currentD2Index, vd_d2);
        currentD2Index += vd_d2;
      }
      let q_vd_d3 = '';
      if (vd_d3 > 0) {
        q_vd_d3 = formatQ(currentD3Index, vd_d3);
        currentD3Index += vd_d3;
      }
      let q_vd_tl = '';
      if (vd_tl > 0) {
        if (currentTLIndex === 19 && vd_tl > 1) {
          q_vd_tl = `19 a, b`;
          currentTLIndex += 1;
        } else {
          q_vd_tl = currentTLIndex >= 19 && currentTLIndex <= 21 ? `${currentTLIndex} a` : `Câu ${currentTLIndex}`;
          currentTLIndex += vd_tl;
        }
      }

      if (vd_d1 > 0 || vd_d2 > 0 || vd_d3 > 0 || vd_tl > 0) {
        items.push({
          id: `spec-vd-${r.id}`,
          mucDo: 'vanDung',
          mucDoLabel: 'Vận dụng',
          yeuCauCanDat: getObjective('vanDung'),
          nlc: { biet: '', hieu: '', vanDung: q_vd_d1 },
          ds: { biet: '', hieu: '', vanDung: q_vd_d2 },
          tln: { biet: '', hieu: '', vanDung: q_vd_d3 },
          tl: { biet: '', hieu: '', vanDung: q_vd_tl },
          soCauTN: vd_d1 + vd_d2 + vd_d3,
          soCauTL: vd_tl,
          cauHoiTNText: [q_vd_d1, q_vd_d2, q_vd_d3].filter(Boolean).join(', '),
          cauHoiTLText: q_vd_tl,
        });
      }

      // Nếu chưa có câu hỏi nào trong cả ma trận và không có items thì mới tạo mặc định 3 mức
      if (items.length === 0 && !hasAnyQuestions) {
        items.push({
          id: `spec-nb-empty-${r.id}`,
          mucDo: 'nhanBiet',
          mucDoLabel: 'Nhận biết',
          yeuCauCanDat: getObjective('nhanBiet'),
          nlc: { biet: '', hieu: '', vanDung: '' },
          ds: { biet: '', hieu: '', vanDung: '' },
          tln: { biet: '', hieu: '', vanDung: '' },
          tl: { biet: '', hieu: '', vanDung: '' },
        });
        items.push({
          id: `spec-th-empty-${r.id}`,
          mucDo: 'thongHieu',
          mucDoLabel: 'Thông hiểu',
          yeuCauCanDat: getObjective('thongHieu'),
          nlc: { biet: '', hieu: '', vanDung: '' },
          ds: { biet: '', hieu: '', vanDung: '' },
          tln: { biet: '', hieu: '', vanDung: '' },
          tl: { biet: '', hieu: '', vanDung: '' },
        });
        items.push({
          id: `spec-vd-empty-${r.id}`,
          mucDo: 'vanDung',
          mucDoLabel: 'Vận dụng',
          yeuCauCanDat: getObjective('vanDung'),
          nlc: { biet: '', hieu: '', vanDung: '' },
          ds: { biet: '', hieu: '', vanDung: '' },
          tln: { biet: '', hieu: '', vanDung: '' },
          tl: { biet: '', hieu: '', vanDung: '' },
        });
      }

      if (items.length > 0) {
        specRows.push({
          id: `spec-row-${r.id}`,
          chuong: cleanContentWithoutNls(chapterName),
          soTietChuong: totalChapterPeriods,
          noiDung: cleanContentWithoutNls(r.noiDung),
          items,
        });
      }
    });

    topicNumber++;
  });

  return specRows;
}

/**
 * Tạo mô tả Yêu cầu cần đạt chuẩn GDPT 2018 theo động từ nhận thức
 */
function generateLearningObjective(
  level: CognitiveLevel,
  topic: string,
  subject: string,
  grade: string
): string {
  const cleanTopic = topic.replace(/\(t\d+\)/g, '').trim();

  switch (level) {
    case 'nhanBiet':
      return `- Nhận biết và nêu được các khái niệm, định nghĩa, tính chất cơ bản về ${cleanTopic}.\n- Nhận biết các biểu thức, quy tắc, công thức hoặc hiện tượng liên quan đến ${cleanTopic}.\n- Chỉ ra các ví dụ, dấu hiệu đặc trưng trong các tình huống đơn giản.`;
    case 'thongHieu':
      return `- Giải thích, phân biệt và mô tả được bản chất, cơ chế hoạt động của ${cleanTopic}.\n- Trình bày mối liên hệ giữa các khái niệm, biến đổi được biểu thức, hình vẽ hoặc hiện tượng.\n- Minh họa, so sánh và phân loại được các trường hợp liên quan đến ${cleanTopic}.`;
    case 'vanDung':
      return `- Vận dụng các kiến thức, công thức, định lý về ${cleanTopic} để giải quyết bài toán hoặc tình huống quen thuộc.\n- Thực hiện các bước tính toán, suy luận, chứng minh và xử lý số liệu chính xác.\n- Biến đổi và áp dụng linh hoạt phương pháp giải trong các tình huống cụ thể.`;
    case 'vanDungCao':
      return `- Vận dụng tổng hợp các kiến thức về ${cleanTopic} để giải quyết vấn đề thực tiễn hoặc bài toán phức tạp, liên môn.\n- Phân tích, đánh giá, đề xuất giải pháp, thiết kế mô hình hoặc suy luận logic nâng cao.\n- Xây dựng thuật toán / chiến lược xử lý tối ưu cho tình huống đặt ra.`;
    default:
      return `Nắm vững và thực hiện các yêu cầu cần đạt về ${cleanTopic} theo chương trình GDPT 2018.`;
  }
}
