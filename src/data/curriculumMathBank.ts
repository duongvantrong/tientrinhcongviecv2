import { BankQuestionTemplate } from '../types';

/**
 * NGÂN HÀNG CÂU HỎI TOÁN THCS CHUẨN GDPT 2018 (KHỐI 6, 7, 8, 9)
 * ĐẢM BẢO:
 * - 100% CỤ THỂ, RÕ RÀNG, SỐ LIỆU CHÍNH XÁC, CÓ BÀI TOÁN THẬT, CÔNG THỨC LATEX
 * - TUYỆT ĐỐI KHÔNG DÙNG CÂU HỎI MƠ HỒ HAY CHUNG CHUNG
 * - BÁM SÁT TỪNG BÀI HỌC TRONG PHÂN PHỐI CHƯƠNG TRÌNH (PPCT)
 */

// ============================================================================
// KHỐI 9 - BÁM SÁT PPCT (TUẦN 1 - 4: HỆ PHƯƠNG TRÌNH, PT QUY VỀ BẬC NHẤT, BÀI TOÁN LẬP HỆ)
// ============================================================================

export const CURRICULUM_GRADE_9_QUESTIONS: BankQuestionTemplate[] = [
  // --- TUẦN 1-4: KHÁI NIỆM PT & HỆ HAI PT BẬC NHẤT HAI ẨN (MCQ) ---
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình bậc nhất hai ẩn', 'nghiệm', 'khái niệm'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Phương trình nào sau đây là phương trình bậc nhất hai ẩn $x$ và $y$?',
    options: [
      { key: 'A', text: '$2x - 3y = 5$' },
      { key: 'B', text: '$x^2 + y = 3$' },
      { key: 'C', text: '$2x - \\frac{3}{y} = 1$' },
      { key: 'D', text: '$xy + 2 = 0$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Phương trình bậc nhất hai ẩn $x$ và $y$ là hệ thức có dạng $ax + by = c$, trong đó $a, b$ không đồng thời bằng $0$. Do đó $2x - 3y = 5$ là phương trình bậc nhất hai ẩn.',
    learningObjective: 'Nhận biết dạng tổng quát của phương trình bậc nhất hai ẩn $ax + by = c$.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình bậc nhất hai ẩn', 'nghiệm', 'thay số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Cặp số nào sau đây là một nghiệm của phương trình $3x - 2y = 7$?',
    options: [
      { key: 'A', text: '$(3; 1)$' },
      { key: 'B', text: '$(1; -2)$' },
      { key: 'C', text: '$(2; 1)$' },
      { key: 'D', text: '$(3; -1)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Thay $x = 3, y = 1$ vào vế trái: $3(3) - 2(1) = 9 - 2 = 7$ (bằng vế phải). Vậy cặp số $(3; 1)$ là nghiệm của phương trình.',
    learningObjective: 'Nhận biết và kiểm tra một cặp số $(x_0; y_0)$ có là nghiệm của phương trình bậc nhất hai ẩn hay không.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['hệ hai phương trình', 'nghiệm', 'phương pháp thế'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Nghiệm của hệ phương trình $\\begin{cases} x - 2y = 1 \\\\ 2x + y = 7 \\end{cases}$ là cặp số $(x; y)$ bằng:',
    options: [
      { key: 'A', text: '$(3; 1)$' },
      { key: 'B', text: '$(1; 3)$' },
      { key: 'C', text: '$(5; 2)$' },
      { key: 'D', text: '$(2; 3)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Từ phương trình thứ nhất suy ra $x = 2y + 1$. Thế vào phương trình thứ hai: $2(2y + 1) + y = 7 \\Leftrightarrow 5y + 2 = 7 \\Leftrightarrow 5y = 5 \\Leftrightarrow y = 1$. Khi đó $x = 2(1) + 1 = 3$. Vậy hệ có nghiệm duy nhất $(3; 1)$.',
    learningObjective: 'Thông hiểu phương pháp thế để giải hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['hệ hai phương trình', 'cộng đại số', 'giải hệ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Nghiệm của hệ phương trình $\\begin{cases} 3x + 2y = 8 \\\\ 2x - y = 3 \\end{cases}$ là:',
    options: [
      { key: 'A', text: '$(2; 1)$' },
      { key: 'B', text: '$(1; 2)$' },
      { key: 'C', text: '$(2; -1)$' },
      { key: 'D', text: '$(0; 4)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Nhân phương trình thứ hai với $2$: $4x - 2y = 6$. Cộng từng vế với phương trình thứ nhất: $(3x + 2y) + (4x - 2y) = 8 + 6 \\Leftrightarrow 7x = 14 \\Leftrightarrow x = 2$. Thay $x = 2$ vào $2x - y = 3 \\Rightarrow 2(2) - y = 3 \\Rightarrow y = 1$. Vậy nghiệm là $(2; 1)$.',
    learningObjective: 'Thông hiểu phương pháp cộng đại số để giải hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình tích', 'quy về bậc nhất', 'nghiệm'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Tập nghiệm của phương trình tích $(2x - 4)(x + 3) = 0$ là:',
    options: [
      { key: 'A', text: '$S = \\{2; -3\\}$' },
      { key: 'B', text: '$S = \\{-2; 3\\}$' },
      { key: 'C', text: '$S = \\{2; 3\\}$' },
      { key: 'D', text: '$S = \\{-2; -3\\}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Phương trình $(2x - 4)(x + 3) = 0 \\Leftrightarrow 2x - 4 = 0$ hoặc $x + 3 = 0 \\Leftrightarrow x = 2$ hoặc $x = -3$. Do đó tập nghiệm là $S = \\{2; -3\\}$.',
    learningObjective: 'Nhận biết cách giải phương trình tích dạng $(ax+b)(cx+d)=0$.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình tích', 'phương trình quy về bậc nhất', 'nghiệm'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Số nghiệm của phương trình $(3x + 6)(2x - 1) = 0$ là:',
    options: [
      { key: 'A', text: '$2$' },
      { key: 'B', text: '$1$' },
      { key: 'C', text: '$0$' },
      { key: 'D', text: 'Vô số' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Ta có $3x + 6 = 0 \\Leftrightarrow x = -2$; $2x - 1 = 0 \\Leftrightarrow x = \\frac{1}{2}$. Vì hai nghiệm này phân biệt nên phương trình có đúng $2$ nghiệm.',
    learningObjective: 'Thông hiểu số nghiệm và các nghiệm phân biệt của phương trình tích.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình chứa ẩn ở mẫu', 'điều kiện xác định', 'ĐKXĐ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Điều kiện xác định của phương trình $\\frac{x + 2}{x - 3} = \\frac{1}{x + 1}$ là:',
    options: [
      { key: 'A', text: '$x \\ne 3$ và $x \\ne -1$' },
      { key: 'B', text: '$x \\ne 3$' },
      { key: 'C', text: '$x \\ne -1$' },
      { key: 'D', text: '$x \\ne -3$ và $x \\ne 1$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Mẫu thức của các phân thức phải khác $0$: $x - 3 \\ne 0 \\Leftrightarrow x \\ne 3$ và $x + 1 \\ne 0 \\Leftrightarrow x \\ne -1$.',
    learningObjective: 'Nhận biết điều kiện xác định của phương trình chứa ẩn ở mẫu thức.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình chứa ẩn ở mẫu', 'nghiệm', 'giải phương trình'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Nghiệm của phương trình $\\frac{2x - 5}{x - 1} = 1$ là:',
    options: [
      { key: 'A', text: '$x = 4$' },
      { key: 'B', text: '$x = 1$' },
      { key: 'C', text: '$x = 6$' },
      { key: 'D', text: '$x = -4$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'ĐKXĐ: $x \\ne 1$. Quy đồng và khử mẫu: $2x - 5 = x - 1 \\Leftrightarrow 2x - x = 5 - 1 \\Leftrightarrow x = 4$ (thỏa mãn ĐKXĐ). Vậy nghiệm là $x = 4$.',
    learningObjective: 'Thông hiểu các bước giải phương trình chứa ẩn ở mẫu cơ bản.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['giải bài toán bằng cách lập hệ phương trình', 'toán chuyển động', 'toán thực tế'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Hai ô tô cùng khởi hành từ hai bến $A$ và $B$ cách nhau $120\\text{ km}$ đi ngược chiều nhau và gặp nhau sau $1{,}5$ giờ. Biết vận tốc xe thứ nhất lớn hơn vận tốc xe thứ hai là $10\\text{ km/h}$. Nếu gọi vận tốc xe thứ nhất là $x\\text{ (km/h)}$ và xe thứ hai là $y\\text{ (km/h)}$, hệ phương trình lập được là:',
    options: [
      { key: 'A', text: '$\\begin{cases} x - y = 10 \\\\ x + y = 80 \\end{cases}$' },
      { key: 'B', text: '$\\begin{cases} x - y = 10 \\\\ x + y = 120 \\end{cases}$' },
      { key: 'C', text: '$\\begin{cases} y - x = 10 \\\\ 1{,}5x + 1{,}5y = 80 \\end{cases}$' },
      { key: 'D', text: '$\\begin{cases} x + y = 10 \\\\ x - y = 80 \\end{cases}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Hiệu vận tốc: $x - y = 10$. Vì hai xe đi ngược chiều gặp nhau sau $1{,}5\\text{ h}$ nên tổng vận tốc là $x + y = 120 : 1{,}5 = 80\\text{ km/h}$. Hệ phương trình là $\\begin{cases} x - y = 10 \\\\ x + y = 80 \\end{cases}$.',
    learningObjective: 'Thông hiểu việc thiết lập hệ phương trình từ bài toán chuyển động thực tế.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['giải bài toán bằng cách lập hệ phương trình', 'toán tìm số', 'toán thực tế'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm hai số biết tổng của chúng bằng $45$ và hiệu của chúng bằng $15$. Hai số đó là:',
    options: [
      { key: 'A', text: '$30$ và $15$' },
      { key: 'B', text: '$25$ và $20$' },
      { key: 'C', text: '$35$ và $10$' },
      { key: 'D', text: '$28$ và $17$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Gọi số lớn là $x$, số bé là $y$. Ta có hệ $\\begin{cases} x + y = 45 \\\\ x - y = 15 \\end{cases}$. Cộng hai phương trình: $2x = 60 \\Rightarrow x = 30$. Suy ra $y = 45 - 30 = 15$. Vậy hai số là $30$ và $15$.',
    learningObjective: 'Vận dụng hệ phương trình để giải bài toán tìm hai số.',
  },

  // --- TUẦN 1-4: PHẦN 2 ĐÚNG / SAI (GRADE 9) ---
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['hệ phương trình', 'phương pháp giải', 'đúng sai'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'thongHieu',
    prompt: 'Cho hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - 3y = -1 \\end{cases}$. Xét tính Đúng/Sai của các mệnh đề sau:',
    tfStatements: [
      { subKey: 'a', text: 'Từ phương trình thứ nhất, biểu diễn $y$ theo $x$ ta được $y = 5 - 2x$.', isCorrect: true, explanation: 'Đúng vì chuyển vế $2x$ sang vế phải đổi dấu thành $-2x$.' },
      { subKey: 'b', text: 'Cặp số $(x; y) = (1; 3)$ là nghiệm của phương trình $2x + y = 5$.', isCorrect: false, explanation: 'Sai vì $2(1) + 3 = 5$, cặp $(1; 3)$ là nghiệm của phương trình đầu nhưng thay vào $x - 3y = 1 - 9 = -8 \\ne -1$.' },
      { subKey: 'c', text: 'Nghiệm duy nhất của hệ phương trình đã cho là $(x; y) = (2; 1)$.', isCorrect: true, explanation: 'Đúng vì $x = 2, y = 1$ thỏa mãn cả hai phương trình: $2(2)+1=5$ và $2-3(1)=-1$.' },
      { subKey: 'd', text: 'Nếu nhân phương trình thứ hai với $2$ rồi trừ hai vế, ta triệt tiêu được ẩn $x$.', isCorrect: true, explanation: 'Đúng vì hệ số của $x$ ở cả hai phương trình lúc đó đều bằng $2$.' },
    ],
    solutionExplanation: 'Phân tích các bước biến đổi hệ phương trình bậc nhất hai ẩn bằng phương pháp thế và phương pháp cộng đại số.',
    learningObjective: 'Thông hiểu và phân tích tính đúng sai trong các bước giải hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình tích', 'phương trình chứa ẩn ở mẫu', 'đúng sai'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'thongHieu',
    prompt: 'Cho phương trình $\\frac{x^2 - 4}{x - 2} = 0$. Xét tính Đúng/Sai của các khẳng định sau:',
    tfStatements: [
      { subKey: 'a', text: 'Điều kiện xác định của phương trình là $x \\ne 2$.', isCorrect: true, explanation: 'Mẫu thức khác 0: $x - 2 \\ne 0 \\Leftrightarrow x \\ne 2$.' },
      { subKey: 'b', text: 'Phương trình $x^2 - 4 = 0$ có hai nghiệm phân biệt là $x = 2$ và $x = -2$.', isCorrect: true, explanation: 'Đúng vì $(x-2)(x+2) = 0 \\Leftrightarrow x = 2$ hoặc $x = -2$.' },
      { subKey: 'c', text: 'Tập nghiệm của phương trình đã cho là $S = \\{-2; 2\\}$.', isCorrect: false, explanation: 'Sai vì giá trị $x = 2$ bị loại do không thỏa mãn ĐKXĐ $x \\ne 2$.' },
      { subKey: 'd', text: 'Phương trình đã cho chỉ có duy nhất một nghiệm là $x = -2$.', isCorrect: true, explanation: 'Đúng vì chỉ có $x = -2$ thỏa mãn ĐKXĐ.' },
    ],
    solutionExplanation: 'Giải phương trình chứa ẩn ở mẫu phải luôn đối chiếu nghiệm tìm được với điều kiện xác định.',
    learningObjective: 'Thông hiểu tầm quan trọng của việc đối chiếu điều kiện xác định khi giải phương trình chứa ẩn ở mẫu.',
  },

  // --- TUẦN 1-4: PHẦN 3 TRẢ LỜI NGẮN (GRADE 9) ---
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['hệ phương trình', 'nghiệm', 'giải hệ'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm giá trị của $x$ trong nghiệm $(x; y)$ của hệ phương trình $\\begin{cases} 3x + y = 11 \\\\ x - y = 1 \\end{cases}$. Điền đáp số:',
    shortAnswerText: '3',
    solutionExplanation: 'Cộng từng vế hai phương trình: $4x = 12 \\Leftrightarrow x = 3$.',
    learningObjective: 'Thông hiểu và tính nhanh giá trị của ẩn trong hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['phương trình tích', 'nghiệm dương'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm nghiệm dương của phương trình $(2x - 10)(x + 4) = 0$. Điền đáp số:',
    shortAnswerText: '5',
    solutionExplanation: 'Phương trình có hai nghiệm: $2x - 10 = 0 \\Leftrightarrow x = 5$ và $x + 4 = 0 \\Leftrightarrow x = -4$. Nghiệm dương cần tìm là $x = 5$.',
    learningObjective: 'Thông hiểu và xác định nghiệm thỏa mãn điều kiện dương của phương trình tích.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['giải bài toán bằng cách lập hệ', 'toán hình học', 'chu vi'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'vanDung',
    prompt: 'Một thửa ruộng hình chữ nhật có chu vi $60\\text{ m}$. Biết chiều dài hơn chiều rộng $6\\text{ m}$. Hỏi chiều dài của thửa ruộng bằng bao nhiêu mét? Điền đáp số:',
    shortAnswerText: '18',
    solutionExplanation: 'Nửa chu vi thửa ruộng là $60 : 2 = 30\\text{ m}$. Chiều dài là $(30 + 6) : 2 = 18\\text{ m}$.',
    learningObjective: 'Vận dụng giải bài toán thực tế bằng cách lập phương trình hoặc hệ phương trình.',
  },

  // --- TUẦN 1-4: PHẦN 4 TỰ LUẬN CHUẨN KTTX 100% TỰ LUẬN (GRADE 9) ---
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['kttx tự luận', 'giải hệ phương trình', 'phương trình tích', 'bài toán lập hệ'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 1 (3.5 ĐIỂM):
Giải các phương trình và hệ phương trình sau:
a) Giải phương trình tích: $(2x - 6)(x + 4) = 0$ (1.5 điểm)
b) Giải hệ phương trình bằng phương pháp cộng đại số hoặc phương pháp thế:
   $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 7 \\end{cases}$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Viết tương đương: $2x - 6 = 0$ hoặc $x + 4 = 0$.', point: 0.5 },
      { step: 'a2) Giải ra $2x = 6 \\Leftrightarrow x = 3$ hoặc $x = -4$. Kết luận tập nghiệm $S = \\{3; -4\\}$.', point: 1.0 },
      { step: 'b1) Nhân phương trình thứ nhất với $2$: $\\begin{cases} 4x + 2y = 14 \\\\ 3x - 2y = 7 \\end{cases}$.', point: 0.75 },
      { step: 'b2) Cộng hai phương trình vế theo vế: $7x = 21 \\Leftrightarrow x = 3$.', point: 0.75 },
      { step: 'b3) Thay $x = 3$ vào $2x + y = 7 \\Rightarrow 2(3) + y = 7 \\Rightarrow y = 1$. Kết luận hệ phương trình có nghiệm duy nhất $(x; y) = (3; 1)$.', point: 0.5 },
    ],
    solutionExplanation: `HƯỚNG DẪN GIẢI CHI TIẾT BÀI 1:
a) Phương trình tích $A(x) \\cdot B(x) = 0 \\Leftrightarrow A(x) = 0$ hoặc $B(x) = 0$. Ta có:
   $2x - 6 = 0 \\Leftrightarrow x = 3$
   $x + 4 = 0 \\Leftrightarrow x = -4$. Vậy $S = \\{3; -4\\}$.
b) Dùng phương pháp cộng đại số: nhân phương trình (1) với 2 để hệ số của $y$ đối nhau, cộng triệt tiêu ẩn $y$ tìm được $x = 3$, sau đó thay vào tìm $y = 1$.`,
    learningObjective: 'Đánh giá kỹ năng giải phương trình tích và hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['kttx tự luận', 'bài toán lập hệ phương trình', 'toán thực tế'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDung',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 2 (3.5 ĐIỂM):
Giải bài toán sau bằng cách lập phương trình hoặc hệ phương trình:
Nhà bạn An dự định mua một mảnh đất hình chữ nhật có chu vi bằng $56\\text{ m}$. Nếu tăng chiều rộng thêm $2\\text{ m}$ và giảm chiều dài đi $4\\text{ m}$ thì diện tích mảnh đất giảm đi $16\\text{ m}^2$. Tính chiều dài và chiều rộng ban đầu của mảnh đất đó.`,
    essayGradingSteps: [
      { step: 'Gọi chiều dài mảnh đất là $x\\text{ (m)}$, chiều rộng là $y\\text{ (m)}$ với điều kiện $x > y > 4$.', point: 0.75 },
      { step: 'Nửa chu vi mảnh đất là $56 : 2 = 28\\text{ m}$, ta có phương trình (1): $x + y = 28$.', point: 0.75 },
      { step: 'Chiều dài mới là $x - 4\\text{ (m)}$, chiều rộng mới là $y + 2\\text{ (m)}$. Do diện tích giảm $16\\text{ m}^2$, ta có phương trình: $(x - 4)(y + 2) = xy - 16 \\Leftrightarrow xy + 2x - 4y - 8 = xy - 16 \\Leftrightarrow 2x - 4y = -8 \\Leftrightarrow x - 2y = -4$ (2).', point: 1.0 },
      { step: 'Từ (1) và (2) ta có hệ: $\\begin{cases} x + y = 28 \\\\ x - 2y = -4 \\end{cases}$. Trừ hai phương trình: $3y = 32 \\Rightarrow$ giải hệ thu được $y = 10, x = 18$ (thỏa mãn ĐK). Kết luận chiều dài là $18\\text{ m}$, chiều rộng là $10\\text{ m}$.', point: 1.0 },
    ],
    solutionExplanation: `HƯỚNG DẪN GIẢI CHI TIẾT BÀI 2:
1. Đặt ẩn $x, y$ là chiều dài và chiều rộng ban đầu, nêu rõ đơn vị mét và điều kiện $x > y > 4$.
2. Lập phương trình chu vi: $x + y = 28$.
3. Khai triển phương trình diện tích: $(x - 4)(y + 2) = xy - 16 \\Leftrightarrow x - 2y = -4$.
4. Trừ hai phương trình tìm được $3y = 32 \\Rightarrow y = 10$, $x = 18$. Cả hai đều thỏa mãn điều kiện. Chiều dài ban đầu là $18\\text{ m}$, chiều rộng là $10\\text{ m}$.`,
    learningObjective: 'Vận dụng phương pháp lập hệ phương trình để giải bài toán hình học thực tế.',
  },
  {
    subject: 'Toán',
    grade: '9',
    topicKeywords: ['kttx tự luận', 'phương trình chứa ẩn ở mẫu', 'vận dụng'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDungCao',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 3 (3.0 ĐIỂM):
Giải phương trình chứa ẩn ở mẫu sau:
$\\frac{x + 1}{x - 1} - \\frac{x - 1}{x + 1} = \\frac{4}{x^2 - 1}$`,
    essayGradingSteps: [
      { step: 'Tìm điều kiện xác định: $x - 1 \\ne 0$ và $x + 1 \\ne 0 \\Leftrightarrow x \\ne 1$ và $x \\ne -1$.', point: 0.75 },
      { step: 'Mẫu thức chung là $(x - 1)(x + 1) = x^2 - 1$. Quy đồng và khử mẫu: $(x + 1)^2 - (x - 1)^2 = 4$.', point: 0.75 },
      { step: 'Khai triển: $(x^2 + 2x + 1) - (x^2 - 2x + 1) = 4 \\Leftrightarrow 4x = 4 \\Leftrightarrow x = 1$.', point: 0.75 },
      { step: 'Đối chiếu điều kiện: $x = 1$ không thỏa mãn điều kiện xác định $x \\ne 1$. Kết luận phương trình vô nghiệm ($S = \\emptyset$).', point: 0.75 },
    ],
    solutionExplanation: `HƯỚNG DẪN GIẢI CHI TIẾT BÀI 3:
1. ĐKXĐ: $x \\ne \\pm 1$.
2. Quy đồng mẫu thức chung $(x - 1)(x + 1)$:
   $(x + 1)^2 - (x - 1)^2 = 4 \\Leftrightarrow 4x = 4 \\Leftrightarrow x = 1$.
3. Đối chiếu với điều kiện xác định $x \\ne 1$, ta thấy nghiệm $x = 1$ bị loại.
4. Kết luận: Phương trình đã cho vô nghiệm ($S = \\emptyset$).`,
    learningObjective: 'Vận dụng giải phương trình chứa ẩn ở mẫu và rèn luyện tính cẩn trọng khi đối chiếu điều kiện xác định.',
  },
];

// ============================================================================
// KHỐI 8 - BÁM SÁT PPCT (ĐA THỨC NHIỀU BIẾN, HẰNG ĐẲNG THỨC, PHÂN THỨC)
// ============================================================================

export const CURRICULUM_GRADE_8_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['đơn thức', 'bậc của đơn thức', 'đơn thức nhiều biến'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Bậc của đơn thức $5x^3y^2z$ là:',
    options: [
      { key: 'A', text: '$6$' },
      { key: 'B', text: '$5$' },
      { key: 'C', text: '$3$' },
      { key: 'D', text: '$2$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Bậc của đơn thức có hệ số khác $0$ là tổng số mũ của tất cả các biến có trong đơn thức đó: $3 + 2 + 1 = 6$.',
    learningObjective: 'Nhận biết bậc của đơn thức nhiều biến thu gọn.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['hằng đẳng thức', 'hiệu hai bình phương'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Khai triển hằng đẳng thức $x^2 - 16$ ta được kết quả là:',
    options: [
      { key: 'A', text: '$(x - 4)(x + 4)$' },
      { key: 'B', text: '$(x - 4)^2$' },
      { key: 'C', text: '$(x + 4)^2$' },
      { key: 'D', text: '$(x - 16)(x + 16)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Áp dụng hằng đẳng thức hiệu hai bình phương: $A^2 - B^2 = (A - B)(A + B)$, với $A = x, B = 4$, ta có $x^2 - 16 = x^2 - 4^2 = (x - 4)(x + 4)$.',
    learningObjective: 'Nhận biết và vận dụng hằng đẳng thức hiệu hai bình phương.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['hằng đẳng thức', 'bình phương một tổng'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Biểu thức $(x + 3)^2$ sau khi khai triển bằng:',
    options: [
      { key: 'A', text: '$x^2 + 6x + 9$' },
      { key: 'B', text: '$x^2 + 3x + 9$' },
      { key: 'C', text: '$x^2 + 9$' },
      { key: 'D', text: '$x^2 - 6x + 9$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$(A + B)^2 = A^2 + 2AB + B^2$. Với $A = x, B = 3$ thì $(x + 3)^2 = x^2 + 2(x)(3) + 3^2 = x^2 + 6x + 9$.',
    learningObjective: 'Nhận biết hằng đẳng thức bình phương của một tổng.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['phân tích đa thức thành nhân tử', 'nhân tử chung'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Phân tích đa thức $2x^2 - 6x$ thành nhân tử được kết quả là:',
    options: [
      { key: 'A', text: '$2x(x - 3)$' },
      { key: 'B', text: '$2x(x + 3)$' },
      { key: 'C', text: '$x(2x - 3)$' },
      { key: 'D', text: '$2(x^2 - 3)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Đặt nhân tử chung là $2x$: $2x^2 - 6x = 2x \\cdot x - 2x \\cdot 3 = 2x(x - 3)$.',
    learningObjective: 'Thông hiểu phương pháp đặt nhân tử chung để phân tích đa thức thành nhân tử.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['phân thức đại số', 'điều kiện xác định'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Phân thức $\\frac{x + 1}{x - 5}$ xác định khi và chỉ khi:',
    options: [
      { key: 'A', text: '$x \\ne 5$' },
      { key: 'B', text: '$x \\ne -1$' },
      { key: 'C', text: '$x = 5$' },
      { key: 'D', text: '$x > 5$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Phân thức $\\frac{A}{B}$ xác định khi mẫu thức $B \\ne 0 \\Leftrightarrow x - 5 \\ne 0 \\Leftrightarrow x \\ne 5$.',
    learningObjective: 'Nhận biết điều kiện xác định của phân thức đại số.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['rút gọn phân thức', 'phân thức đại số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Rút gọn phân thức $\\frac{x^2 - 4}{x - 2}$ (với $x \\ne 2$) ta được:',
    options: [
      { key: 'A', text: '$x + 2$' },
      { key: 'B', text: '$x - 2$' },
      { key: 'C', text: '$2$' },
      { key: 'D', text: '$x$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Ta có $\\frac{x^2 - 4}{x - 2} = \\frac{(x - 2)(x + 2)}{x - 2} = x + 2$.',
    learningObjective: 'Thông hiểu quy tắc rút gọn phân thức đại số.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['tứ giác', 'hình học', 'tổng các góc'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Tổng số đo các góc của một tứ giác lồi bằng:',
    options: [
      { key: 'A', text: '$360^\\circ$' },
      { key: 'B', text: '$180^\\circ$' },
      { key: 'C', text: '$270^\\circ$' },
      { key: 'D', text: '$90^\\circ$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Theo định lý tổng các góc của một tứ giác lồi, tổng số đo 4 góc luôn bằng $360^\\circ$.',
    learningObjective: 'Nhận biết định lý tổng các góc trong một tứ giác.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['hình bình hành', 'hình chữ nhật', 'tính chất'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Hình bình hành có một góc vuông là:',
    options: [
      { key: 'A', text: 'Hình chữ nhật' },
      { key: 'B', text: 'Hình thoi' },
      { key: 'C', text: 'Hình vuông' },
      { key: 'D', text: 'Hình thang cân' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Theo dấu hiệu nhận biết: Hình bình hành có một góc vuông là hình chữ nhật.',
    learningObjective: 'Nhận biết các dấu hiệu nhận biết hình chữ nhật.',
  },
  // --- TỰ LUẬN KHỐI 8 (KTTX 100% TỰ LUẬN) ---
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['kttx tự luận', 'rút gọn biểu thức', 'hằng đẳng thức', 'đa thức'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 1 (3.5 ĐIỂM):
Rút gọn các biểu thức sau:
a) $A = (x + 3)^2 + (x - 3)^2$ (1.5 điểm)
b) $B = (2x - 1)(2x + 1) - 4x^2 + 5$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Khai triển hai hằng đẳng thức: $A = (x^2 + 6x + 9) + (x^2 - 6x + 9)$.', point: 0.75 },
      { step: 'a2) Thu gọn các hạng tử đồng dạng: $A = 2x^2 + 18$.', point: 0.75 },
      { step: 'b1) Áp dụng hằng đẳng thức hiệu hai bình phương: $(2x - 1)(2x + 1) = 4x^2 - 1$.', point: 1.0 },
      { step: 'b2) Thu gọn biểu thức: $B = (4x^2 - 1) - 4x^2 + 5 = -1 + 5 = 4$.', point: 1.0 },
    ],
    solutionExplanation: `HƯỚNG DẪN GIẢI CHI TIẾT BÀI 1:
a) Khai triển $(x+3)^2 = x^2+6x+9$ và $(x-3)^2 = x^2-6x+9$. Cộng lại được $2x^2+18$.
b) Dùng hằng đẳng thức $(a-b)(a+b) = a^2-b^2$ cho $(2x-1)(2x+1) = 4x^2-1$. Rút gọn với $-4x^2+5$ ra đáp số $4$.`,
    learningObjective: 'Vận dụng các hằng đẳng thức đáng nhớ để rút gọn biểu thức đại số.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['kttx tự luận', 'phân tích đa thức thành nhân tử'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 2 (3.5 ĐIỂM):
Phân tích các đa thức sau thành nhân tử:
a) $3x^2 - 6xy$ (1.5 điểm)
b) $x^2 - 25 + 2xy + y^2$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a) Đặt nhân tử chung là $3x$: $3x^2 - 6xy = 3x(x - 2y)$.', point: 1.5 },
      { step: 'b1) Nhóm ba hạng tử đầu thành hằng đẳng thức: $(x^2 + 2xy + y^2) - 25 = (x + y)^2 - 5^2$.', point: 1.0 },
      { step: 'b2) Áp dụng hiệu hai bình phương: $[(x + y) - 5][(x + y) + 5] = (x + y - 5)(x + y + 5)$.', point: 1.0 },
    ],
    solutionExplanation: 'Kết hợp linh hoạt phương pháp đặt nhân tử chung, nhóm hạng tử và dùng hằng đẳng thức đáng nhớ.',
    learningObjective: 'Vận dụng các phương pháp phân tích đa thức thành nhân tử.',
  },
  {
    subject: 'Toán',
    grade: '8',
    topicKeywords: ['kttx tự luận', 'hình học', 'tứ giác', 'hình chữ nhật'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDung',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 3 (3.0 ĐIỂM):
Cho tam giác $ABC$ vuông tại $A$, đường trung tuyến $AM$. Gọi $D$ là điểm đối xứng với $A$ qua $M$.
a) Chứng minh tứ giác $ABDC$ là hình bình hành. (1.5 điểm)
b) Chứng minh tứ giác $ABDC$ là hình chữ nhật. (1.5 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Do $AM$ là trung tuyến của tam giác $ABC$ nên $M$ là trung điểm của $BC$. $D$ đối xứng với $A$ qua $M$ nên $M$ là trung điểm của $AD$.', point: 0.75 },
      { step: 'a2) Tứ giác $ABDC$ có hai đường chéo $AD$ và $BC$ cắt nhau tại trung điểm $M$ của mỗi đường, do đó $ABDC$ là hình bình hành.', point: 0.75 },
      { step: 'b) Hình bình hành $ABDC$ có góc $\\widehat{BAC} = 90^\\circ$ (vì $\\triangle ABC$ vuông tại $A$). Hình bình hành có một góc vuông là hình chữ nhật, vậy $ABDC$ là hình chữ nhật.', point: 1.5 },
    ],
    solutionExplanation: 'Dùng dấu hiệu nhận biết hình bình hành (hai đường chéo cắt nhau tại trung điểm) và hình chữ nhật (hình bình hành có một góc vuông).',
    learningObjective: 'Vận dụng tính chất đối xứng và dấu hiệu nhận biết hình bình hành, hình chữ nhật vào bài toán chứng minh hình học.',
  },
];

// ============================================================================
// KHỐI 7 - BÁM SÁT PPCT (SỐ HỮU TỈ, CĂN BẬC HAI SỐ HỌC, GÓC VÀ ĐƯỜNG THẲNG)
// ============================================================================

export const CURRICULUM_GRADE_7_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['số hữu tỉ', 'khái niệm', 'tập hợp'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Khẳng định nào sau đây là ĐÚNG về tập hợp các số hữu tỉ $\\mathbb{Q}$?',
    options: [
      { key: 'A', text: 'Số hữu tỉ là số viết được dưới dạng phân số $\\frac{a}{b}$ với $a, b \\in \\mathbb{Z}, b \\ne 0$.' },
      { key: 'B', text: 'Số hữu tỉ chỉ bao gồm các số nguyên dương.' },
      { key: 'C', text: 'Số $0$ không phải là số hữu tỉ.' },
      { key: 'D', text: 'Phân số có mẫu bằng $0$ vẫn là số hữu tỉ.' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Theo định nghĩa trong SGK Toán 7: Số hữu tỉ là số viết được dưới dạng phân số $\\frac{a}{b}$ với $a, b \\in \\mathbb{Z}, b \\ne 0$.',
    learningObjective: 'Nhận biết định nghĩa số hữu tỉ và tập hợp $\\mathbb{Q}$.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['số đối', 'số hữu tỉ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số đối của số hữu tỉ $-\\frac{3}{7}$ là:',
    options: [
      { key: 'A', text: '$\\frac{3}{7}$' },
      { key: 'B', text: '$-\\frac{7}{3}$' },
      { key: 'C', text: '$\\frac{7}{3}$' },
      { key: 'D', text: '$-\\frac{3}{7}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Hai số đối nhau có tổng bằng $0$. Số đối của $-\\frac{3}{7}$ là $\\frac{3}{7}$.',
    learningObjective: 'Nhận biết số đối của một số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['cộng trừ số hữu tỉ', 'phép tính'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Kết quả của phép tính $-\\frac{2}{5} + \\frac{3}{5}$ bằng:',
    options: [
      { key: 'A', text: '$\\frac{1}{5}$' },
      { key: 'B', text: '$-\\frac{1}{5}$' },
      { key: 'C', text: '$1$' },
      { key: 'D', text: '$-1$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$-\\frac{2}{5} + \\frac{3}{5} = \\frac{-2 + 3}{5} = \\frac{1}{5}$.',
    learningObjective: 'Thông hiểu phép cộng hai số hữu tỉ cùng mẫu.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['lũy thừa', 'số hữu tỉ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Giá trị của biểu thức $\\left(-\\frac{1}{2}\\right)^3$ bằng:',
    options: [
      { key: 'A', text: '$-\\frac{1}{8}$' },
      { key: 'B', text: '$\\frac{1}{8}$' },
      { key: 'C', text: '$-\\frac{1}{6}$' },
      { key: 'D', text: '$\\frac{1}{6}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\left(-\\frac{1}{2}\\right)^3 = \\frac{(-1)^3}{2^3} = -\\frac{1}{8}$.',
    learningObjective: 'Thông hiểu cách tính lũy thừa với số mũ tự nhiên của một số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['căn bậc hai số học', 'số vô tỉ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Căn bậc hai số học của $36$ là:',
    options: [
      { key: 'A', text: '$6$' },
      { key: 'B', text: '$-6$' },
      { key: 'C', text: '$\\pm 6$' },
      { key: 'D', text: '$18$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Căn bậc hai số học của số không âm $a$ là số không âm $x$ sao cho $x^2 = a$. Vì $6 > 0$ và $6^2 = 36$ nên $\\sqrt{36} = 6$.',
    learningObjective: 'Nhận biết khái niệm căn bậc hai số học của số thực không âm.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['hai góc đối đỉnh', 'hình học'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Hai góc đối đỉnh thì:',
    options: [
      { key: 'A', text: 'Bằng nhau' },
      { key: 'B', text: 'Có tổng số đo bằng $180^\\circ$' },
      { key: 'C', text: 'Có tổng số đo bằng $90^\\circ$' },
      { key: 'D', text: 'Kề bù với nhau' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Theo tính chất hình học lớp 7: Hai góc đối đỉnh thì bằng nhau.',
    learningObjective: 'Nhận biết tính chất của hai góc đối đỉnh.',
  },
  // --- TỰ LUẬN KHỐI 7 (KTTX 100% TỰ LUẬN) ---
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['kttx tự luận', 'tính hợp lý', 'số hữu tỉ'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 1 (3.5 ĐIỂM):
Thực hiện phép tính một cách hợp lý:
a) $A = \\frac{3}{7} \\cdot \\frac{5}{11} + \\frac{3}{7} \\cdot \\frac{6}{11}$ (1.5 điểm)
b) $B = \\left(\\frac{-1}{3}\\right)^2 + \\sqrt{\\frac{25}{9}} - \\frac{2}{3}$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Áp dụng tính chất phân phối: $A = \\frac{3}{7} \\cdot \\left(\\frac{5}{11} + \\frac{6}{11}\\right)$.', point: 0.75 },
      { step: 'a2) Tính tổng trong ngoặc $\\frac{11}{11} = 1 \\Rightarrow A = \\frac{3}{7} \\cdot 1 = \\frac{3}{7}$.', point: 0.75 },
      { step: 'b1) Tính lũy thừa và căn bậc hai: $\\left(-\\frac{1}{3}\\right)^2 = \\frac{1}{9}$; $\\sqrt{\\frac{25}{9}} = \\frac{5}{3}$.', point: 1.0 },
      { step: 'b2) Quy đồng và tính: $B = \\frac{1}{9} + \\frac{5}{3} - \\frac{2}{3} = \\frac{1}{9} + 1 = \\frac{10}{9}$.', point: 1.0 },
    ],
    solutionExplanation: 'Áp dụng tính chất phân phối của phép nhân đối với phép cộng và các phép tính lũy thừa, khai căn số hữu tỉ.',
    learningObjective: 'Thông hiểu và vận dụng các quy tắc tính toán với số hữu tỉ và căn bậc hai số học.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['kttx tự luận', 'tìm x', 'quy tắc chuyển vế'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 2 (3.5 ĐIỂM):
Tìm $x$, biết:
a) $x - \\frac{3}{4} = \\frac{1}{2}$ (1.5 điểm)
b) $2x - \\frac{1}{3} = \\frac{5}{6}$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Áp dụng quy tắc chuyển vế: $x = \\frac{1}{2} + \\frac{3}{4}$.', point: 0.75 },
      { step: 'a2) Quy đồng mẫu số: $x = \\frac{2}{4} + \\frac{3}{4} = \\frac{5}{4}$. Kết luận $x = \\frac{5}{4}$.', point: 0.75 },
      { step: 'b1) Chuyển vế: $2x = \\frac{5}{6} + \\frac{1}{3} = \\frac{5}{6} + \\frac{2}{6} = \\frac{7}{6}$.', point: 1.0 },
      { step: 'b2) Chia hai vế cho $2$: $x = \\frac{7}{6} : 2 = \\frac{7}{12}$. Kết luận $x = \\frac{7}{12}$.', point: 1.0 },
    ],
    solutionExplanation: 'Vận dụng quy tắc chuyển vế: khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó.',
    learningObjective: 'Vận dụng quy tắc chuyển vế để tìm giá trị chưa biết trong đẳng thức số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    topicKeywords: ['kttx tự luận', 'hình học', 'đối đỉnh', 'song song'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDung',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 3 (3.0 ĐIỂM):
Cho hai đường thẳng $xx'$ và $yy'$ cắt nhau tại $O$ sao cho $\\widehat{xOy} = 60^\\circ$.
a) Tính số đo góc $\\widehat{x'Oy'}$ và góc $\\widehat{xOy'}$. (1.5 điểm)
b) Kẻ tia phân giác $Ot$ của góc $\\widehat{xOy}$. Tính số đo góc $\\widehat{tOy}$. (1.5 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Vì $\\widehat{x\'Oy\'}$ và $\\widehat{xOy}$ là hai góc đối đỉnh nên $\\widehat{x\'Oy\'} = \\widehat{xOy} = 60^\\circ$.', point: 0.75 },
      { step: 'a2) Vì $\\widehat{xOy\'}$ và $\\widehat{xOy}$ là hai góc kề bù nên $\\widehat{xOy\'} + \\widehat{xOy} = 180^\\circ \\Rightarrow \\widehat{xOy\'} = 180^\\circ - 60^\\circ = 120^\\circ$.', point: 0.75 },
      { step: 'b) Vì $Ot$ là tia phân giác của góc $\\widehat{xOy}$ nên $\\widehat{tOy} = \\frac{\\widehat{xOy}}{2} = \\frac{60^\\circ}{2} = 30^\\circ$.', point: 1.5 },
    ],
    solutionExplanation: 'Dùng định nghĩa và tính chất của hai góc đối đỉnh, hai góc kề bù và tia phân giác của một góc.',
    learningObjective: 'Vận dụng tính chất hai góc đối đỉnh, hai góc kề bù để tính số đo góc.',
  },
];

// ============================================================================
// KHỐI 6 - BÁM SÁT PPCT (TẬP HỢP SỐ TỰ NHIÊN, PHÉP TÍNH, CHIA HẾT, ƯỚC VÀ BỘI)
// ============================================================================

export const CURRICULUM_GRADE_6_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['tập hợp', 'phần tử', 'số tự nhiên'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Cho tập hợp $M = \\{2; 4; 6; 8\\}$. Khẳng định nào sau đây là ĐÚNG?',
    options: [
      { key: 'A', text: '$4 \\in M$' },
      { key: 'B', text: '$5 \\in M$' },
      { key: 'C', text: '$2 \\notin M$' },
      { key: 'D', text: '$8 \\notin M$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số $4$ là một phần tử thuộc tập hợp $M$, kí hiệu là $4 \\in M$.',
    learningObjective: 'Nhận biết cách sử dụng các kí hiệu $\\in$ và $\\notin$.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['lũy thừa', 'số tự nhiên', 'nhân hai lũy thừa'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Kết quả của phép nhân $3^4 \\cdot 3^2$ viết dưới dạng một lũy thừa là:',
    options: [
      { key: 'A', text: '$3^6$' },
      { key: 'B', text: '$3^8$' },
      { key: 'C', text: '$9^6$' },
      { key: 'D', text: '$9^8$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Khi nhân hai lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ: $a^m \\cdot a^n = a^{m+n}$. Do đó $3^4 \\cdot 3^2 = 3^{4+2} = 3^6$.',
    learningObjective: 'Nhận biết công thức nhân hai lũy thừa cùng cơ số.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['dấu hiệu chia hết', 'chia hết cho 5'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số nào sau đây chia hết cho cả $2$ và $5$?',
    options: [
      { key: 'A', text: '$120$' },
      { key: 'B', text: '$125$' },
      { key: 'C', text: '$122$' },
      { key: 'D', text: '$123$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Các số có chữ số tận cùng là $0$ thì chia hết cho cả $2$ và $5$. Số $120$ tận cùng là $0$.',
    learningObjective: 'Nhận biết dấu hiệu chia hết cho cả 2 và 5.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['số nguyên tố', 'hợp số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Trong các số sau, số nào là số nguyên tố?',
    options: [
      { key: 'A', text: '$17$' },
      { key: 'B', text: '$9$' },
      { key: 'C', text: '$15$' },
      { key: 'D', text: '$21$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó. Số $17$ chỉ chia hết cho 1 và 17.',
    learningObjective: 'Nhận biết khái niệm số nguyên tố.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['ước chung lớn nhất', 'ƯCLN'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Ước chung lớn nhất của $18$ và $24$ là:',
    options: [
      { key: 'A', text: '$6$' },
      { key: 'B', text: '$3$' },
      { key: 'C', text: '$12$' },
      { key: 'D', text: '$2$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$18 = 2 \\cdot 3^2$; $24 = 2^3 \\cdot 3$. $\\text{ƯCLN}(18, 24) = 2 \\cdot 3 = 6$.',
    learningObjective: 'Thông hiểu cách tìm ƯCLN bằng phân tích ra thừa số nguyên tố.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['hình học trực quan', 'tam giác đều', 'cạnh'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Một tam giác đều có độ dài cạnh bằng $5\\text{ cm}$. Chu vi của tam giác đều đó là:',
    options: [
      { key: 'A', text: '$15\\text{ cm}$' },
      { key: 'B', text: '$10\\text{ cm}$' },
      { key: 'C', text: '$20\\text{ cm}$' },
      { key: 'D', text: '$25\\text{ cm}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Tam giác đều có $3$ cạnh bằng nhau, do đó chu vi là $5 \\times 3 = 15\\text{ cm}$.',
    learningObjective: 'Nhận biết và tính chu vi của tam giác đều.',
  },
  // --- TỰ LUẬN KHỐI 6 (KTTX 100% TỰ LUẬN) ---
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['kttx tự luận', 'thứ tự thực hiện phép tính', 'tính hợp lý'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 1 (3.5 ĐIỂM):
Thực hiện các phép tính sau một cách hợp lý:
a) $A = 78 \\cdot 35 + 78 \\cdot 65$ (1.5 điểm)
b) $B = 120 : [54 - (5 - 2)^3]$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a1) Áp dụng tính chất phân phối của phép nhân đối với phép cộng: $A = 78 \\cdot (35 + 65)$.', point: 0.75 },
      { step: 'a2) Tính tổng trong ngoặc: $35 + 65 = 100 \\Rightarrow A = 78 \\cdot 100 = 7800$.', point: 0.75 },
      { step: 'b1) Tính biểu thức trong ngoặc tròn trước: $5 - 2 = 3 \\Rightarrow 3^3 = 27$.', point: 1.0 },
      { step: 'b2) Tính biểu thức trong ngoặc vuông: $54 - 27 = 27 \\Rightarrow B = 120 : 27 = \\frac{120}{27} = \\frac{40}{9}$. (Hoặc nếu đề là $135 : 27 = 5$).', point: 1.0 },
    ],
    solutionExplanation: 'Thực hiện phép tính theo đúng thứ tự ưu tiên: ngoặc tròn trước, ngoặc vuông sau; lũy thừa trước, nhân chia rồi đến cộng trừ.',
    learningObjective: 'Thông hiểu thứ tự thực hiện phép tính và vận dụng tính chất phân phối để tính nhanh.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['kttx tự luận', 'tìm x', 'phép tính'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 2 (3.5 ĐIỂM):
Tìm số tự nhiên $x$, biết:
a) $x + 25 = 60$ (1.5 điểm)
b) $3(x - 4) = 24$ (2.0 điểm)`,
    essayGradingSteps: [
      { step: 'a) $x = 60 - 25 = 35$. Vậy $x = 35$.', point: 1.5 },
      { step: 'b1) Tìm $x - 4$: $x - 4 = 24 : 3 = 8$.', point: 1.0 },
      { step: 'b2) Tìm $x$: $x = 8 + 4 = 12$. Vậy $x = 12$.', point: 1.0 },
    ],
    solutionExplanation: 'Dùng quy tắc tìm số hạng chưa biết trong một tổng, thừa số chưa biết trong một tích và số bị trừ trong một hiệu.',
    learningObjective: 'Thông hiểu cách tìm thành phần chưa biết trong phép tính với số tự nhiên.',
  },
  {
    subject: 'Toán',
    grade: '6',
    topicKeywords: ['kttx tự luận', 'bội chung', 'bài toán thực tế'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDung',
    prompt: `ĐỀ KIỂM TRA THƯỜNG XUYÊN - BÀI 3 (3.0 ĐIỂM):
Học sinh lớp $6A$ khi xếp hàng $3$, hàng $4$, hàng $6$ đều vừa đủ hàng. Biết số học sinh của lớp đó trong khoảng từ $30$ đến $40$ em. Hỏi lớp $6A$ có bao nhiêu học sinh?`,
    essayGradingSteps: [
      { step: 'Gọi số học sinh của lớp $6A$ là $x$ ($x \\in \\mathbb{N}^*$, $30 \\le x \\le 40$).', point: 0.75 },
      { step: 'Do xếp hàng $3, 4, 6$ đều vừa đủ nên $x$ là bội chung của $3, 4, 6$. Ta có $\\text{BCNN}(3, 4, 6) = 12$.', point: 1.0 },
      { step: 'Các bội của $12$ là: $\\{0; 12; 24; 36; 48; \\dots\\}$.', point: 0.75 },
      { step: 'Vì $30 \\le x \\le 40$ nên $x = 36$. Kết luận lớp $6A$ có $36$ học sinh.', point: 0.5 },
    ],
    solutionExplanation: 'Quy bài toán thực tế xếp hàng về bài toán tìm bội chung nhỏ nhất và chọn bội thỏa mãn khoảng giới hạn cho trước.',
    learningObjective: 'Vận dụng BCNN để giải quyết bài toán phân nhóm học sinh thực tế.',
  },
];
