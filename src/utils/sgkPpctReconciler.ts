import {
  SgkBook,
  SgkChapter,
  SgkLesson,
  PpctDataset,
  PpctLesson,
  MatrixRow,
  MatrixConfig,
} from '../types';
import {
  identifySgkChapterAndLesson,
  cleanContentWithoutNls,
  cleanLessonTopic,
  checkNonTestableContent,
  getMatrixRow19Values,
} from './dateCalculations';
import { normalizeVietnameseText } from './sgkParser';

export interface ReconciledLessonItem {
  id: string;
  lessonNumber: number;
  title: string;
  shortTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  sgkPeriods: number;
  ppctPeriods: number;
  effectivePeriods: number; // Periods used for calculation
  ppctWeeksText: string;
  ppctPeriodsText: string;
  matchingPpctLessons: PpctLesson[];
  matchStatus: 'exact' | 'partial' | 'not_in_ppct';
  statusLabel: string;
  isSelected: boolean;
  objectives: {
    nhanBiet: string;
    thongHieu: string;
    vanDung: string;
  };
  // Calculated distribution
  timeRatioPct: number;
  balancedScore: number;
  allocatedQuestions?: {
    nlc: { biet: number; hieu: number };
    ds: { biet: number; hieu: number };
    tln: { biet: number; hieu: number };
    tl: { vanDung: number; vanDungCao: number };
  };
}

export interface ChapterReconciliationResult {
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  totalSgkPeriods: number;
  totalPpctPeriods: number;
  totalEffectivePeriods: number;
  lessons: ReconciledLessonItem[];
}

/**
 * Đối chiếu các bài học trong một Chương của SGK với PPCT thực tế
 */
