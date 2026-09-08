import {
  TimetableSlot,
  WeeklyScheduledPeriod,
  TeacherTimetableConfig,
  PpctDataset,
  PpctLesson,
} from '../types';
import {
  defaultPpctDataset9,
  defaultPpctDataset7,
  defaultPpctDataset8,
  defaultPpctDataset6,
} from '../data/defaultData';
import { parseDate, formatDateVN, getDayOfWeekVN } from './dateCalculations';

// Cung cấp thời khóa biểu mặc định áp dụng từ ngày 7/9/2026 (Tuần 1)
// Thầy/Cô phụ trách môn Toán Khối 7 & Khối 9 (ví dụ lớp 9A1 & 7A1, mỗi lớp 4 tiết/tuần = 8 tiết/tuần)
export function getDefaultTeacherTimetable(): TeacherTimetableConfig {
  return {
    id: 'default-tkb-toan-7-9',
    teacherName: 'Dương Văn Trong',
    schoolName: 'TRƯỜNG THCS VÀ THPT PHÚ THÀNH',
    academicYear: '2026 - 2027',
    appliedDate: '2026-09-07', // Tuần 1 bắt đầu từ 07/09/2026
    appliedWeek: 1,
    slots: [
      // Khối 9: Lớp 9A1 (4 tiết/tuần)
      {
        id: 'slot-9a1-t2-t1',
        dayOfWeek: 2, // Thứ 2
        period: 1,
        session: 'sang',
        className: '9A1',
        grade: '9',
        subject: 'Toán',
        room: 'Phòng 9A1',
      },
      {
        id: 'slot-9a1-t3-t2',
        dayOfWeek: 3, // Thứ 3
        period: 2,
        session: 'sang',
        className: '9A1',
        grade: '9',
        subject: 'Toán',
        room: 'Phòng 9A1',
      },
      {
        id: 'slot-9a1-t5-t3',
        dayOfWeek: 5, // Thứ 5
        period: 3,
        session: 'sang',
        className: '9A1',
        grade: '9',
        subject: 'Toán',
        room: 'Phòng 9A1',
      },
      {
        id: 'slot-9a1-t6-t1',
        dayOfWeek: 6, // Thứ 6
        period: 1,
        session: 'sang',
        className: '9A1',
        grade: '9',
        subject: 'Toán',
        room: 'Phòng 9A1',
      },

      // Khối 7: Lớp 7A1 (4 tiết/tuần)
      {
        id: 'slot-7a1-t2-t3',
        dayOfWeek: 2, // Thứ 2
        period: 3,
        session: 'sang',
        className: '7A1',
        grade: '7',
        subject: 'Toán',
        room: 'Phòng 7A1',
      },
      {
        id: 'slot-7a1-t4-t1',
        dayOfWeek: 4, // Thứ 4
        period: 1,
        session: 'sang',
        className: '7A1',
        grade: '7',
        subject: 'Toán',
        room: 'Phòng 7A1',
      },
      {
        id: 'slot-7a1-t5-t2',
        dayOfWeek: 5, // Thứ 5
        period: 2,
        session: 'sang',
        className: '7A1',
        grade: '7',
        subject: 'Toán',
        room: 'Phòng 7A1',
      },
      {
        id: 'slot-7a1-t7-t2',
        dayOfWeek: 7, // Thứ 7
        period: 2,
        session: 'sang',
        className: '7A1',
        grade: '7',
        subject: 'Toán',
        room: 'Phòng 7A1',
      },
    ],
    completedLessons: {},
  };
}

