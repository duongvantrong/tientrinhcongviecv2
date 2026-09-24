import { BankQuestionTemplate } from '../types';
import {
  CURRICULUM_GRADE_9_QUESTIONS,
  CURRICULUM_GRADE_8_QUESTIONS,
  CURRICULUM_GRADE_7_QUESTIONS,
  CURRICULUM_GRADE_6_QUESTIONS,
} from '../data/curriculumMathBank';
import {
  GRADE_9_GEOMETRY_QUESTIONS,
  GRADE_8_GEOMETRY_QUESTIONS,
  GRADE_7_GEOMETRY_QUESTIONS,
  GRADE_6_GEOMETRY_QUESTIONS,
  ConcreteGeometryQuestion,
} from './geometryQuestionBank';
import {
  detectCurriculumTopicCluster,
  getCurriculumQuestionsForTopic,
} from './curriculumTopicBank';

export type McqOpt = { key: 'A' | 'B' | 'C' | 'D'; text: string };

/**
 * Kiểm tra xem một đoạn văn bản có chứa từ khóa liên quan đến Hình học hay không
 */
export function isGeometryText(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  const keywords = [
    'hình',
    'hình học',
    'góc',
    'đoạn thẳng',
    'tam giác',
    'tứ giác',
    'đường tròn',
    'thales',
    'thalès',
    'pythagore',
    'pitago',
    'lượng giác',
    'diện tích',
    'chu vi',
    'thể tích',
    'hình chóp',
    'hình trụ',
    'hình nón',
    'hình cầu',
    'lăng trụ',
    'hộp chữ nhật',
    'lập phương',
    'song song',
    'vuông góc',
    'tiếp tuyến',
    'tiếp xúc',
    'cạnh huyền',
    'đường kính',
    'bán kính',
    'dây cung',
    'đối đỉnh',
    'so le trong',
    'đồng vị',
    'trọng tâm',
    'trực tâm',
    'trung trực',
    'phân giác',
    'hình thang',
    'hình bình hành',
    'hình chữ nhật',
    'hình thoi',
    'hình vuông',
    'hình lục giác',
    'trực quan',
    'độ dài',
    'khoảng cách',
  ];
  return keywords.some((kw) => t.includes(kw));
}

/**
 * BỘ TẠO CÂU HỎI TOÁN HỌC CHUẨN XÁC, KHOA HỌC THEO BÀI HỌC VÀ KHỐI LỚP
 * - 100% phương trình, bài toán, hình học có số liệu thật và công thức LaTeX ($...$)
 * - Đảm bảo cân đối cả ĐẠI SỐ và HÌNH HỌC theo PPCT từng tuần
 * - Phù hợp tiêu chuẩn kiểm tra thường xuyên (KTTX) và kiểm tra định kỳ
 */
export function generateConcreteLessonQuestion(
  subject: string,
  grade: string,
  chapter: string,
  lesson: string,
  section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay',
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  usedPrompts: Set<string>,
  targetDomain?: 'algebra' | 'geometry'
): BankQuestionTemplate {
  const normGrade = String(grade || '').replace(/\D/g, '') || '9';
  const combinedText = `${lesson} ${chapter}`.toLowerCase();
  const isGeom =
    targetDomain === 'geometry'
      ? true
      : targetDomain === 'algebra'
      ? false
      : isGeometryText(combinedText);

  // 1. Nếu là câu hỏi trắc nghiệm Hình học (Part 1 MCQ), sử dụng ngân hàng hình học chuyên sâu 80+ câu
  if (isGeom && section === 'part1_mcq') {
    let geomBank: ConcreteGeometryQuestion[] = [];
    if (normGrade === '9') geomBank = GRADE_9_GEOMETRY_QUESTIONS;
    else if (normGrade === '8') geomBank = GRADE_8_GEOMETRY_QUESTIONS;
    else if (normGrade === '7') geomBank = GRADE_7_GEOMETRY_QUESTIONS;
    else geomBank = GRADE_6_GEOMETRY_QUESTIONS;

    // 1a. Ưu tiên khớp chính xác mức độ nhận thức VÀ chưa từng xuất hiện trong đề
    const exactLevelUnused = geomBank.filter(
      (q) => q.cognitiveLevel === cognitiveLevel && !usedPrompts.has(q.prompt.trim())
    );
    if (exactLevelUnused.length > 0) {
      const sel = exactLevelUnused[index % exactLevelUnused.length];
      usedPrompts.add(sel.prompt.trim());
      return {
        subject,
        grade: normGrade,
        topicKeywords: sel.topicKeywords,
        chapter: sel.chapter || chapter || 'Hình học',
        lesson: sel.lesson || lesson,
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: sel.cognitiveLevel,
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correctOption,
        solutionExplanation: sel.solutionExplanation,
        learningObjective: sel.learningObjective,
      };
    }

    // 1b. Chưa dùng ở bất kỳ mức độ nào
    const anyUnused = geomBank.filter((q) => !usedPrompts.has(q.prompt.trim()));
    if (anyUnused.length > 0) {
      const sel = anyUnused[index % anyUnused.length];
      usedPrompts.add(sel.prompt.trim());
      return {
        subject,
        grade: normGrade,
        topicKeywords: sel.topicKeywords,
        chapter: sel.chapter || chapter || 'Hình học',
        lesson: sel.lesson || lesson,
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: cognitiveLevel,
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correctOption,
        solutionExplanation: sel.solutionExplanation,
        learningObjective: sel.learningObjective,
      };
    }

    // 1c. Khớp chính xác mức độ nhận thức
    const exactLevel = geomBank.filter((q) => q.cognitiveLevel === cognitiveLevel);
    if (exactLevel.length > 0) {
      const sel = exactLevel[index % exactLevel.length];
      return {
        subject,
        grade: normGrade,
        topicKeywords: sel.topicKeywords,
        chapter: sel.chapter || chapter || 'Hình học',
        lesson: sel.lesson || lesson,
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: sel.cognitiveLevel,
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correctOption,
        solutionExplanation: sel.solutionExplanation,
        learningObjective: sel.learningObjective,
      };
    }
  }

  // 2. Ưu tiên tuyệt đối ngân hàng câu hỏi chuẩn PPCT & SGK của từng bài học
  const topicClusterQuestions = getCurriculumQuestionsForTopic(normGrade, lesson, chapter);
  if (topicClusterQuestions && topicClusterQuestions.length > 0) {
    const matchingCluster = topicClusterQuestions.filter(
      (q) => q.section === section && !usedPrompts.has(q.prompt)
    );
    if (matchingCluster.length > 0) {
      const exactLevel = matchingCluster.filter((q) => q.cognitiveLevel === cognitiveLevel);
      const chosen = exactLevel.length > 0
        ? exactLevel[index % exactLevel.length]
        : matchingCluster[index % matchingCluster.length];
      usedPrompts.add(chosen.prompt);
      return { ...chosen, source: 'ai_system' };
    }
  }

  // 3. Kiểm tra trong ngân hàng câu hỏi bám sát chương trình (Curriculum Bank)
  let gradeBank: BankQuestionTemplate[] = [];
  if (normGrade === '9') gradeBank = CURRICULUM_GRADE_9_QUESTIONS;
  else if (normGrade === '8') gradeBank = CURRICULUM_GRADE_8_QUESTIONS;
  else if (normGrade === '7') gradeBank = CURRICULUM_GRADE_7_QUESTIONS;
  else if (normGrade === '6') gradeBank = CURRICULUM_GRADE_6_QUESTIONS;

  // Lọc theo section, chưa dùng, và khớp thể loại (Hình học / Đại số)
  const matchingBankQuestions = gradeBank.filter((q) => {
    if (q.section !== section) return false;
    if (usedPrompts.has(q.prompt)) return false;
    const qIsGeom = isGeometryText(q.prompt + ' ' + (q.topicKeywords || []).join(' ') + ' ' + (q.lesson || ''));
    if (isGeom !== qIsGeom) return false;
    // Khớp từ khóa chủ đề nếu có
    const hasTopicMatch = (q.topicKeywords || []).some((kw) => combinedText.includes(kw.toLowerCase()));
    return hasTopicMatch;
  });

  if (matchingBankQuestions.length > 0) {
    const exactLevel = matchingBankQuestions.filter((q) => q.cognitiveLevel === cognitiveLevel);
    const chosen = exactLevel.length > 0 ? exactLevel[index % exactLevel.length] : matchingBankQuestions[index % matchingBankQuestions.length];
    usedPrompts.add(chosen.prompt);
    return chosen;
  }

  // 4. Nếu không tìm thấy trong ngân hàng sẵn có, sinh câu hỏi toán học cụ thể dựa vào khối và thể loại
  if (normGrade === '9') {
    return generateGrade9Concrete(subject, chapter, lesson, section, cognitiveLevel, index, isGeom, usedPrompts);
  } else if (normGrade === '8') {
    return generateGrade8Concrete(subject, chapter, lesson, section, cognitiveLevel, index, isGeom, usedPrompts);
  } else if (normGrade === '7') {
    return generateGrade7Concrete(subject, chapter, lesson, section, cognitiveLevel, index, isGeom, usedPrompts);
  } else {
    return generateGrade6Concrete(subject, chapter, lesson, section, cognitiveLevel, index, isGeom, usedPrompts);
  }
}

function selectVariant<T extends { prompt: string; level: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao' }>(
  variants: T[],
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  usedPrompts: Set<string>
): T {
  // 1. Khớp chính xác mức độ nhận thức VÀ chưa từng dùng trong đề
  const exactUnused = variants.filter(
    (v) => v.level === cognitiveLevel && !usedPrompts.has(v.prompt.trim())
  );
  if (exactUnused.length > 0) {
    const sel = exactUnused[index % exactUnused.length];
    usedPrompts.add(sel.prompt.trim());
    return sel;
  }

  // 2. Chưa dùng trong đề ở bất kỳ mức độ nào
  const anyUnused = variants.filter((v) => !usedPrompts.has(v.prompt.trim()));
  if (anyUnused.length > 0) {
    const sel = anyUnused[index % anyUnused.length];
    usedPrompts.add(sel.prompt.trim());
    return sel;
  }

  // 3. Khớp chính xác mức độ nhận thức
  const exact = variants.filter((v) => v.level === cognitiveLevel);
  if (exact.length > 0) {
    const sel = exact[index % exact.length];
    usedPrompts.add(sel.prompt.trim());
    return sel;
  }

  const sel = variants[index % variants.length];
  usedPrompts.add(sel.prompt.trim());
  return sel;
}