export function reconcileChapterWithPpct(
  chapter: SgkChapter,
  ppct: PpctDataset,
  options?: {
    usePpctPeriods?: boolean; // Nếu true, dùng số tiết thực tế trong PPCT thay vì SGK
    initialSelectedLessons?: string[];
  }
): ChapterReconciliationResult {
  const usePpctPeriods = options?.usePpctPeriods ?? true;
  const grade = ppct.grade || '9';

  const reconciledLessons: ReconciledLessonItem[] = chapter.lessons.map((sgkLesson, idx) => {
    const normSgkTitle = normalizeVietnameseText(sgkLesson.title);
    const sgkLessonNum = sgkLesson.lessonNumber || (idx + 1);

    // Tìm tất cả các bài trong PPCT khớp với bài học này
    const matchingPpctLessons = ppct.lessons.filter((pl) => {
      // 1. Kiểm tra qua identifySgkChapterAndLesson
      const res = identifySgkChapterAndLesson(pl.baiHoc, pl.chuong, grade);
      const cleanedPpctTopic = cleanLessonTopic(pl.baiHoc);
      const normCleanedPpct = normalizeVietnameseText(cleanedPpctTopic);

      // Trùng số thứ tự bài
      const mPpctNum = pl.baiHoc.match(/\bbài\s+(\d+)\b/i);
      if (mPpctNum && parseInt(mPpctNum[1], 10) === sgkLessonNum) {
        return true;
      }

      // Trùng tên bài hoặc tên bài chuẩn
      if (normCleanedPpct && (normSgkTitle.includes(normCleanedPpct) || normCleanedPpct.includes(normSgkTitle))) {
        return true;
      }

      // So khớp canonical title
      const normCanonical = normalizeVietnameseText(res.canonicalLessonTitle);
      if (normCanonical && (normSgkTitle.includes(normCanonical) || normCanonical.includes(normSgkTitle))) {
        return true;
      }

      return false;
    });

    // Tính toán số tiết từ PPCT
    let ppctPeriods = 0;
    const weekSet = new Set<number>();
    const periodNumbers: number[] = [];

    matchingPpctLessons.forEach((pl) => {
      ppctPeriods += pl.soTiet || 1;
      if (pl.tuan) weekSet.add(pl.tuan);
      if (pl.tietPPCT) periodNumbers.push(pl.tietPPCT);
    });

    const weeks = Array.from(weekSet).sort((a, b) => a - b);
    const ppctWeeksText =
      weeks.length === 0
        ? 'Chưa xếp'
        : weeks.length === 1
        ? `Tuần ${weeks[0]}`
        : `Tuần ${weeks[0]} – ${weeks[weeks.length - 1]}`;

    const sortedPeriods = periodNumbers.sort((a, b) => a - b);
    const ppctPeriodsText =
      sortedPeriods.length === 0
        ? '—'
        : sortedPeriods.length === 1
        ? `Tiết ${sortedPeriods[0]}`
        : `Tiết ${sortedPeriods[0]} – ${sortedPeriods[sortedPeriods.length - 1]}`;

    // Xác định trạng thái đối chiếu
    let matchStatus: 'exact' | 'partial' | 'not_in_ppct' = 'exact';
    let statusLabel = 'Khớp PPCT';

    if (matchingPpctLessons.length === 0) {
      matchStatus = 'not_in_ppct';
      statusLabel = 'Chưa có trong PPCT';
    } else if (weeks.length > 1) {
      matchStatus = 'partial';
      statusLabel = `Vắt qua ${weeks.length} tuần`;
    }

    const effectivePeriods =
      usePpctPeriods && ppctPeriods > 0 ? ppctPeriods : sgkLesson.periods || 2;

    const isSelected = options?.initialSelectedLessons
      ? options.initialSelectedLessons.includes(sgkLesson.id)
      : matchStatus !== 'not_in_ppct';

    return {
      id: sgkLesson.id,
      lessonNumber: sgkLessonNum,
      title: cleanContentWithoutNls(sgkLesson.title),
      shortTitle: cleanContentWithoutNls(sgkLesson.shortTitle),
      chapterId: chapter.id,
      chapterTitle: cleanContentWithoutNls(chapter.title),
      chapterNumber: chapter.chapterNumber,
      sgkPeriods: sgkLesson.periods || 2,
      ppctPeriods,
      effectivePeriods,
      ppctWeeksText,
      ppctPeriodsText,
      matchingPpctLessons,
      matchStatus,
      statusLabel,
      isSelected,
      objectives: {
        nhanBiet: cleanContentWithoutNls(sgkLesson.objectives?.nhanBiet || ''),
        thongHieu: cleanContentWithoutNls(sgkLesson.objectives?.thongHieu || ''),
        vanDung: cleanContentWithoutNls(sgkLesson.objectives?.vanDung || ''),
      },
      timeRatioPct: 0,
      balancedScore: 0,
    };
  });

  const totalSgkPeriods = chapter.lessons.reduce((s, l) => s + (l.periods || 2), 0);
  const totalPpctPeriods = reconciledLessons.reduce((s, l) => s + l.ppctPeriods, 0);
  const totalEffectivePeriods = reconciledLessons.reduce(
    (s, l) => s + (l.isSelected ? l.effectivePeriods : 0),
    0
  );

  return {
    chapterId: chapter.id,
    chapterTitle: cleanContentWithoutNls(chapter.title),
    chapterNumber: chapter.chapterNumber,
    totalSgkPeriods,
    totalPpctPeriods,
    totalEffectivePeriods,
    lessons: reconciledLessons,
  };
}

/**
 * Tính toán số tiết và phân chia điểm cân đối (Tổng 10.0 điểm, chuẩn 4 mức độ hoặc Bộ GD&ĐT 2025)
 */