// Tính ngày các thứ trong tuần (Thứ 2 đến Thứ 7)
export function getWeekDates(startDateWeek1: string, weekNumber: number): { dayOfWeek: number; date: Date; dateStr: string; dateFormatted: string; dayName: string }[] {
  const baseStart = parseDate(startDateWeek1);
  const daysOffset = (weekNumber - 1) * 7;
  const monday = new Date(baseStart.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  const days: { dayOfWeek: number; date: Date; dateStr: string; dateFormatted: string; dayName: string }[] = [];
  const dayNames = ['', '', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

  for (let dow = 2; dow <= 7; dow++) {
    const currentDay = new Date(monday.getTime() + (dow - 2) * 24 * 60 * 60 * 1000);
    const y = currentDay.getFullYear();
    const m = (currentDay.getMonth() + 1).toString().padStart(2, '0');
    const d = currentDay.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    days.push({
      dayOfWeek: dow,
      date: currentDay,
      dateStr,
      dateFormatted: formatDateVN(currentDay),
      dayName: dayNames[dow],
    });
  }

  return days;
}

// Mở rộng toàn bộ tiết học trong PPCT thành mảng tuần tự từ tiết 1 -> 140
export interface ExpandedLessonPeriod {
  periodNumber: number; // 1 -> 140
  lesson: PpctLesson;
  subPeriod: number; // 1..soTiet
  totalSubPeriods: number;
}

export function expandPpctLessons(dataset: PpctDataset): Map<number, ExpandedLessonPeriod> {
  const map = new Map<number, ExpandedLessonPeriod>();
  if (!dataset || !dataset.lessons || dataset.lessons.length === 0) {
    return map;
  }

  let runningPeriod = 1;
  dataset.lessons.forEach((l) => {
    const count = l.soTiet && l.soTiet > 0 ? l.soTiet : 1;
    for (let sub = 1; sub <= count; sub++) {
      map.set(runningPeriod, {
        periodNumber: runningPeriod,
        lesson: l,
        subPeriod: sub,
        totalSubPeriods: count,
      });
      runningPeriod++;
    }
  });

  return map;
}

// Tìm PPCT phù hợp nhất cho Khối hoặc Lớp
export function findMatchingPpct(datasets: PpctDataset[], grade: string, className?: string): PpctDataset {
  // 1. Tìm dataset có className khớp
  if (className) {
    const classMatch = datasets.find(
      (d) => d.className?.toLowerCase() === className.toLowerCase()
    );
    if (classMatch && classMatch.lessons?.length > 0) return classMatch;
  }

  // 2. Tìm dataset có grade khớp do người dùng tải lên
  const gradeMatch = datasets.find((d) => (d.grade || '9') === grade);
  if (gradeMatch && gradeMatch.lessons?.length > 0) return gradeMatch;

  // 3. Fallback PPCT chuẩn môn Toán theo khối
  if (grade === '7') return defaultPpctDataset7;
  if (grade === '9') return defaultPpctDataset9;
  if (grade === '6') return defaultPpctDataset6;
  if (grade === '8') return defaultPpctDataset8;

  return defaultPpctDataset9;
}

// Xếp nội dung PPCT trực tiếp vào Thời khóa biểu cho 1 tuần cụ thể
export function generateWeeklySchedule(
  timetableConfig: TeacherTimetableConfig,
  datasets: PpctDataset[],
  weekNumber: number,
  startDateWeek1: string = '2026-09-07'
): WeeklyScheduledPeriod[] {
  if (!timetableConfig || !timetableConfig.slots || timetableConfig.slots.length === 0) {
    return [];
  }

  const weekDates = getWeekDates(startDateWeek1, weekNumber);
  const dateMap = new Map(weekDates.map((d) => [d.dayOfWeek, d]));

  // Nhóm các slot theo từng Lớp (e.g. 9A1, 7A1)
  const slotsByClass = new Map<string, TimetableSlot[]>();
  timetableConfig.slots.forEach((slot) => {
    const cls = slot.className || 'Toán';
    if (!slotsByClass.has(cls)) {
      slotsByClass.set(cls, []);
    }
    slotsByClass.get(cls)!.push(slot);
  });

  const scheduledPeriods: WeeklyScheduledPeriod[] = [];

  // Với mỗi lớp, sắp xếp các tiết trong tuần theo thứ tự thời gian chuẩn (Thứ 2 -> Thứ 7, Sáng -> Chiều, Tiết 1 -> 5)
  slotsByClass.forEach((classSlots, className) => {
    const sortedSlots = [...classSlots].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      const sessA = a.session === 'chieu' ? 1 : 0;
      const sessB = b.session === 'chieu' ? 1 : 0;
      if (sessA !== sessB) return sessA - sessB;
      return a.period - b.period;
    });

    const grade = sortedSlots[0]?.grade || className.replace(/\D/g, '') || '9';
    const ppct = findMatchingPpct(datasets, grade, className);
    const expandedMap = expandPpctLessons(ppct);

    const periodsPerWeekForClass = sortedSlots.length; // Thường là 4 tiết/tuần
    const basePeriodOffset = (weekNumber - 1) * periodsPerWeekForClass;

    sortedSlots.forEach((slot, slotIndex) => {
      const currentPeriodNumber = basePeriodOffset + slotIndex + 1;
      const lessonInfo = expandedMap.get(currentPeriodNumber);
      const dayInfo = dateMap.get(slot.dayOfWeek);

      const isCompleted = !!timetableConfig.completedLessons?.[`${className}_tiet_${currentPeriodNumber}`];

      let baiHocText = lessonInfo ? lessonInfo.lesson.baiHoc : `Tiết ${currentPeriodNumber} (Theo PPCT Toán ${grade})`;
      if (lessonInfo && lessonInfo.totalSubPeriods > 1) {
        baiHocText += ` (Tiết ${lessonInfo.subPeriod}/${lessonInfo.totalSubPeriods})`;
      }

      scheduledPeriods.push({
        slotId: slot.id,
        dayOfWeek: slot.dayOfWeek,
        dateStr: dayInfo?.dateStr || '',
        dateFormatted: dayInfo?.dateFormatted || '',
        dayName: dayInfo?.dayName || `Thứ ${slot.dayOfWeek}`,
        period: slot.period,
        session: slot.session || 'sang',
        className: slot.className,
        grade,
        subject: slot.subject || 'Toán',
        room: slot.room,

        tietPpctNumber: currentPeriodNumber,
        lessonId: lessonInfo?.lesson.id,
        baiHoc: baiHocText,
        chuong: lessonInfo?.lesson.chuong || '',
        soTietCuaBai: lessonInfo?.totalSubPeriods || 1,
        tietThuCuaBai: lessonInfo?.subPeriod || 1,
        hocKy: lessonInfo?.lesson.hocKy || (weekNumber <= 18 ? 1 : 2),
        tuanPpct: lessonInfo?.lesson.tuan || weekNumber,
        ghiChu: lessonInfo?.lesson.ghiChu,
        completed: isCompleted,
      });
    });
  });

  // Sắp xếp lại toàn bộ danh sách tiết dạy trong tuần theo trình tự ngày và tiết
  return scheduledPeriods.sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    const sessA = a.session === 'chieu' ? 1 : 0;
    const sessB = b.session === 'chieu' ? 1 : 0;
    if (sessA !== sessB) return sessA - sessB;
    return a.period - b.period;
  });
}

// Lấy danh sách tiết học diễn ra trong ngày hôm nay theo thời gian thực
export function getTodayLessons(
  weeklySchedule: WeeklyScheduledPeriod[],
  todayDateStr: string
): WeeklyScheduledPeriod[] {
  return weeklySchedule.filter((p) => p.dateStr === todayDateStr);
}