function pickUnused<T extends { prompt: string }>(
  items: T[],
  index: number,
  usedPrompts: Set<string>
): T {
  const unused = items.filter((item) => !usedPrompts.has(item.prompt.trim()));
  if (unused.length > 0) {
    const chosen = unused[index % unused.length];
    usedPrompts.add(chosen.prompt.trim());
    return chosen;
  }
  const chosen = items[index % items.length];
  usedPrompts.add(chosen.prompt.trim());
  return chosen;
}

// ============================================================================
// BỘ SINH DỮ LIỆU CỤ THỂ KHỐI 9
// ============================================================================

function generateGrade9Concrete(
  subject: string,
  chapter: string,
  lesson: string,
  section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay',
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  isGeom: boolean = false,
  usedPrompts: Set<string> = new Set()
): BankQuestionTemplate {
  // PHẦN 1: TRẮC NGHIỆM 4 PHƯƠNG ÁN (MCQ)
  if (section === 'part1_mcq') {
    if (isGeom) {
      const geomVariants: Array<{
        prompt: string;
        options: McqOpt[];
        correctOption: 'A' | 'B' | 'C' | 'D';
        solutionExplanation: string;
        level: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao';
      }> = [
        {
          prompt: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6\\text{ cm}, AC = 8\\text{ cm}$. Giá trị của $\\sin B$ bằng:',
          options: [
            { key: 'A', text: '$\\frac{4}{5}$' },
            { key: 'B', text: '$\\frac{3}{5}$' },
            { key: 'C', text: '$\\frac{4}{3}$' },
            { key: 'D', text: '$\\frac{3}{4}$' },
          ],
          correctOption: 'A',
          solutionExplanation: 'Độ dài cạnh huyền $BC = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. Tỉ số $\\sin B = \\frac{AC}{BC} = \\frac{8}{10} = \\frac{4}{5}$.',
          level: 'nhanBiet',
        },
        {
          prompt: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Hệ thức nào sau đây là đúng?',
          options: [
            { key: 'A', text: '$AH^2 = BH \\cdot CH$' },
            { key: 'B', text: '$AH^2 = AB \\cdot AC$' },
            { key: 'C', text: '$AB^2 = BH \\cdot CH$' },
            { key: 'D', text: '$AC^2 = BH \\cdot BC$' },
          ],
          correctOption: 'A',
          solutionExplanation: 'Theo hệ thức lượng trong tam giác vuông: Bình phương đường cao ứng với cạnh huyền bằng tích hai hình chiếu của hai cạnh góc vuông trên cạnh huyền ($AH^2 = BH \\cdot CH$).',
          level: 'nhanBiet',
        },
        {
          prompt: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $BH = 4\\text{ cm}, CH = 9\\text{ cm}$. Độ dài đường cao $AH$ bằng:',
          options: [
            { key: 'A', text: '$6\\text{ cm}$' },
            { key: 'B', text: '$36\\text{ cm}$' },
            { key: 'C', text: '$13\\text{ cm}$' },
            { key: 'D', text: '$6{,}5\\text{ cm}$' },
          ],
          correctOption: 'A',
          solutionExplanation: 'Áp dụng hệ thức $AH^2 = BH \\cdot CH = 4 \\cdot 9 = 36 \\Rightarrow AH = \\sqrt{36} = 6\\text{ cm}$.',
          level: 'thongHieu',
        },
        {
          prompt: 'Cho góc nhọn $\\alpha$. Biết $\\sin \\alpha = 0{,}6$. Giá trị của $\\cos \\alpha$ bằng:',
          options: [
            { key: 'A', text: '$0{,}8$' },
            { key: 'B', text: '$0{,}4$' },
            { key: 'C', text: '$0{,}64$' },
            { key: 'D', text: '$0{,}36$' },
          ],
          correctOption: 'A',
          solutionExplanation: 'Áp dụng công thức $\\sin^2 \\alpha + \\cos^2 \\alpha = 1 \\Rightarrow \\cos^2 \\alpha = 1 - 0{,}6^2 = 0{,}64 \\Rightarrow \\cos \\alpha = 0{,}8$.',
          level: 'thongHieu',
        },
        {
          prompt: 'Một cái thang dài $4\\text{ m}$ dựa vào một bức tường tạo với mặt đất một góc $60^\\circ$. Chiều cao bức tường từ mặt đất đến đỉnh thang bằng:',
          options: [
            { key: 'A', text: '$2\\sqrt{3}\\text{ m}$' },
            { key: 'B', text: '$2\\text{ m}$' },
            { key: 'C', text: '$4\\sqrt{3}\\text{ m}$' },
            { key: 'D', text: '$3\\sqrt{2}\\text{ m}$' },
          ],
          correctOption: 'A',
          solutionExplanation: 'Chiều cao chạm tường $h = 4 \\cdot \\sin 60^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}\\text{ m}$.',
          level: 'vanDung',
        },
      ];
      const sel = geomVariants[index % geomVariants.length];
      return {
        subject,
        grade: '9',
        topicKeywords: [lesson, 'hình học', 'lượng giác', 'hệ thức lượng'],
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: cognitiveLevel || sel.level,
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correctOption,
        solutionExplanation: sel.solutionExplanation,
        learningObjective: 'Đánh giá kiến thức hệ thức lượng trong tam giác vuông và tỉ số lượng giác góc nhọn.',
      };
    }

    // Đại số Khối 9
    const algVariants: Array<{
      prompt: string;
      options: McqOpt[];
      correctOption: 'A' | 'B' | 'C' | 'D';
      solutionExplanation: string;
      level: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao';
    }> = [
      {
        prompt: 'Nghiệm của hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ là cặp số $(x; y)$ bằng:',
        options: [
          { key: 'A', text: '$(2; 1)$' },
          { key: 'B', text: '$(1; 2)$' },
          { key: 'C', text: '$(3; -1)$' },
          { key: 'D', text: '$(0; 5)$' },
        ],
        correctOption: 'A',
        solutionExplanation: 'Cộng hai vế: $3x = 6 \\Leftrightarrow x = 2$. Thay vào $x - y = 1 \\Rightarrow y = 1$. Cặp nghiệm là $(2; 1)$.',
        level: 'nhanBiet',
      },
      {
        prompt: 'Phương trình nào dưới đây là phương trình bậc nhất hai ẩn $x$ và $y$?',
        options: [
          { key: 'A', text: '$3x - 5y = 2$' },
          { key: 'B', text: '$2x^2 + y = 0$' },
          { key: 'C', text: '$x - \\frac{2}{y} = 4$' },
          { key: 'D', text: '$xy = 3$' },
        ],
        correctOption: 'A',
        solutionExplanation: 'Phương trình bậc nhất hai ẩn có dạng $ax + by = c$ với $a, b$ không đồng thời bằng $0$. Do đó $3x - 5y = 2$ là phương trình bậc nhất hai ẩn.',
        level: 'nhanBiet',
      },
      {
        prompt: 'Tập nghiệm của phương trình tích $(2x - 6)(x + 1) = 0$ là:',
        options: [
          { key: 'A', text: '$S = \\{3; -1\\}$' },
          { key: 'B', text: '$S = \\{-3; 1\\}$' },
          { key: 'C', text: '$S = \\{3; 1\\}$' },
          { key: 'D', text: '$S = \\{-3; -1\\}$' },
        ],
        correctOption: 'A',
        solutionExplanation: '$2x - 6 = 0 \\Leftrightarrow x = 3$ hoặc $x + 1 = 0 \\Leftrightarrow x = -1$. Vậy $S = \\{3; -1\\}$.',
        level: 'nhanBiet',
      },
      {
        prompt: 'Điều kiện xác định của phương trình $\\frac{x - 1}{x + 2} = \\frac{3}{x - 4}$ là:',
        options: [
          { key: 'A', text: '$x \\ne -2$ và $x \\ne 4$' },
          { key: 'B', text: '$x \\ne 2$ và $x \\ne -4$' },
          { key: 'C', text: '$x \\ne 1$ và $x \\ne 3$' },
          { key: 'D', text: '$x \\ne -2$' },
        ],
        correctOption: 'A',
        solutionExplanation: 'Mẫu thức khác không: $x + 2 \\ne 0 \\Leftrightarrow x \\ne -2$ và $x - 4 \\ne 0 \\Leftrightarrow x \\ne 4$.',
        level: 'nhanBiet',
      },
      {
        prompt: 'Biểu thức $\\sqrt{4x - 8}$ xác định khi và chỉ khi:',
        options: [
          { key: 'A', text: '$x \\ge 2$' },
          { key: 'B', text: '$x > 2$' },
          { key: 'C', text: '$x \\le 2$' },
          { key: 'D', text: '$x \\ge -2$' },
        ],
        correctOption: 'A',
        solutionExplanation: 'Biểu thức dưới căn không âm: $4x - 8 \\ge 0 \\Leftrightarrow 4x \\ge 8 \\Leftrightarrow x \\ge 2$.',
        level: 'thongHieu',
      },
    ];
    const sel = selectVariant(algVariants, cognitiveLevel, index, usedPrompts);
    return {
      subject,
      grade: '9',
      topicKeywords: [lesson, 'đại số', 'phương trình'],
      section: 'part1_mcq',
      type: 'multiple_choice',
      cognitiveLevel: cognitiveLevel || sel.level,
      prompt: sel.prompt,
      options: sel.options,
      correctOption: sel.correctOption,
      solutionExplanation: sel.solutionExplanation,
      learningObjective: 'Đánh giá kiến thức phương trình, hệ phương trình và căn thức bậc hai.',
    };
  }

  // PHẦN 2: TRẮC NGHIỆM ĐÚNG SAI (TRUE/FALSE)
  if (section === 'part2_true_false') {
    if (isGeom) {
      return {
        subject,
        grade: '9',
        topicKeywords: [lesson, 'hình học', 'hệ thức lượng', 'đúng sai'],
        section: 'part2_true_false',
        type: 'true_false',
        cognitiveLevel: 'thongHieu',
        prompt: 'Cho tam giác $ABC$ vuông tại $A$, có đường cao $AH$. Biết $AB = 9\\text{ cm}, AC = 12\\text{ cm}$. Xét tính Đúng/Sai của các khẳng định sau:',
        tfStatements: [
          { subKey: 'a', text: 'Cạnh huyền $BC$ có độ dài bằng $15\\text{ cm}$.', isCorrect: true, explanation: 'Đúng vì $BC = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$.' },
          { subKey: 'b', text: 'Đường cao $AH$ có độ dài bằng $7{,}2\\text{ cm}$.', isCorrect: true, explanation: 'Đúng vì $AH = \\frac{AB \\cdot AC}{BC} = \\frac{9 \\cdot 12}{15} = 7{,}2\\text{ cm}$.' },
          { subKey: 'c', text: 'Tỉ số lượng giác $\\sin B = 0{,}8$.', isCorrect: true, explanation: 'Đúng vì $\\sin B = \\frac{AC}{BC} = \\frac{12}{15} = 0{,}8$.' },
          { subKey: 'd', text: 'Hình chiếu $BH$ của cạnh $AB$ trên cạnh huyền có độ dài bằng $6\\text{ cm}$.', isCorrect: false, explanation: 'Sai vì $BH = \\frac{AB^2}{BC} = \\frac{9^2}{15} = \\frac{81}{15} = 5{,}4\\text{ cm}$.' },
        ],
        solutionExplanation: 'Vận dụng định lý Pythagore và hệ thức lượng trong tam giác vuông để tính toán các đoạn thẳng và tỉ số lượng giác.',
        learningObjective: 'Thông hiểu và phân tích tính đúng sai các hệ thức lượng trong tam giác vuông.',
      };
    }

    return {
      subject,
      grade: '9',
      topicKeywords: [lesson, 'hệ phương trình', 'đúng sai'],
      section: 'part2_true_false',
      type: 'true_false',
      cognitiveLevel: 'thongHieu',
      prompt: 'Cho hệ phương trình $\\begin{cases} 2x + y = 4 \\\\ x - y = -1 \\end{cases}$. Xét tính Đúng/Sai của các khẳng định sau:',
      tfStatements: [
        { subKey: 'a', text: 'Cộng từng vế của hai phương trình ta được $3x = 3$.', isCorrect: true, explanation: 'Đúng: $(2x + y) + (x - y) = 4 + (-1) \\Leftrightarrow 3x = 3$.' },
        { subKey: 'b', text: 'Nghiệm $x$ của hệ phương trình bằng $2$.', isCorrect: false, explanation: 'Sai: $3x = 3 \\Leftrightarrow x = 1$.' },
        { subKey: 'c', text: 'Giá trị của $y$ tương ứng bằng $2$.', isCorrect: true, explanation: 'Đúng: $x - y = -1 \\Rightarrow 1 - y = -1 \\Rightarrow y = 2$.' },
        { subKey: 'd', text: 'Cặp số $(1; 2)$ là nghiệm duy nhất của hệ phương trình đã cho.', isCorrect: true, explanation: 'Đúng vì hệ phương trình bậc nhất hai ẩn có định thức khác 0.' },
      ],
      solutionExplanation: 'Cộng đại số triệt tiêu ẩn $y$, giải ra $x = 1$, thay vào tìm $y = 2$.',
      learningObjective: 'Thông hiểu các bước giải hệ phương trình bậc nhất hai ẩn.',
    };
  }

  // PHẦN 3: TRẢ LỜI NGẮN (SHORT ANSWER)
  if (section === 'part3_short_answer') {
    if (isGeom) {
      const geomShortList = [
        { prompt: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 5\\text{ cm}, BC = 13\\text{ cm}$. Tính độ dài cạnh $AC$ theo đơn vị $\\text{cm}$:', ans: '12' },
        { prompt: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $BH = 9\\text{ cm}, CH = 16\\text{ cm}$. Tính độ dài đường cao $AH$ theo đơn vị $\\text{cm}$:', ans: '12' },
        { prompt: 'Cho tam giác $ABC$ vuông tại $A$ có góc $\\widehat{B} = 30^\\circ$ và cạnh huyền $BC = 18\\text{ cm}$. Tính độ dài cạnh đối diện $AC$ theo đơn vị $\\text{cm}$:', ans: '9' },
      ];
      const sel = geomShortList[index % geomShortList.length];
      return {
        subject,
        grade: '9',
        topicKeywords: [lesson, 'hình học', 'trả lời ngắn'],
        section: 'part3_short_answer',
        type: 'short_answer',
        cognitiveLevel: 'thongHieu',
        prompt: sel.prompt,
        shortAnswerText: sel.ans,
        solutionExplanation: `Áp dụng định lý Pythagore và hệ thức lượng tam giác vuông tính được đáp số là ${sel.ans}.`,
        learningObjective: 'Tính toán nhanh độ dài đoạn thẳng trong tam giác vuông.',
      };
    }

    const algShortList = [
      { prompt: 'Tìm nghiệm dương của phương trình $(2x - 8)(x + 5) = 0$. Điền đáp số:', ans: '4' },
      { prompt: 'Tìm giá trị của $x$ trong nghiệm của hệ phương trình $\\begin{cases} 3x + y = 11 \\\\ x - y = 1 \\end{cases}$. Điền đáp số:', ans: '3' },
      { prompt: 'Tìm nghiệm của phương trình $\\frac{x - 3}{x + 1} = 0$. Điền đáp số:', ans: '3' },
    ];
    const sel = algShortList[index % algShortList.length];
    return {
      subject,
      grade: '9',
      topicKeywords: [lesson, 'đại số', 'trả lời ngắn'],
      section: 'part3_short_answer',
      type: 'short_answer',
      cognitiveLevel: 'thongHieu',
      prompt: sel.prompt,
      shortAnswerText: sel.ans,
      solutionExplanation: `Giải phương trình và đối chiếu điều kiện thu được kết quả ${sel.ans}.`,
      learningObjective: 'Tính toán nhanh nghiệm của phương trình hoặc hệ phương trình.',
    };
  }

  // PHẦN 4: TỰ LUẬN (ESSAY)
  if (isGeom) {
    return {
      subject,
      grade: '9',
      topicKeywords: [lesson, 'hình học', 'tự luận', 'kttx'],
      section: 'part4_essay',
      type: 'essay',
      cognitiveLevel: 'vanDung',
      prompt: `BÀI TOÁN HÌNH HỌC (3.0 ĐIỂM):
Cho tam giác $ABC$ vuông tại $A$ có đường cao $AH$ ($H \\in BC$). Biết $AB = 6\\text{ cm}$ và $AC = 8\\text{ cm}$.
a) Tính độ dài cạnh huyền $BC$ và đường cao $AH$. (1.5 điểm)
b) Kẻ $HD \\perp AB$ tại $D$ và $HE \\perp AC$ tại $E$. Chứng minh tứ giác $ADHE$ là hình chữ nhật và tính độ dài đoạn thẳng $DE$. (1.5 điểm)`,
      essayGradingSteps: [
        { step: 'a1) Áp dụng định lý Pythagore trong tam giác vuông $ABC$: $BC = \\sqrt{AB^2 + AC^2} = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.', point: 0.75 },
        { step: 'a2) Áp dụng hệ thức lượng $AH \\cdot BC = AB \\cdot AC \\Rightarrow AH = \\frac{6 \\cdot 8}{10} = 4{,}8\\text{ cm}$.', point: 0.75 },
        { step: 'b1) Tứ giác $ADHE$ có ba góc vuông: $\\widehat{DAE} = \\widehat{ADH} = \\widehat{AEH} = 90^\\circ$ nên $ADHE$ là hình chữ nhật.', point: 0.75 },
        { step: 'b2) Do $ADHE$ là hình chữ nhật nên hai đường chéo bằng nhau: $DE = AH = 4{,}8\\text{ cm}$.', point: 0.75 },
      ],
      solutionExplanation: 'Vẽ hình chuẩn xác, áp dụng định lý Pythagore, hệ thức lượng trong tam giác vuông và tính chất hai đường chéo của hình chữ nhật.',
      learningObjective: 'Vận dụng hệ thức lượng và tính chất tứ giác để tính độ dài và chứng minh hình học.',
    };
  }

  // Đại số Tự luận Khối 9
  const essayAlgList = [
    {
      prompt: `BÀI TOÁN ĐẠI SỐ 1 (3.5 ĐIỂM):
Giải các phương trình và hệ phương trình sau:
a) Giải phương trình tích: $(3x - 9)(x + 2) = 0$ (1.5 điểm)
b) Giải hệ phương trình: $\\begin{cases} 2x - y = 3 \\\\ x + 2y = 4 \\end{cases}$ (2.0 điểm)`,
      steps: [
        { step: 'a) $3x - 9 = 0 \\Leftrightarrow x = 3$ hoặc $x + 2 = 0 \\Leftrightarrow x = -2$. Tập nghiệm $S = \\{3; -2\\}$.', point: 1.5 },
        { step: 'b1) Nhân phương trình thứ nhất với $2$: $4x - 2y = 6$. Cộng với phương trình thứ hai: $5x = 10 \\Leftrightarrow x = 2$.', point: 1.0 },
        { step: 'b2) Thay $x = 2$ vào $2x - y = 3 \\Rightarrow y = 2(2) - 3 = 1$. Kết luận nghiệm duy nhất $(2; 1)$.', point: 1.0 },
      ],
      explanation: 'Dùng phương pháp tích để tách các phương trình bậc nhất một ẩn, và phương pháp cộng đại số để giải hệ phương trình.',
    },
    {
      prompt: `BÀI TOÁN ĐẠI SỐ 2 (3.5 ĐIỂM):
Giải bài toán sau bằng cách lập phương trình hoặc hệ phương trình:
Một tổ sản xuất theo kế hoạch dự định hoàn thành $120$ sản phẩm trong một số ngày quy định. Nhờ cải tiến kỹ thuật, mỗi ngày tổ làm thêm được $2$ sản phẩm nên đã hoàn thành sớm hơn dự định $2$ ngày. Hỏi theo kế hoạch, mỗi ngày tổ phải sản xuất bao nhiêu sản phẩm?`,
      steps: [
        { step: 'Gọi số sản phẩm làm mỗi ngày theo kế hoạch là $x$ ($x \\in \\mathbb{N}^*$). Thời gian dự định là $\\frac{120}{x}$ (ngày).', point: 1.0 },
        { step: 'Thực tế mỗi ngày làm được $x + 2$ sản phẩm. Thời gian thực tế là $\\frac{120}{x + 2}$ (ngày).', point: 1.0 },
        { step: 'Theo đề bài, thời gian thực tế sớm hơn $2$ ngày: $\\frac{120}{x} - \\frac{120}{x + 2} = 2$.', point: 0.75 },
        { step: 'Quy đồng khử mẫu giải được $x = 10$ (thỏa mãn) hoặc $x = -12$ (loại). Kết luận mỗi ngày làm $10$ sản phẩm.', point: 0.75 },
      ],
      explanation: 'Lập phương trình dựa trên mối liên hệ giữa năng suất, thời gian và tổng khối lượng công việc.',
    },
  ];
  const selEssay = essayAlgList[index % essayAlgList.length];
  return {
    subject,
    grade: '9',
    topicKeywords: [lesson, 'tự luận', 'đại số'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: cognitiveLevel || 'thongHieu',
    prompt: selEssay.prompt,
    essayGradingSteps: selEssay.steps,
    solutionExplanation: selEssay.explanation,
    learningObjective: 'Đánh giá năng lực tự luận, trình bày toán học chặt chẽ và tính toán số học chuẩn xác.',
  };
}

// ============================================================================
// BỘ SINH DỮ LIỆU CỤ THỂ KHỐI 8
// ============================================================================

function generateGrade8Concrete(
  subject: string,
  chapter: string,
  lesson: string,
  section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay',
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  isGeom: boolean = false,
  usedPrompts: Set<string> = new Set()
): BankQuestionTemplate {
  if (section === 'part1_mcq') {
    if (isGeom) {
      const g8GeomMcq = [
        {
          prompt: 'Tổng các góc trong một tứ giác lồi luôn bằng:',
          options: [{ key: 'A' as const, text: '$360^\\circ$' }, { key: 'B' as const, text: '$180^\\circ$' }, { key: 'C' as const, text: '$270^\\circ$' }, { key: 'D' as const, text: '$540^\\circ$' }],
          correct: 'A' as const,
          sol: 'Định lý tổng các góc của một tứ giác lồi luôn bằng $360^\\circ$.',
        },
        {
          prompt: 'Cho hình bình hành $ABCD$ có $\\widehat{A} = 70^\\circ$. Số đo của góc $\\widehat{B}$ là:',
          options: [{ key: 'A' as const, text: '$110^\\circ$' }, { key: 'B' as const, text: '$70^\\circ$' }, { key: 'C' as const, text: '$120^\\circ$' }, { key: 'D' as const, text: '$90^\\circ$' }],
          correct: 'A' as const,
          sol: 'Trong hình bình hành, hai góc kề một cạnh bù nhau: $\\widehat{B} = 180^\\circ - 70^\\circ = 110^\\circ$.',
        },
        {
          prompt: 'Hình bình hành có hai đường chéo bằng nhau là hình gì?',
          options: [{ key: 'A' as const, text: 'Hình chữ nhật' }, { key: 'B' as const, text: 'Hình thoi' }, { key: 'C' as const, text: 'Hình vuông' }, { key: 'D' as const, text: 'Hình thang cân' }],
          correct: 'A' as const,
          sol: 'Dấu hiệu nhận biết: Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật.',
        },
        {
          prompt: 'Một hình chóp tam giác đều có diện tích đáy bằng $18\\text{ cm}^2$ và chiều cao bằng $5\\text{ cm}$. Thể tích của hình chóp đó là:',
          options: [{ key: 'A' as const, text: '$30\\text{ cm}^3$' }, { key: 'B' as const, text: '$90\\text{ cm}^3$' }, { key: 'C' as const, text: '$45\\text{ cm}^3$' }, { key: 'D' as const, text: '$60\\text{ cm}^3$' }],
          correct: 'A' as const,
          sol: '$V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot 18 \\cdot 5 = 30\\text{ cm}^3$.',
        },
        {
          prompt: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6\\text{ cm}, AC = 8\\text{ cm}$. Độ dài cạnh huyền $BC$ là:',
          options: [{ key: 'A' as const, text: '$10\\text{ cm}$' }, { key: 'B' as const, text: '$14\\text{ cm}$' }, { key: 'C' as const, text: '$12\\text{ cm}$' }, { key: 'D' as const, text: '$\\sqrt{28}\\text{ cm}$' }],
          correct: 'A' as const,
          sol: 'Định lý Pythagore: $BC = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = 10\\text{ cm}$.',
        },
        {
          prompt: 'Hình thoi có hai đường chéo vuông góc tại trung điểm của mỗi đường và có một góc vuông là hình gì?',
          options: [{ key: 'A' as const, text: 'Hình vuông' }, { key: 'B' as const, text: 'Hình chữ nhật' }, { key: 'C' as const, text: 'Hình bình hành' }, { key: 'D' as const, text: 'Hình thang vuông' }],
          correct: 'A' as const,
          sol: 'Hình thoi có một góc vuông là hình vuông.',
        },
      ];
      const sel = g8GeomMcq[index % g8GeomMcq.length];
      return {
        subject,
        grade: '8',
        topicKeywords: [lesson, 'hình học', 'tứ giác'],
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: 'nhanBiet',
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correct,
        solutionExplanation: sel.sol,
        learningObjective: 'Nhận biết các tính chất hình học tứ giác và hình khối lớp 8.',
      };
    }

    const g8AlgMcq = [
      {
        prompt: 'Khai triển hằng đẳng thức $(x - 5)^2$ ta được kết quả là:',
        options: [
          { key: 'A' as const, text: '$x^2 - 10x + 25$' },
          { key: 'B' as const, text: '$x^2 - 5x + 25$' },
          { key: 'C' as const, text: '$x^2 - 25$' },
          { key: 'D' as const, text: '$x^2 + 10x + 25$' },
        ],
        correct: 'A' as const,
        sol: '$(x - 5)^2 = x^2 - 2(x)(5) + 5^2 = x^2 - 10x + 25$.',
      },
      {
        prompt: 'Phân tích đa thức $x^2 - 9$ thành nhân tử ta được:',
        options: [
          { key: 'A' as const, text: '$(x - 3)(x + 3)$' },
          { key: 'B' as const, text: '$(x - 3)^2$' },
          { key: 'C' as const, text: '$(x + 3)^2$' },
          { key: 'D' as const, text: '$x(x - 9)$' },
        ],
        correct: 'A' as const,
        sol: 'Áp dụng hằng đẳng thức hiệu hai bình phương: $x^2 - 3^2 = (x - 3)(x + 3)$.',
      },
      {
        prompt: 'Điều kiện xác định của phân thức $\\frac{2x + 1}{x - 3}$ là:',
        options: [
          { key: 'A' as const, text: '$x \\ne 3$' },
          { key: 'B' as const, text: '$x \\ne -3$' },
          { key: 'C' as const, text: '$x \\ne -\\frac{1}{2}$' },
          { key: 'D' as const, text: '$x = 3$' },
        ],
        correct: 'A' as const,
        sol: 'Mẫu thức khác $0$: $x - 3 \\ne 0 \\Leftrightarrow x \\ne 3$.',
      },
      {
        prompt: 'Bậc của đa thức $A = 3x^4y - 2xy^3 + 5x^2y^2 - 7$ là:',
        options: [
          { key: 'A' as const, text: '$5$' },
          { key: 'B' as const, text: '$4$' },
          { key: 'C' as const, text: '$7$' },
          { key: 'D' as const, text: '$3$' },
        ],
        correct: 'A' as const,
        sol: 'Hạng tử có bậc cao nhất là $3x^4y$ có bậc là $4 + 1 = 5$.',
      },
      {
        prompt: 'Rút gọn phân thức $\\frac{x^2 - 4}{x - 2}$ với $x \\ne 2$ ta được kết quả:',
        options: [
          { key: 'A' as const, text: '$x + 2$' },
          { key: 'B' as const, text: '$x - 2$' },
          { key: 'C' as const, text: '$1$' },
          { key: 'D' as const, text: '$x^2 - 2$' },
        ],
        correct: 'A' as const,
        sol: '$\\frac{(x-2)(x+2)}{x-2} = x + 2$.',
      },
      {
        prompt: 'Khai triển biểu thức $(2x + 3)^2$ ta được:',
        options: [
          { key: 'A' as const, text: '$4x^2 + 12x + 9$' },
          { key: 'B' as const, text: '$4x^2 + 6x + 9$' },
          { key: 'C' as const, text: '$4x^2 + 9$' },
          { key: 'D' as const, text: '$2x^2 + 12x + 9$' },
        ],
        correct: 'A' as const,
        sol: '$(2x + 3)^2 = (2x)^2 + 2(2x)(3) + 3^2 = 4x^2 + 12x + 9$.',
      },
    ];
    const sel = pickUnused(g8AlgMcq, index, usedPrompts);
    return {
      subject,
      grade: '8',
      topicKeywords: [lesson, 'đại số', 'hằng đẳng thức'],
      section: 'part1_mcq',
      type: 'multiple_choice',
      cognitiveLevel: 'nhanBiet',
      prompt: sel.prompt,
      options: sel.options,
      correctOption: sel.correct,
      solutionExplanation: sel.sol,
      learningObjective: 'Nhận biết các hằng đẳng thức và phân thức đại số lớp 8.',
    };
  }

  // Đúng sai Khối 8
  if (section === 'part2_true_false') {
    if (isGeom) {
      return {
        subject,
        grade: '8',
        topicKeywords: [lesson, 'hình học', 'tứ giác', 'đúng sai'],
        section: 'part2_true_false',
        type: 'true_false',
        cognitiveLevel: 'thongHieu',
        prompt: 'Cho hình chữ nhật $ABCD$ có hai đường chéo $AC$ và $BD$ cắt nhau tại $O$. Xét tính Đúng/Sai của các mệnh đề sau:',
        tfStatements: [
          { subKey: 'a', text: 'Hai đường chéo bằng nhau: $AC = BD$.', isCorrect: true, explanation: 'Đúng theo tính chất hình chữ nhật.' },
          { subKey: 'b', text: 'Hai đường chéo vuông góc với nhau: $AC \\perp BD$.', isCorrect: false, explanation: 'Sai vì hai đường chéo của hình chữ nhật chỉ vuông góc khi nó là hình vuông.' },
          { subKey: 'c', text: 'Điểm $O$ là tâm đối xứng của hình chữ nhật $ABCD$.', isCorrect: true, explanation: 'Đúng vì giao điểm hai đường chéo là tâm đối xứng.' },
          { subKey: 'd', text: 'Bốn đoạn thẳng $OA, OB, OC, OD$ có độ dài bằng nhau.', isCorrect: true, explanation: 'Đúng vì hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường.' },
        ],
        solutionExplanation: 'Vận dụng tính chất hình chữ nhật để xác định tính đúng sai.',
        learningObjective: 'Thông hiểu tính chất các đường chéo và tâm đối xứng của hình chữ nhật.',
      };
    }

    return {
      subject,
      grade: '8',
      topicKeywords: [lesson, 'đại số', 'hằng đẳng thức', 'đúng sai'],
      section: 'part2_true_false',
      type: 'true_false',
      cognitiveLevel: 'thongHieu',
      prompt: 'Xét tính Đúng/Sai của các khẳng định sau về hằng đẳng thức và đa thức:',
      tfStatements: [
        { subKey: 'a', text: '$(A - B)^2 = A^2 - 2AB + B^2$ với mọi biểu thức $A, B$.', isCorrect: true, explanation: 'Đúng theo hằng đẳng thức bình phương một hiệu.' },
        { subKey: 'b', text: '$(x + 2)^3 = x^3 + 8$ với mọi $x$.', isCorrect: false, explanation: 'Sai vì $(x + 2)^3 = x^3 + 6x^2 + 12x + 8$.' },
        { subKey: 'c', text: 'Hiệu hai bình phương: $A^2 - B^2 = (A - B)(A + B)$.', isCorrect: true, explanation: 'Đúng theo hằng đẳng thức hiệu hai bình phương.' },
        { subKey: 'd', text: 'Phân thức $\\frac{x - 1}{x + 1}$ xác định với mọi giá trị $x \\in \\mathbb{R}$.', isCorrect: false, explanation: 'Sai vì phân thức không xác định tại $x = -1$.' },
      ],
      solutionExplanation: 'Áp dụng các hằng đẳng thức đáng nhớ và điều kiện xác định của phân thức đại số.',
      learningObjective: 'Thông hiểu các hằng đẳng thức đáng nhớ và phân thức đại số.',
    };
  }

  // Tự luận Khối 8
  if (section === 'part4_essay') {
    if (isGeom) {
      const g8GeomEssay = [
        {
          prompt: `BÀI TOÁN HÌNH HỌC (3.0 ĐIỂM):
Cho tam giác $ABC$ vuông tại $A$ ($AB < AC$), đường trung tuyến $AM$. Gọi $D$ là điểm đối xứng với $A$ qua $M$.
a) Chứng minh tứ giác $ABDC$ là hình chữ nhật. (1.5 điểm)
b) Cho $AB = 6\\text{ cm}$ và $BC = 10\\text{ cm}$. Tính diện tích tứ giác $ABDC$. (1.5 điểm)`,
          steps: [
            { step: 'a1) Xét tứ giác $ABDC$ có $M$ là trung điểm của $BC$ và $M$ là trung điểm của $AD$ (do $D$ đối xứng với $A$ qua $M$).', point: 0.75 },
            { step: 'a2) Suy ra $ABDC$ là hình bình hành. Lại có $\\widehat{BAC} = 90^\\circ$ nên $ABDC$ là hình chữ nhật.', point: 0.75 },
            { step: 'b1) Áp dụng định lý Pythagore trong tam giác vuông $ABC$: $AC = \\sqrt{BC^2 - AB^2} = \\sqrt{100 - 36} = 8\\text{ cm}$.', point: 0.75 },
            { step: 'b2) Diện tích hình chữ nhật $ABDC$: $S = AB \\cdot AC = 6 \\cdot 8 = 48\\text{ cm}^2$.', point: 0.75 },
          ],
          sol: 'Dấu hiệu nhận biết hình chữ nhật và định lý Pythagore để tính kích thước.',
        },
        {
          prompt: `BÀI TOÁN HÌNH HỌC (3.0 ĐIỂM):
Cho hình thang cân $ABCD$ ($AB // CD, AB < CD$), kẻ hai đường cao $AH$ và $BK$ xuống đáy $CD$.
a) Chứng minh $\\triangle AHD = \\triangle BKC$. (1.5 điểm)
b) Biết $AB = 4\\text{ cm}, CD = 10\\text{ cm}, AD = 5\\text{ cm}$. Tính độ dài đường cao $AH$ và diện tích hình thang $ABCD$. (1.5 điểm)`,
          steps: [
            { step: 'a) $\\triangle AHD$ và $\\triangle BKC$ vuông tại $H, K$ có: $AD = BC$ (hình thang cân), $\\widehat{D} = \\widehat{C}$. Do đó $\\triangle AHD = \\triangle BKC$ (cạnh huyền - góc nhọn).', point: 1.5 },
            { step: 'b1) Suy ra $DH = KC = \\frac{CD - AB}{2} = \\frac{10 - 4}{2} = 3\\text{ cm}$. Áp dụng định lý Pythagore: $AH = \\sqrt{AD^2 - DH^2} = \\sqrt{25 - 9} = 4\\text{ cm}$.', point: 0.75 },
            { step: 'b2) Diện tích hình thang: $S = \\frac{(AB + CD) \\cdot AH}{2} = \\frac{(4 + 10) \\cdot 4}{2} = 28\\text{ cm}^2$.', point: 0.75 },
          ],
          sol: 'Tính chất hình thang cân và định lý Pythagore trong tam giác vuông.',
        },
      ];
      const selE = g8GeomEssay[index % g8GeomEssay.length];
      return {
        subject,
        grade: '8',
        topicKeywords: [lesson, 'hình học', 'tứ giác', 'tự luận'],
        section: 'part4_essay',
        type: 'essay',
        cognitiveLevel: 'vanDung',
        prompt: selE.prompt,
        essayGradingSteps: selE.steps,
        solutionExplanation: selE.sol,
        learningObjective: 'Vận dụng chứng minh hình học và tính toán kích thước, diện tích.',
      };
    }

    const g8AlgEssay = [
      {
        prompt: `BÀI TOÁN ĐẠI SỐ (3.5 ĐIỂM):
Rút gọn các biểu thức đại số sau:
a) $A = (x + 3)^2 + (x - 3)^2$ (1.5 điểm)
b) $B = (2x - 1)(2x + 1) - 4x(x - 2)$ (2.0 điểm)`,
        steps: [
          { step: 'a) $A = (x^2 + 6x + 9) + (x^2 - 6x + 9) = 2x^2 + 18$.', point: 1.5 },
          { step: 'b1) Khai triển hiệu hai bình phương: $(2x - 1)(2x + 1) = 4x^2 - 1$.', point: 1.0 },
          { step: 'b2) Nhân đơn thức với đa thức: $-4x(x - 2) = -4x^2 + 8x$. Thu gọn: $B = 8x - 1$.', point: 1.0 },
        ],
        sol: 'Áp dụng các hằng đẳng thức đáng nhớ để rút gọn biểu thức đại số.',
      },
      {
        prompt: `BÀI TOÁN PHÂN THỨC ĐẠI SỐ (3.5 ĐIỂM):
Cho biểu thức $P = \\left(\\frac{1}{x - 2} - \\frac{1}{x + 2}\\right) \\cdot \\frac{x^2 - 4}{4}$ với $x \\ne \\pm 2$.
a) Rút gọn biểu thức $P$. (2.0 điểm)
b) Tính giá trị của $P$ khi $x = 2026$. (1.5 điểm)`,
        steps: [
          { step: 'a1) Quy đồng mẫu trong ngoặc: $\\frac{(x + 2) - (x - 2)}{(x - 2)(x + 2)} = \\frac{4}{x^2 - 4}$.', point: 1.0 },
          { step: 'a2) Nhân với phân thức thứ hai: $P = \\frac{4}{x^2 - 4} \\cdot \\frac{x^2 - 4}{4} = 1$.', point: 1.0 },
          { step: 'b) Vì $P = 1$ với mọi $x \\ne \\pm 2$ nên tại $x = 2026$, giá trị của $P$ bằng $1$.', point: 1.5 },
        ],
        sol: 'Thực hiện phép trừ và nhân phân thức đại số.',
      },
    ];
    const selE = g8AlgEssay[index % g8AlgEssay.length];
    return {
      subject,
      grade: '8',
      topicKeywords: [lesson, 'đại số', 'hằng đẳng thức', 'tự luận'],
      section: 'part4_essay',
      type: 'essay',
      cognitiveLevel: 'thongHieu',
      prompt: selE.prompt,
      essayGradingSteps: selE.steps,
      solutionExplanation: selE.sol,
      learningObjective: 'Vận dụng hằng đẳng thức và phân thức đại số để rút gọn và tính giá trị.',
    };
  }

  // Trả lời ngắn Khối 8
  const g8ShortGeom = [
    { prompt: 'Cho hình vuông có độ dài cạnh bằng $8\\text{ cm}$. Tính chu vi của hình vuông đó theo đơn vị $\\text{cm}$:', ans: '32', sol: '$C = 4 \\cdot 8 = 32\\text{ cm}$.' },
    { prompt: 'Một hình chóp tứ giác đều có cạnh đáy bằng $6\\text{ cm}$, chiều cao bằng $7\\text{ cm}$. Tính thể tích của hình chóp theo đơn vị $\\text{cm}^3$:', ans: '84', sol: '$V = \\frac{1}{3} \\cdot 6^2 \\cdot 7 = 84\\text{ cm}^3$.' },
    { prompt: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 9\\text{ cm}, AC = 12\\text{ cm}$. Tính độ dài cạnh huyền $BC$ theo đơn vị $\\text{cm}$:', ans: '15', sol: '$BC = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = 15\\text{ cm}$.' },
  ];
  const g8ShortAlg = [
    { prompt: 'Tính giá trị của biểu thức $x^2 - 4x + 4$ tại $x = 12$:', ans: '100', sol: '$x^2 - 4x + 4 = (x - 2)^2 = (12 - 2)^2 = 100$.' },
    { prompt: 'Tính giá trị của biểu thức $(x + 5)^2 - (x - 5)^2$ tại $x = 3$:', ans: '60', sol: '$(x+5)^2 - (x-5)^2 = 4 \\cdot x \\cdot 5 = 20x = 20 \\cdot 3 = 60$.' },
    { prompt: 'Tìm giá trị của $x$ để phân thức $\\frac{3x - 15}{x + 2} = 0$:', ans: '5', sol: '$3x - 15 = 0 \\Leftrightarrow x = 5$ (thỏa mãn mẫu khác 0).' },
  ];
  const listS = isGeom ? g8ShortGeom : g8ShortAlg;
  const selS = listS[index % listS.length];
  return {
    subject,
    grade: '8',
    topicKeywords: [lesson, 'trả lời ngắn'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: selS.prompt,
    shortAnswerText: selS.ans,
    solutionExplanation: selS.sol,
    learningObjective: 'Tính toán nhanh chuẩn xác Toán lớp 8.',
  };
}

// ============================================================================
// BỘ SINH DỮ LIỆU CỤ THỂ KHỐI 7
// ============================================================================

function generateGrade7Concrete(
  subject: string,
  chapter: string,
  lesson: string,
  section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay',
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  isGeom: boolean = false,
  usedPrompts: Set<string> = new Set()
): BankQuestionTemplate {
  if (section === 'part1_mcq') {
    if (isGeom) {
      const g7GeomMcq = [
        {
          prompt: 'Cho hai góc đối đỉnh $\\widehat{xOy}$ và $\\widehat{x\'Oy\'}$. Biết $\\widehat{xOy} = 65^\\circ$. Số đo góc $\\widehat{x\'Oy\'}$ là:',
          options: [{ key: 'A' as const, text: '$65^\\circ$' }, { key: 'B' as const, text: '$115^\\circ$' }, { key: 'C' as const, text: '$25^\\circ$' }, { key: 'D' as const, text: '$180^\\circ$' }],
          correct: 'A' as const,
          sol: 'Hai góc đối đỉnh thì bằng nhau, nên $\\widehat{x\'Oy\'} = 65^\\circ$.',
        },
        {
          prompt: 'Tổng ba góc trong một tam giác luôn bằng:',
          options: [{ key: 'A' as const, text: '$180^\\circ$' }, { key: 'B' as const, text: '$360^\\circ$' }, { key: 'C' as const, text: '$90^\\circ$' }, { key: 'D' as const, text: '$120^\\circ$' }],
          correct: 'A' as const,
          sol: 'Định lý tổng ba góc trong tam giác luôn bằng $180^\\circ$.',
        },
        {
          prompt: 'Cho tam giác $ABC$ cân tại $A$ có $\\widehat{A} = 50^\\circ$. Số đo góc $B$ là:',
          options: [{ key: 'A' as const, text: '$65^\\circ$' }, { key: 'B' as const, text: '$50^\\circ$' }, { key: 'C' as const, text: '$130^\\circ$' }, { key: 'D' as const, text: '$60^\\circ$' }],
          correct: 'A' as const,
          sol: 'Tam giác cân tại $A$: $\\widehat{B} = \\frac{180^\\circ - 50^\\circ}{2} = 65^\\circ$.',
        },
        {
          prompt: 'Cho đường thẳng $c$ cắt hai đường thẳng song song $a$ và $b$. Cặp góc so le trong có đặc điểm:',
          options: [{ key: 'A' as const, text: 'Bằng nhau' }, { key: 'B' as const, text: 'Bù nhau' }, { key: 'C' as const, text: 'Phụ nhau' }, { key: 'D' as const, text: 'Có tổng bằng $360^\\circ$' }],
          correct: 'A' as const,
          sol: 'Tính chất: nếu một đường thẳng cắt hai đường thẳng song song thì hai góc so le trong bằng nhau.',
        },
        {
          prompt: 'Giao điểm của ba đường trung trực trong tam giác là:',
          options: [{ key: 'A' as const, text: 'Tâm đường tròn ngoại tiếp tam giác' }, { key: 'B' as const, text: 'Trọng tâm tam giác' }, { key: 'C' as const, text: 'Trực tâm tam giác' }, { key: 'D' as const, text: 'Tâm đường tròn nội tiếp tam giác' }],
          correct: 'A' as const,
          sol: 'Giao điểm 3 đường trung trực cách đều 3 đỉnh, là tâm đường tròn ngoại tiếp tam giác.',
        },
      ];
      const sel = g7GeomMcq[index % g7GeomMcq.length];
      return {
        subject,
        grade: '7',
        topicKeywords: [lesson, 'hình học', 'góc'],
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: 'nhanBiet',
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correct,
        solutionExplanation: sel.sol,
        learningObjective: 'Nhận biết tính chất góc và tam giác Toán lớp 7.',
      };
    }

    const g7AlgMcq = [
      {
        prompt: 'Kết quả của phép tính $\\frac{-3}{4} + \\frac{1}{2}$ bằng:',
        options: [
          { key: 'A' as const, text: '$-\\frac{1}{4}$' },
          { key: 'B' as const, text: '$\\frac{1}{4}$' },
          { key: 'C' as const, text: '$-\\frac{2}{4}$' },
          { key: 'D' as const, text: '$1$' },
        ],
        correct: 'A' as const,
        sol: '$\\frac{-3}{4} + \\frac{1}{2} = \\frac{-3}{4} + \\frac{2}{4} = \\frac{-1}{4}$.',
      },
      {
        prompt: 'Từ tỉ lệ thức $\\frac{x}{6} = \\frac{5}{2}$, giá trị của $x$ là:',
        options: [
          { key: 'A' as const, text: '$15$' },
          { key: 'B' as const, text: '$12$' },
          { key: 'C' as const, text: '$10$' },
          { key: 'D' as const, text: '$30$' },
        ],
        correct: 'A' as const,
        sol: '$x = \\frac{6 \\cdot 5}{2} = 15$.',
      },
      {
        prompt: 'Căn bậc hai số học của $64$ là:',
        options: [
          { key: 'A' as const, text: '$8$' },
          { key: 'B' as const, text: '$-8$' },
          { key: 'C' as const, text: '$\\pm 8$' },
          { key: 'D' as const, text: '$4096$' },
        ],
        correct: 'A' as const,
        sol: 'Căn bậc hai số học của số không âm là số không âm bình phương bằng số đó: $\\sqrt{64} = 8$.',
      },
      {
        prompt: 'Giá trị tuyệt đối của $-3{,}5$ là:',
        options: [
          { key: 'A' as const, text: '$3{,}5$' },
          { key: 'B' as const, text: '$-3{,}5$' },
          { key: 'C' as const, text: '$\\pm 3{,}5$' },
          { key: 'D' as const, text: '$0$' },
        ],
        correct: 'A' as const,
        sol: '$|-3{,}5| = 3{,}5$.',
      },
      {
        prompt: 'Nghiệm của đa thức một biến $P(x) = 2x - 8$ là:',
        options: [
          { key: 'A' as const, text: '$x = 4$' },
          { key: 'B' as const, text: '$x = -4$' },
          { key: 'C' as const, text: '$x = 8$' },
          { key: 'D' as const, text: '$x = 2$' },
        ],
        correct: 'A' as const,
        sol: '$2x - 8 = 0 \\Leftrightarrow 2x = 8 \\Leftrightarrow x = 4$.',
      },
    ];
    const sel = pickUnused(g7AlgMcq, index, usedPrompts);
    return {
      subject,
      grade: '7',
      topicKeywords: [lesson, 'số hữu tỉ'],
      section: 'part1_mcq',
      type: 'multiple_choice',
      cognitiveLevel: 'nhanBiet',
      prompt: sel.prompt,
      options: sel.options,
      correctOption: sel.correct,
      solutionExplanation: sel.sol,
      learningObjective: 'Thông hiểu phép tính số hữu tỉ Toán lớp 7.',
    };
  }

  // Đúng sai Khối 7
  if (section === 'part2_true_false') {
    if (isGeom) {
      return {
        subject,
        grade: '7',
        topicKeywords: [lesson, 'hình học', 'tam giác', 'đúng sai'],
        section: 'part2_true_false',
        type: 'true_false',
        cognitiveLevel: 'thongHieu',
        prompt: 'Cho tam giác $ABC$ có $AB = AC$ và $M$ là trung điểm cạnh $BC$. Xét tính Đúng/Sai của các khẳng định sau:',
        tfStatements: [
          { subKey: 'a', text: 'Tam giác $ABC$ là tam giác cân tại $A$.', isCorrect: true, explanation: 'Đúng theo định nghĩa tam giác cân có hai cạnh bằng nhau.' },
          { subKey: 'b', text: 'Đoạn thẳng $AM$ vuông góc với cạnh $BC$.', isCorrect: true, explanation: 'Đúng vì trong tam giác cân, đường trung tuyến ứng với đáy đồng thời là đường cao.' },
          { subKey: 'c', text: 'Góc $\\widehat{B}$ và góc $\\widehat{C}$ có số đo khác nhau.', isCorrect: false, explanation: 'Sai vì trong tam giác cân tại $A$, hai góc ở đáy bằng nhau: $\\widehat{B} = \\widehat{C}$.' },
          { subKey: 'd', text: 'Tia $AM$ là tia phân giác của góc $\\widehat{BAC}$.', isCorrect: true, explanation: 'Đúng vì đường trung tuyến đồng thời là đường phân giác.' },
        ],
        solutionExplanation: 'Vận dụng các tính chất cơ bản của tam giác cân.',
        learningObjective: 'Thông hiểu tính chất đường trung tuyến, phân giác, đường cao trong tam giác cân.',
      };
    }

    return {
      subject,
      grade: '7',
      topicKeywords: [lesson, 'số thực', 'số hữu tỉ', 'đúng sai'],
      section: 'part2_true_false',
      type: 'true_false',
      cognitiveLevel: 'thongHieu',
      prompt: 'Xét tính Đúng/Sai của các khẳng định sau về tập hợp số hữu tỉ và số thực:',
      tfStatements: [
        { subKey: 'a', text: 'Mọi số nguyên đều là số hữu tỉ.', isCorrect: true, explanation: 'Đúng vì mọi số nguyên $a$ đều viết được dưới dạng $\\frac{a}{1}$.' },
        { subKey: 'b', text: 'Số $\\sqrt{2}$ là một số hữu tỉ.', isCorrect: false, explanation: 'Sai vì $\\sqrt{2}$ là số vô tỉ.' },
        { subKey: 'c', text: 'Nếu $\\frac{a}{b} = \\frac{c}{d}$ ($b, d \\ne 0$) thì $ad = bc$.', isCorrect: true, explanation: 'Đúng theo tính chất cơ bản của tỉ lệ thức.' },
        { subKey: 'd', text: 'Số $0$ là số hữu tỉ dương.', isCorrect: false, explanation: 'Sai vì số 0 không là số hữu tỉ dương cũng không là số hữu tỉ âm.' },
      ],
      solutionExplanation: 'Nắm vững định nghĩa và tính chất số hữu tỉ, số vô tỉ và tỉ lệ thức.',
      learningObjective: 'Phân biệt đúng sai về số hữu tỉ và số vô tỉ môn Toán lớp 7.',
    };
  }

  // Tự luận Khối 7
  if (section === 'part4_essay') {
    if (isGeom) {
      return {
        subject,
        grade: '7',
        topicKeywords: [lesson, 'hình học', 'tam giác', 'tự luận'],
        section: 'part4_essay',
        type: 'essay',
        cognitiveLevel: 'vanDung',
        prompt: `BÀI TOÁN HÌNH HỌC (3.0 ĐIỂM):
Cho tam giác $ABC$ cân tại $A$. Gọi $M$ là trung điểm của $BC$.
a) Chứng minh $\\triangle ABM = \\triangle ACM$. (1.5 điểm)
b) Chứng minh $AM \\perp BC$. (1.5 điểm)`,
        essayGradingSteps: [
          { step: 'a) Xét $\\triangle ABM$ và $\\triangle ACM$ có: $AB = AC$ (do $\\triangle ABC$ cân tại $A$); $MB = MC$ ($M$ là trung điểm); $AM$ chung. Vậy $\\triangle ABM = \\triangle ACM$ (c-c-c).', point: 1.5 },
          { step: 'b) Từ $\\triangle ABM = \\triangle ACM \\Rightarrow \\widehat{AMB} = \\widehat{AMC}$. Mà $\\widehat{AMB} + \\widehat{AMC} = 180^\\circ$ (kề bù) $\\Rightarrow \\widehat{AMB} = 90^\\circ \\Rightarrow AM \\perp BC$.', point: 1.5 },
        ],
        solutionExplanation: 'Chứng minh hai tam giác bằng nhau theo trường hợp cạnh - cạnh - cạnh và suy ra quan hệ vuông góc.',
        learningObjective: 'Vận dụng các trường hợp bằng nhau của tam giác để chứng minh quan hệ hình học.',
      };
    }

    return {
      subject,
      grade: '7',
      topicKeywords: [lesson, 'số hữu tỉ', 'tự luận'],
      section: 'part4_essay',
      type: 'essay',
      cognitiveLevel: 'thongHieu',
      prompt: `BÀI TOÁN ĐẠI SỐ (3.5 ĐIỂM):
a) Thực hiện phép tính: $A = \\frac{2}{5} \\cdot \\frac{7}{9} + \\frac{2}{5} \\cdot \\frac{2}{9}$ (1.5 điểm)
b) Tìm số hữu tỉ $x$, biết: $x - \\frac{1}{3} = \\frac{5}{6}$ (2.0 điểm)`,
      essayGradingSteps: [
        { step: 'a) $A = \\frac{2}{5} \\left(\\frac{7}{9} + \\frac{2}{9}\\right) = \\frac{2}{5} \\cdot 1 = \\frac{2}{5}$.', point: 1.5 },
        { step: 'b) $x = \\frac{5}{6} + \\frac{1}{3} = \\frac{5}{6} + \\frac{2}{6} = \\frac{7}{6}$.', point: 2.0 },
      ],
      solutionExplanation: 'Dùng tính chất phân phối của phép nhân và quy tắc chuyển vế.',
      learningObjective: 'Vận dụng phép tính số hữu tỉ và tìm x.',
    };
  }

  // Khối 7 trả lời ngắn
  const g7ShortGeom = [
    { prompt: 'Cho tam giác $ABC$ có $\\widehat{A} = 70^\\circ, \\widehat{B} = 50^\\circ$. Tính số đo góc $\\widehat{C}$ (độ):', ans: '60', sol: '$\\widehat{C} = 180^\\circ - (70^\\circ + 50^\\circ) = 60^\\circ$.' },
    { prompt: 'Cho tam giác $MNP$ cân tại $M$ có $\\widehat{N} = 65^\\circ$. Tính số đo góc $\\widehat{M}$ (độ):', ans: '50', sol: '$\\widehat{M} = 180^\\circ - 2 \\cdot 65^\\circ = 50^\\circ$.' },
  ];
  const g7ShortAlg = [
    { prompt: 'Tìm $x$ trong tỉ lệ thức: $\\frac{x}{15} = \\frac{4}{3}$:', ans: '20', sol: '$x = \\frac{15 \\cdot 4}{3} = 20$.' },
    { prompt: 'Tính giá trị của biểu thức: $M = \\left(-\\frac{1}{2}\\right)^3 + \\frac{9}{8}$:', ans: '1', sol: '$M = -\\frac{1}{8} + \\frac{9}{8} = \\frac{8}{8} = 1$.' },
  ];
  const list7 = isGeom ? g7ShortGeom : g7ShortAlg;
  const sel7 = list7[index % list7.length];
  return {
    subject,
    grade: '7',
    topicKeywords: [lesson, 'trả lời ngắn'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: sel7.prompt,
    shortAnswerText: sel7.ans,
    solutionExplanation: sel7.sol,
    learningObjective: 'Tính toán chuẩn xác góc hoặc tỉ lệ thức môn Toán lớp 7.',
  };
}

// ============================================================================
// BỘ SINH DỮ LIỆU CỤ THỂ KHỐI 6
// ============================================================================

function generateGrade6Concrete(
  subject: string,
  chapter: string,
  lesson: string,
  section: 'part1_mcq' | 'part2_true_false' | 'part3_short_answer' | 'part4_essay',
  cognitiveLevel: 'nhanBiet' | 'thongHieu' | 'vanDung' | 'vanDungCao',
  index: number,
  isGeom: boolean = false,
  usedPrompts: Set<string> = new Set()
): BankQuestionTemplate {
  if (section === 'part1_mcq') {
    if (isGeom) {
      const g6GeomMcq = [
        {
          prompt: 'Một hình vuông có độ dài cạnh bằng $7\\text{ cm}$. Chu vi của hình vuông đó bằng:',
          options: [{ key: 'A' as const, text: '$28\\text{ cm}$' }, { key: 'B' as const, text: '$49\\text{ cm}$' }, { key: 'C' as const, text: '$14\\text{ cm}$' }, { key: 'D' as const, text: '$21\\text{ cm}$' }],
          correct: 'A' as const,
          sol: 'Chu vi hình vuông bằng cạnh nhân 4: $7 \\times 4 = 28\\text{ cm}$.',
        },
        {
          prompt: 'Hình tam giác đều có đặc điểm nào sau đây?',
          options: [{ key: 'A' as const, text: 'Có 3 cạnh bằng nhau và 3 góc bằng nhau' }, { key: 'B' as const, text: 'Có 2 cạnh bằng nhau' }, { key: 'C' as const, text: 'Có 1 góc vuông' }, { key: 'D' as const, text: 'Có 4 góc bằng nhau' }],
          correct: 'A' as const,
          sol: 'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau (cùng bằng $60^\\circ$).',
        },
        {
          prompt: 'Một mảnh vườn hình chữ nhật có chiều dài $12\\text{ m}$ và chiều rộng $5\\text{ m}$. Diện tích mảnh vườn đó là:',
          options: [{ key: 'A' as const, text: '$60\\text{ m}^2$' }, { key: 'B' as const, text: '$34\\text{ m}^2$' }, { key: 'C' as const, text: '$17\\text{ m}^2$' }, { key: 'D' as const, text: '$30\\text{ m}^2$' }],
          correct: 'A' as const,
          sol: 'Diện tích hình chữ nhật là $12 \\times 5 = 60\\text{ m}^2$.',
        },
        {
          prompt: 'Hình thoi có độ dài hai đường chéo là $8\\text{ cm}$ và $6\\text{ cm}$. Diện tích của hình thoi đó là:',
          options: [{ key: 'A' as const, text: '$24\\text{ cm}^2$' }, { key: 'B' as const, text: '$48\\text{ cm}^2$' }, { key: 'C' as const, text: '$14\\text{ cm}^2$' }, { key: 'D' as const, text: '$28\\text{ cm}^2$' }],
          correct: 'A' as const,
          sol: 'Diện tích hình thoi bằng $\\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\cdot 8 \\cdot 6 = 24\\text{ cm}^2$.',
        },
      ];
      const sel = g6GeomMcq[index % g6GeomMcq.length];
      return {
        subject,
        grade: '6',
        topicKeywords: [lesson, 'hình học trực quan'],
        section: 'part1_mcq',
        type: 'multiple_choice',
        cognitiveLevel: 'nhanBiet',
        prompt: sel.prompt,
        options: sel.options,
        correctOption: sel.correct,
        solutionExplanation: sel.sol,
        learningObjective: 'Nhận biết hình học trực quan Toán lớp 6.',
      };
    }

    const g6AlgMcq = [
      {
        prompt: 'Giá trị của lũy thừa $2^4$ bằng:',
        options: [
          { key: 'A' as const, text: '$16$' },
          { key: 'B' as const, text: '$8$' },
          { key: 'C' as const, text: '$12$' },
          { key: 'D' as const, text: '$64$' },
        ],
        correct: 'A' as const,
        sol: '$2^4 = 2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$.',
      },
      {
        prompt: 'Trong các số sau, số nào chia hết cho cả $2$ và $5$?',
        options: [
          { key: 'A' as const, text: '$150$' },
          { key: 'B' as const, text: '$125$' },
          { key: 'C' as const, text: '$142$' },
          { key: 'D' as const, text: '$133$' },
        ],
        correct: 'A' as const,
        sol: 'Số có chữ số tận cùng là $0$ thì chia hết cho cả 2 và 5.',
      },
      {
        prompt: 'Kết quả của phép tính $(-12) + 25$ bằng:',
        options: [
          { key: 'A' as const, text: '$13$' },
          { key: 'B' as const, text: '$-13$' },
          { key: 'C' as const, text: '$37$' },
          { key: 'D' as const, text: '$-37$' },
        ],
        correct: 'A' as const,
        sol: '$(-12) + 25 = 25 - 12 = 13$.',
      },
      {
        prompt: 'Số đối của số nguyên $-20$ là:',
        options: [
          { key: 'A' as const, text: '$20$' },
          { key: 'B' as const, text: '$-20$' },
          { key: 'C' as const, text: '$\\frac{1}{20}$' },
          { key: 'D' as const, text: '$0$' },
        ],
        correct: 'A' as const,
        sol: 'Số đối của $-20$ là $20$.',
      },
    ];
    const sel = pickUnused(g6AlgMcq, index, usedPrompts);
    return {
      subject,
      grade: '6',
      topicKeywords: [lesson, 'số tự nhiên'],
      section: 'part1_mcq',
      type: 'multiple_choice',
      cognitiveLevel: 'nhanBiet',
      prompt: sel.prompt,
      options: sel.options,
      correctOption: sel.correct,
      solutionExplanation: sel.sol,
      learningObjective: 'Nhận biết số tự nhiên và chia hết Toán lớp 6.',
    };
  }

  // Đúng sai Khối 6
  if (section === 'part2_true_false') {
    if (isGeom) {
      return {
        subject,
        grade: '6',
        topicKeywords: [lesson, 'hình học trực quan', 'đúng sai'],
        section: 'part2_true_false',
        type: 'true_false',
        cognitiveLevel: 'thongHieu',
        prompt: 'Xét tính Đúng/Sai của các khẳng định sau về hình học trực quan:',
        tfStatements: [
          { subKey: 'a', text: 'Hình vuông có bốn cạnh bằng nhau và bốn góc vuông.', isCorrect: true, explanation: 'Đúng theo định nghĩa hình vuông.' },
          { subKey: 'b', text: 'Tam giác đều có một góc tù.', isCorrect: false, explanation: 'Sai vì ba góc của tam giác đều bằng nhau và bằng 60 độ (góc nhọn).' },
          { subKey: 'c', text: 'Hình thoi có hai đường chéo vuông góc với nhau.', isCorrect: true, explanation: 'Đúng theo tính chất hình thoi.' },
          { subKey: 'd', text: 'Hình chữ nhật có độ dài hai đường chéo bằng nhau.', isCorrect: true, explanation: 'Đúng theo tính chất hình chữ nhật.' },
        ],
        solutionExplanation: 'Dựa vào tính chất các hình phẳng trực quan đã học ở lớp 6.',
        learningObjective: 'Nhận biết và thông hiểu đặc điểm hình vuông, hình thoi, hình chữ nhật.',
      };
    }

    return {
      subject,
      grade: '6',
      topicKeywords: [lesson, 'số học', 'đúng sai'],
      section: 'part2_true_false',
      type: 'true_false',
      cognitiveLevel: 'thongHieu',
      prompt: 'Xét tính Đúng/Sai của các mệnh đề sau về tập hợp số tự nhiên và số nguyên:',
      tfStatements: [
        { subKey: 'a', text: 'Số nguyên âm luôn nhỏ hơn 0.', isCorrect: true, explanation: 'Đúng theo thứ tự trong tập hợp số nguyên.' },
        { subKey: 'b', text: 'Tích của hai số nguyên âm là một số nguyên âm.', isCorrect: false, explanation: 'Sai vì âm nhân âm ra dương.' },
        { subKey: 'c', text: 'Số 1 là số nguyên tố nhỏ nhất.', isCorrect: false, explanation: 'Sai vì 2 là số nguyên tố nhỏ nhất.' },
        { subKey: 'd', text: 'Một số chia hết cho 9 thì chắc chắn chia hết cho 3.', isCorrect: true, explanation: 'Đúng vì 9 là bội của 3.' },
      ],
      solutionExplanation: 'Dựa vào quy tắc dấu của phép tính số nguyên và dấu hiệu chia hết.',
      learningObjective: 'Thông hiểu quy tắc phép tính số nguyên và dấu hiệu chia hết.',
    };
  }

  // Tự luận Khối 6
  if (section === 'part4_essay') {
    if (isGeom) {
      return {
        subject,
        grade: '6',
        topicKeywords: [lesson, 'hình học trực quan', 'diện tích', 'tự luận'],
        section: 'part4_essay',
        type: 'essay',
        cognitiveLevel: 'vanDung',
        prompt: `BÀI TOÁN HÌNH HỌC THỰC TẾ (3.0 ĐIỂM):
Bác Nam có một mảnh sân hình chữ nhật có chiều dài $15\\text{ m}$ và chiều rộng $8\\text{ m}$.
a) Tính chu vi và diện tích mảnh sân của bác Nam. (1.5 điểm)
b) Bác Nam dự định lát toàn bộ mảnh sân bằng các viên gạch hình vuông có cạnh $50\\text{ cm}$. Hỏi bác Nam cần mua bao nhiêu viên gạch (bỏ qua mép vữa nối)? (1.5 điểm)`,
        essayGradingSteps: [
          { step: 'a) Chu vi: $(15 + 8) \\times 2 = 46\\text{ m}$. Diện tích sân: $15 \\times 8 = 120\\text{ m}^2$.', point: 1.5 },
          { step: 'b) Đổi $50\\text{ cm} = 0{,}5\\text{ m}$. Diện tích một viên gạch: $0{,}5 \\times 0{,}5 = 0{,}25\\text{ m}^2$. Số viên gạch cần dùng: $120 : 0{,}25 = 480$ (viên).', point: 1.5 },
        ],
        solutionExplanation: 'Tính chu vi, diện tích hình chữ nhật và ứng dụng vào bài toán thực tế lát nền sân.',
        learningObjective: 'Vận dụng tính diện tích hình chữ nhật vào giải quyết bài toán thực tiễn.',
      };
    }

    return {
      subject,
      grade: '6',
      topicKeywords: [lesson, 'số tự nhiên', 'tự luận'],
      section: 'part4_essay',
      type: 'essay',
      cognitiveLevel: 'thongHieu',
      prompt: `BÀI TOÁN SỐ HỌC (3.5 ĐIỂM):
a) Tính nhanh: $25 \\cdot 64 + 25 \\cdot 36$ (1.5 điểm)
b) Tìm số tự nhiên $x$, biết: $2x + 12 = 30$ (2.0 điểm)`,
      essayGradingSteps: [
        { step: 'a) $25 \\cdot (64 + 36) = 25 \\cdot 100 = 2500$.', point: 1.5 },
        { step: 'b) $2x = 30 - 12 = 18 \\Rightarrow x = 18 : 2 = 9$.', point: 2.0 },
      ],
      solutionExplanation: 'Dùng tính chất phân phối để tính nhanh và quy tắc tìm x trong phép tính số tự nhiên.',
      learningObjective: 'Thông hiểu thứ tự thực hiện phép tính và tìm thành phần chưa biết.',
    };
  }

  // Khối 6 trả lời ngắn
  const g6ShortGeom = [
    { prompt: 'Một hình vuông có diện tích bằng $64\\text{ cm}^2$. Tính độ dài cạnh của hình vuông đó theo đơn vị $\\text{cm}$:', ans: '8', sol: '$8 \\times 8 = 64$ nên cạnh hình vuông là $8\\text{ cm}$.' },
    { prompt: 'Tính chu vi của hình chữ nhật có chiều dài $14\\text{ cm}$ và chiều rộng $6\\text{ cm}$ (đơn vị $\\text{cm}$):', ans: '40', sol: 'Chu vi: $(14 + 6) \\times 2 = 40\\text{ cm}$.' },
  ];
  const g6ShortAlg = [
    { prompt: 'Tìm số tự nhiên $x$ thỏa mãn $3^x = 81$. Điền đáp số:', ans: '4', sol: '$81 = 3^4$ nên $x = 4$.' },
    { prompt: 'Thực hiện phép tính: $(-25) + 40 - 15$:', ans: '0', sol: '$(-25) + 40 = 15; 15 - 15 = 0$.' },
  ];
  const list6 = isGeom ? g6ShortGeom : g6ShortAlg;
  const sel6 = list6[index % list6.length];
  return {
    subject,
    grade: '6',
    topicKeywords: [lesson, 'trả lời ngắn'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: sel6.prompt,
    shortAnswerText: sel6.ans,
    solutionExplanation: sel6.sol,
    learningObjective: 'Tính toán nhanh số học hoặc hình học trực quan lớp 6.',
  };
}