export function calculateBalancedDistribution(
  lessons: ReconciledLessonItem[],
  options?: {
    targetScore?: number; // Mặc định 10.0
    structureType?: 'moet_2025_new' | 'standard_2018';
  }
): ReconciledLessonItem[] {
  const targetScore = options?.targetScore ?? 10.0;
  const structureType = options?.structureType ?? 'moet_2025_new';

  const selectedLessons = lessons.filter((l) => l.isSelected);
  if (selectedLessons.length === 0) {
    return lessons.map((l) => ({ ...l, timeRatioPct: 0, balancedScore: 0 }));
  }

  const grandTotalPeriods = selectedLessons.reduce((s, l) => s + l.effectivePeriods, 0) || 1;

  // Tính điểm phân chia cân đối sơ bộ
  let accumulatedScore = 0;
  const scoreMap = new Map<string, { timeRatioPct: number; balancedScore: number }>();

  selectedLessons.forEach((l, idx) => {
    const isLast = idx === selectedLessons.length - 1;
    const weight = l.effectivePeriods / grandTotalPeriods;
    const timeRatioPct = Math.round(weight * 100);

    const rawScore = (l.effectivePeriods * targetScore) / grandTotalPeriods;
    let roundedScore = Math.round(rawScore * 2) / 2; // Làm tròn đến 0.5

    if (isLast) {
      roundedScore = Math.max(0.5, Number((targetScore - accumulatedScore).toFixed(1)));
    } else {
      accumulatedScore += roundedScore;
    }

    scoreMap.set(l.id, {
      timeRatioPct,
      balancedScore: roundedScore,
    });
  });

  // Phân bổ câu hỏi theo cấu trúc Bộ GD&ĐT 2025:
  // 12 câu Nhiều lựa chọn (0.25đ = 3.0đ)
  // 2 câu Đúng/Sai (1.0đ = 2.0đ)
  // 4 câu Trả lời ngắn (0.5đ = 2.0đ)
  // 3 bài Tự luận (1.0đ = 3.0đ)
  const TARGET_D1_NB = 6;
  const TARGET_D1_TH = 6;
  const TARGET_D2_NB = 1;
  const TARGET_D2_TH = 1;
  const TARGET_D3_NB = 1;
  const TARGET_D3_TH = 3;
  const TARGET_TL_VD = 2;
  const TARGET_TL_VDC = 1;

  let remD1_NB = TARGET_D1_NB;
  let remD1_TH = TARGET_D1_TH;
  let remD2_NB = TARGET_D2_NB;
  let remD2_TH = TARGET_D2_TH;
  let remD3_NB = TARGET_D3_NB;
  let remD3_TH = TARGET_D3_TH;
  let remTL_VD = TARGET_TL_VD;
  let remTL_VDC = TARGET_TL_VDC;

  const countSelected = selectedLessons.length;
  const questionMap = new Map<string, ReconciledLessonItem['allocatedQuestions']>();

  selectedLessons.forEach((l, idx) => {
    const isLast = idx === countSelected - 1;
    const weight = l.effectivePeriods / grandTotalPeriods;

    // 1. Phân bổ Dạng I (Nhiều lựa chọn)
    let d1_nb = isLast ? remD1_NB : Math.min(remD1_NB, Math.round(weight * TARGET_D1_NB));
    if (d1_nb < 0) d1_nb = 0;
    remD1_NB -= d1_nb;

    let d1_th = isLast ? remD1_TH : Math.min(remD1_TH, Math.round(weight * TARGET_D1_TH));
    if (d1_th < 0) d1_th = 0;
    remD1_TH -= d1_th;

    // 2. Phân bổ Dạng II (Đúng/Sai)
    let d2_nb = 0;
    if (idx === 0 && remD2_NB > 0) {
      d2_nb = 1;
      remD2_NB -= 1;
    } else if (isLast && remD2_NB > 0) {
      d2_nb = remD2_NB;
      remD2_NB = 0;
    }

    let d2_th = 0;
    const midIdx = Math.floor(countSelected / 2);
    if (idx === midIdx && remD2_TH > 0) {
      d2_th = 1;
      remD2_TH -= 1;
    } else if (isLast && remD2_TH > 0) {
      d2_th = remD2_TH;
      remD2_TH = 0;
    }

    // 3. Phân bổ Dạng III (Trả lời ngắn)
    let d3_nb = 0;
    if (idx === 0 && remD3_NB > 0) {
      d3_nb = 1;
      remD3_NB -= 1;
    } else if (isLast && remD3_NB > 0) {
      d3_nb = remD3_NB;
      remD3_NB = 0;
    }

    let d3_th = 0;
    if (idx > 0 && remD3_TH > 0) {
      d3_th = Math.min(remD3_TH, 1);
      remD3_TH -= d3_th;
    }
    if (isLast && remD3_TH > 0) {
      d3_th += remD3_TH;
      remD3_TH = 0;
    }

    // 4. Phân bổ Tự luận
    let tl_vd = 0;
    if ((idx === midIdx || idx === 0) && remTL_VD > 0) {
      tl_vd = 1;
      remTL_VD -= 1;
    } else if (isLast && remTL_VD > 0) {
      tl_vd = remTL_VD;
      remTL_VD = 0;
    }

    let tl_vdc = 0;
    if (isLast && remTL_VDC > 0) {
      tl_vdc = remTL_VDC;
      remTL_VDC = 0;
    }

    questionMap.set(l.id, {
      nlc: { biet: d1_nb, hieu: d1_th },
      ds: { biet: d2_nb, hieu: d2_th },
      tln: { biet: d3_nb, hieu: d3_th },
      tl: { vanDung: tl_vd, vanDungCao: tl_vdc },
    });
  });

  return lessons.map((l) => {
    if (!l.isSelected) {
      return {
        ...l,
        timeRatioPct: 0,
        balancedScore: 0,
        allocatedQuestions: {
          nlc: { biet: 0, hieu: 0 },
          ds: { biet: 0, hieu: 0 },
          tln: { biet: 0, hieu: 0 },
          tl: { vanDung: 0, vanDungCao: 0 },
        },
      };
    }

    const calc = scoreMap.get(l.id) || { timeRatioPct: 0, balancedScore: 0 };
    const q = questionMap.get(l.id) || {
      nlc: { biet: 0, hieu: 0 },
      ds: { biet: 0, hieu: 0 },
      tln: { biet: 0, hieu: 0 },
      tl: { vanDung: 0, vanDungCao: 0 },
    };

    return {
      ...l,
      timeRatioPct: calc.timeRatioPct,
      balancedScore: calc.balancedScore,
      allocatedQuestions: q,
    };
  });
}

/**
 * Chuyển đổi danh sách bài học đã đối chiếu và cân đối thành MatrixRow[]
 */
export function convertReconciledLessonsToMatrixRows(
  lessons: ReconciledLessonItem[],
  chapterTitle: string
): MatrixRow[] {
  const selected = lessons.filter((l) => l.isSelected);

  return selected.map((l, index) => {
    const q = l.allocatedQuestions || {
      nlc: { biet: 0, hieu: 0 },
      ds: { biet: 0, hieu: 0 },
      tln: { biet: 0, hieu: 0 },
      tl: { vanDung: 0, vanDungCao: 0 },
    };

    const nb_tn = q.nlc.biet + q.ds.biet + q.tln.biet;
    const th_tn = q.nlc.hieu + q.ds.hieu + q.tln.hieu;

    return {
      id: `reconciled-row-${index + 1}-${Date.now()}`,
      tt: index + 1,
      chuong: l.chapterTitle || chapterTitle,
      noiDung: l.title,
      soTiet: l.effectivePeriods,
      tiLeThoiLuong: l.timeRatioPct,
      nhieuLuaChon: {
        biet: q.nlc.biet,
        hieu: q.nlc.hieu,
        vanDung: 0,
      },
      dungSai: {
        biet: q.ds.biet,
        hieu: q.ds.hieu,
        vanDung: 0,
      },
      traLoiNgan: {
        biet: q.tln.biet,
        hieu: q.tln.hieu,
        vanDung: 0,
      },
      tuLuan: {
        biet: 0,
        hieu: 0,
        vanDung: q.tl.vanDung + q.tl.vanDungCao,
      },
      nhanBiet: {
        tn: nb_tn,
        tl: 0,
        tn1: q.nlc.biet,
        tn2: q.ds.biet,
        tn3: q.tln.biet,
      },
      thongHieu: {
        tn: th_tn,
        tl: 0,
        tn1: q.nlc.hieu,
        tn2: q.ds.hieu,
        tn3: q.tln.hieu,
      },
      vanDung: {
        tn: 0,
        tl: q.tl.vanDung,
        tn1: 0,
        tn2: 0,
        tn3: 0,
      },
      vanDungCao: {
        tn: 0,
        tl: q.tl.vanDungCao,
        tn1: 0,
        tn2: 0,
        tn3: 0,
      },
    };
  });
}
