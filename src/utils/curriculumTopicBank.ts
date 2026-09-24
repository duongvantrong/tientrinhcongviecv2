import { BankQuestionTemplate } from '../types';

// ============================================================================
// NGÂN HÀNG CÂU HỎI CHUẨN PPCT & SGK (GDPT 2018)
// Phân hóa chặt chẽ theo từng chương, từng bài học, bám sát sách giáo khoa
// Tuyệt đối không sinh câu hỏi ngoài nội dung bài học đã chọn
// ============================================================================

// ----------------------------------------------------------------------------
// 1. KHỐI 9 - CHƯƠNG I: PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
// ----------------------------------------------------------------------------
export const GRADE_9_HE_PHUONG_TRINH_QUESTIONS: BankQuestionTemplate[] = [
  // --- NHẬN BIẾT (MCQ) ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Khái niệm phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'phương trình bậc nhất hai ẩn', 'khái niệm', 'nhận biết'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Phương trình nào sau đây là phương trình bậc nhất hai ẩn $x$ và $y$?',
    options: [
      { key: 'A', text: '$3x - 2y = 5$' },
      { key: 'B', text: '$2x^2 + y = 3$' },
      { key: 'C', text: '$x - \\frac{3}{y} = 1$' },
      { key: 'D', text: '$xy + 1 = 0$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Phương trình bậc nhất hai ẩn $x$ và $y$ có dạng tổng quát $ax + by = c$, trong đó $a$ và $b$ không đồng thời bằng $0$. Do đó $3x - 2y = 5$ là phương trình bậc nhất hai ẩn.',
    learningObjective: 'Nhận biết dạng tổng quát của phương trình bậc nhất hai ẩn $ax + by = c$.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Khái niệm phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'phương trình bậc nhất hai ẩn', 'hệ số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Trong phương trình bậc nhất hai ẩn $5x - 4y = 9$, các hệ số $a, b, c$ lần lượt là:',
    options: [
      { key: 'A', text: '$a = 5;\\ b = -4;\\ c = 9$' },
      { key: 'B', text: '$a = 5;\\ b = 4;\\ c = 9$' },
      { key: 'C', text: '$a = -4;\\ b = 5;\\ c = 9$' },
      { key: 'D', text: '$a = 5;\\ b = -4;\\ c = -9$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Phương trình dạng $ax + by = c$ có $a = 5$, $b = -4$ và $c = 9$.',
    learningObjective: 'Chỉ ra được các hệ số $a, b, c$ trong phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Khái niệm phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'phương trình bậc nhất hai ẩn', 'nghiệm', 'cặp số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Cặp số nào sau đây là một nghiệm của phương trình $2x - y = 3$?',
    options: [
      { key: 'A', text: '$(2; 1)$' },
      { key: 'B', text: '$(1; 2)$' },
      { key: 'C', text: '$(0; 3)$' },
      { key: 'D', text: '$(2; -1)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Thay $x = 2, y = 1$ vào vế trái phương trình: $2(2) - 1 = 4 - 1 = 3$ (bằng vế phải). Vậy cặp số $(2; 1)$ là nghiệm của phương trình.',
    learningObjective: 'Kiểm tra và nhận biết cặp số $(x_0; y_0)$ là một nghiệm của phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'khái niệm', 'nghiệm của hệ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Cặp số $(1; -2)$ là nghiệm của hệ phương trình nào dưới đây?',
    options: [
      { key: 'A', text: '$\\begin{cases} x + y = -1 \\\\ 2x - y = 4 \\end{cases}$' },
      { key: 'B', text: '$\\begin{cases} x - y = 1 \\\\ x + 2y = 3 \\end{cases}$' },
      { key: 'C', text: '$\\begin{cases} 2x + y = 3 \\\\ x - y = -1 \\end{cases}$' },
      { key: 'D', text: '$\\begin{cases} 3x + y = 2 \\\\ 2x + y = 5 \\end{cases}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Thay $x = 1, y = -2$ vào hệ A: $1 + (-2) = -1$ và $2(1) - (-2) = 4$ (đều thỏa mãn).',
    learningObjective: 'Nhận biết cặp số là nghiệm của hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Khái niệm phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'tập nghiệm', 'vô số nghiệm'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số nghiệm của một phương trình bậc nhất hai ẩn $ax + by = c$ (với $a^2 + b^2 \\ne 0$) trong tập số thực $\\mathbb{R}$ là:',
    options: [
      { key: 'A', text: 'Vô số nghiệm' },
      { key: 'B', text: 'Chỉ có 1 nghiệm' },
      { key: 'C', text: 'Chỉ có 2 nghiệm' },
      { key: 'D', text: 'Vô nghiệm' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Mỗi phương trình bậc nhất hai ẩn luôn có vô số nghiệm, tập nghiệm của nó được biểu diễn bởi một đường thẳng trên mặt phẳng tọa độ $Oxy$.',
    learningObjective: 'Nhận biết tính chất về tập nghiệm của phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'số nghiệm', 'vị trí tương đối'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Về mặt hình học, hệ hai phương trình bậc nhất hai ẩn có nghiệm duy nhất khi và chỉ khi hai đường thẳng biểu diễn tập nghiệm của hai phương trình đó:',
    options: [
      { key: 'A', text: 'Cắt nhau tại một điểm duy nhất' },
      { key: 'B', text: 'Song song với nhau' },
      { key: 'C', text: 'Trùng nhau' },
      { key: 'D', text: 'Vuông góc với nhau' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số nghiệm của hệ hai phương trình bậc nhất hai ẩn bằng số giao điểm của hai đường thẳng biểu diễn tập nghiệm. Do đó hệ có nghiệm duy nhất khi hai đường thẳng cắt nhau.',
    learningObjective: 'Hiểu ý nghĩa hình học về nghiệm của hệ hai phương trình bậc nhất hai ẩn.',
  },

  // --- THÔNG HIỂU (MCQ) ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'phương pháp thế', 'giải hệ'],
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
    solutionExplanation: 'Từ phương trình thứ nhất suy ra $x = 2y + 1$. Thế vào phương trình thứ hai: $2(2y + 1) + y = 7 \\Leftrightarrow 5y + 2 = 7 \\Leftrightarrow 5y = 5 \\Leftrightarrow y = 1$. Khi đó $x = 2(1) + 1 = 3$. Cặp nghiệm là $(3; 1)$.',
    learningObjective: 'Giải hệ phương trình bậc nhất hai ẩn bằng phương pháp thế.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'phương pháp cộng đại số', 'giải hệ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Nghiệm của hệ phương trình $\\begin{cases} 3x + 2y = 8 \\\\ 2x - y = 3 \\end{cases}$ là cặp số $(x; y)$ bằng:',
    options: [
      { key: 'A', text: '$(2; 1)$' },
      { key: 'B', text: '$(1; 2)$' },
      { key: 'C', text: '$(2; -1)$' },
      { key: 'D', text: '$(0; 4)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Nhân phương trình thứ hai với $2$: $4x - 2y = 6$. Cộng từng vế với phương trình thứ nhất: $7x = 14 \\Rightarrow x = 2$. Thay $x = 2$ vào $2x - y = 3 \\Rightarrow y = 1$. Nghiệm là $(2; 1)$.',
    learningObjective: 'Giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'giải hệ', 'tổng nghiệm'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Gọi $(x_0; y_0)$ là nghiệm của hệ phương trình $\\begin{cases} 2x + 3y = 7 \\\\ x - y = 1 \\end{cases}$. Giá trị của biểu thức $x_0 + y_0$ bằng:',
    options: [
      { key: 'A', text: '$3$' },
      { key: 'B', text: '$4$' },
      { key: 'C', text: '$2$' },
      { key: 'D', text: '$5$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Từ $x - y = 1 \\Rightarrow x = y + 1$. Thay vào phương trình đầu: $2(y + 1) + 3y = 7 \\Leftrightarrow 5y = 5 \\Rightarrow y_0 = 1$. Khi đó $x_0 = 2$. Vậy $x_0 + y_0 = 2 + 1 = 3$.',
    learningObjective: 'Thông hiểu việc tìm nghiệm của hệ phương trình và tính giá trị biểu thức liên quan.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'vô nghiệm', 'song song'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Hệ phương trình nào sau đây là hệ vô nghiệm?',
    options: [
      { key: 'A', text: '$\\begin{cases} 2x - y = 3 \\\\ 4x - 2y = 5 \\end{cases}$' },
      { key: 'B', text: '$\\begin{cases} x + y = 3 \\\\ x - y = 1 \\end{cases}$' },
      { key: 'C', text: '$\\begin{cases} 2x - y = 3 \\\\ 4x - 2y = 6 \\end{cases}$' },
      { key: 'D', text: '$\\begin{cases} x + 2y = 4 \\\\ 2x + y = 5 \\end{cases}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Xét hệ A: $\\frac{2}{4} = \\frac{-1}{-2} \\ne \\frac{3}{5}$ nên hai đường thẳng song song, hệ phương trình vô nghiệm.',
    learningObjective: 'Nhận biết và kiểm tra điều kiện hệ hai phương trình bậc nhất hai ẩn vô nghiệm.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'tích nghiệm', 'giải hệ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Biết cặp số $(x_0; y_0)$ là nghiệm của hệ phương trình $\\begin{cases} x + 2y = 5 \\\\ 3x - y = 1 \\end{cases}$. Tích $x_0 \\cdot y_0$ bằng:',
    options: [
      { key: 'A', text: '$2$' },
      { key: 'B', text: '$3$' },
      { key: 'C', text: '$1$' },
      { key: 'D', text: '$4$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Nhân phương trình thứ hai với $2$: $6x - 2y = 2$. Cộng với phương trình thứ nhất: $7x = 7 \\Rightarrow x_0 = 1$. Thay vào $y_0 = 3(1) - 1 = 2$. Vậy $x_0 \\cdot y_0 = 1 \\cdot 2 = 2$.',
    learningObjective: 'Tính toán thành thạo nghiệm của hệ và xác định tích các nghiệm.',
  },

  // --- VẬN DỤNG (MCQ) ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'tham số m', 'nghiệm cho trước'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Tìm giá trị của tham số $m$ để hệ phương trình $\\begin{cases} 2x + my = 5 \\\\ x - y = 1 \\end{cases}$ nhận cặp số $(2; 1)$ làm nghiệm:',
    options: [
      { key: 'A', text: '$m = 1$' },
      { key: 'B', text: '$m = 2$' },
      { key: 'C', text: '$m = -1$' },
      { key: 'D', text: '$m = 3$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Thay $x = 2, y = 1$ vào phương trình $2x + my = 5$: $2(2) + m(1) = 5 \\Leftrightarrow 4 + m = 5 \\Leftrightarrow m = 1$.',
    learningObjective: 'Vận dụng định nghĩa nghiệm để tìm tham số trong hệ phương trình.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải bài toán bằng cách lập hệ phương trình',
    topicKeywords: ['hệ phương trình', 'toán thực tế', 'tìm hai số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Hai bạn An và Bình có tổng cộng $45$ viên bi. Nếu An cho Bình $5$ viên bi thì số bi của An vẫn nhiều hơn Bình $5$ viên. Gọi số bi ban đầu của An là $x$ và Bình là $y$. Hệ phương trình biểu thị bài toán là:',
    options: [
      { key: 'A', text: '$\\begin{cases} x + y = 45 \\\\ (x - 5) - (y + 5) = 5 \\end{cases}$' },
      { key: 'B', text: '$\\begin{cases} x + y = 45 \\\\ x - y = 5 \\end{cases}$' },
      { key: 'C', text: '$\\begin{cases} x + y = 45 \\\\ x - 5 = y + 5 \\end{cases}$' },
      { key: 'D', text: '$\\begin{cases} x - y = 45 \\\\ x + y = 5 \\end{cases}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Tổng số bi là $45$: $x + y = 45$. Sau khi An cho Bình $5$ bi thì số bi của An là $x - 5$ và Bình là $y + 5$. Hiệu số bi là $(x - 5) - (y + 5) = 5$.',
    learningObjective: 'Thiết lập hệ phương trình bậc nhất hai ẩn từ bài toán thực tế.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'đặt ẩn phụ', 'phân thức'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Nghiệm của hệ phương trình $\\begin{cases} \\frac{1}{x} + \\frac{1}{y} = \\frac{5}{6} \\\\ \\frac{1}{x} - \\frac{1}{y} = \\frac{1}{6} \\end{cases}$ là cặp số $(x; y)$ bằng:',
    options: [
      { key: 'A', text: '$(2; 3)$' },
      { key: 'B', text: '$(3; 2)$' },
      { key: 'C', text: '$\\left(\\frac{1}{2}; \\frac{1}{3}\\right)$' },
      { key: 'D', text: '$(1; 2)$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Đặt $u = \\frac{1}{x}, v = \\frac{1}{y}$. Hệ trở thành $\\begin{cases} u + v = \\frac{5}{6} \\\\ u - v = \\frac{1}{6} \\end{cases} \\Rightarrow 2u = 1 \\Rightarrow u = \\frac{1}{2} \\Rightarrow x = 2$. Thay vào tìm được $v = \\frac{1}{3} \\Rightarrow y = 3$.',
    learningObjective: 'Giải hệ phương trình quy về bậc nhất hai ẩn bằng phương pháp đặt ẩn phụ.',
  },

  // --- PHẦN 2: ĐÚNG / SAI ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'đúng sai', 'phương pháp cộng'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'thongHieu',
    prompt: 'Cho hệ phương trình bậc nhất hai ẩn $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 7 \\end{cases}$. Xét tính Đúng/Sai của các khẳng định sau:',
    tfStatements: [
      { subKey: 'a', text: 'Nhân hai vế của phương trình thứ nhất với $2$ ta được $4x + 2y = 14$.', isCorrect: true, explanation: 'Đúng vì $2(2x + y) = 4x + 2y$ và $2 \\cdot 7 = 14$.' },
      { subKey: 'b', text: 'Cộng từng vế hai phương trình mới ta triệt tiêu được ẩn $y$ và được $7x = 21$.', isCorrect: true, explanation: 'Đúng vì $(4x + 2y) + (3x - 2y) = 7x$ và $14 + 7 = 21$.' },
      { subKey: 'c', text: 'Nghiệm $x$ của hệ phương trình bằng $2$.', isCorrect: false, explanation: 'Sai vì $7x = 21 \\Rightarrow x = 3$.' },
      { subKey: 'd', text: 'Cặp số $(3; 1)$ là nghiệm duy nhất của hệ phương trình đã cho.', isCorrect: true, explanation: 'Đúng vì $x = 3 \\Rightarrow y = 7 - 2(3) = 1$.' },
    ],
    solutionExplanation: 'Dùng phương pháp cộng đại số triệt tiêu $y$, giải ra $x = 3$, thay vào tìm $y = 1$. Cặp nghiệm là $(3; 1)$.',
    learningObjective: 'Kiểm tra và đánh giá từng bước thực hiện phương pháp cộng đại số giải hệ phương trình.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Khái niệm phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'đúng sai', 'khái niệm'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Xét các khẳng định sau về phương trình bậc nhất hai ẩn và hệ hai phương trình bậc nhất hai ẩn:',
    tfStatements: [
      { subKey: 'a', text: 'Phương trình $0x + 3y = 6$ là phương trình bậc nhất hai ẩn.', isCorrect: true, explanation: 'Đúng vì $a = 0, b = 3 \\ne 0$ (hệ số $a$ và $b$ không đồng thời bằng 0).' },
      { subKey: 'b', text: 'Phương trình $2x - y = 4$ chỉ có một nghiệm duy nhất là $(2; 0)$.', isCorrect: false, explanation: 'Sai vì phương trình bậc nhất hai ẩn luôn có vô số nghiệm.' },
      { subKey: 'c', text: 'Cặp số $(1; 1)$ là nghiệm của hệ $\\begin{cases} x + y = 2 \\\\ 2x - y = 1 \\end{cases}$.', isCorrect: true, explanation: 'Đúng vì $1 + 1 = 2$ và $2(1) - 1 = 1$.' },
      { subKey: 'd', text: 'Hệ phương trình $\\begin{cases} x + y = 1 \\\\ x + y = 2 \\end{cases}$ là hệ có vô số nghiệm.', isCorrect: false, explanation: 'Sai vì tổng của cùng một cặp số không thể vừa bằng 1 vừa bằng 2, hệ vô nghiệm.' },
    ],
    solutionExplanation: 'Nắm vững định nghĩa phương trình bậc nhất hai ẩn, số nghiệm và nghiệm của hệ phương trình.',
    learningObjective: 'Phân biệt đúng sai các kiến thức nền tảng về phương trình và hệ hai phương trình bậc nhất hai ẩn.',
  },

  // --- PHẦN 3: TRẢ LỜI NGẮN ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'trả lời ngắn', 'nghiệm x'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm giá trị của $x$ trong nghiệm $(x; y)$ của hệ phương trình $\\begin{cases} 3x + y = 10 \\\\ x - y = 2 \\end{cases}$. Điền đáp số:',
    shortAnswerText: '3',
    solutionExplanation: 'Cộng hai phương trình vế theo vế: $4x = 12 \\Leftrightarrow x = 3$.',
    learningObjective: 'Tính toán nhanh giá trị nghiệm của hệ phương trình.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'trả lời ngắn', 'nghiệm y'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm giá trị của $y$ trong nghiệm $(x; y)$ của hệ phương trình $\\begin{cases} 2x + 3y = 13 \\\\ 2x - y = 5 \\end{cases}$. Điền đáp số:',
    shortAnswerText: '2',
    solutionExplanation: 'Trừ phương trình thứ hai cho phương trình thứ nhất vế theo vế: $4y = 8 \\Leftrightarrow y = 2$.',
    learningObjective: 'Tính toán thành thạo nghiệm $y$ của hệ phương trình.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'trả lời ngắn', 'tổng nghiệm'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Gọi $(x_0; y_0)$ là nghiệm của hệ phương trình $\\begin{cases} x + 2y = 8 \\\\ 3x - 2y = 8 \\end{cases}$. Tính giá trị tổng $x_0 + y_0$. Điền đáp số:',
    shortAnswerText: '6',
    solutionExplanation: 'Cộng hai vế: $4x = 16 \\Rightarrow x_0 = 4$. Thay vào tìm $y_0 = 2$. Tổng $x_0 + y_0 = 4 + 2 = 6$.',
    learningObjective: 'Giải hệ phương trình và tính giá trị tổng nghiệm.',
  },

  // --- PHẦN 4: TỰ LUẬN ---
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    topicKeywords: ['hệ phương trình', 'tự luận', 'bài toán giải hệ'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: 'Giải hệ phương trình sau bằng phương pháp thích hợp: $\\begin{cases} 3x + 2y = 11 \\\\ 2x - y = 5 \\end{cases}$',
    essayGradingSteps: [
      { step: 'Từ phương trình (2) rút ra $y = 2x - 5$ (hoặc nhân 2 vào PT (2) để cộng đại số).', point: 0.5 },
      { step: 'Thế $y = 2x - 5$ vào PT (1): $3x + 2(2x - 5) = 11 \\Leftrightarrow 3x + 4x - 10 = 11 \\Leftrightarrow 7x = 21 \\Leftrightarrow x = 3$.', point: 0.5 },
      { step: 'Thay $x = 3$ vào biểu thức của $y$: $y = 2(3) - 5 = 1$. Kết luận hệ phương trình có nghiệm duy nhất $(x; y) = (3; 1)$.', point: 0.5 },
    ],
    solutionExplanation: 'Áp dụng phương pháp thế hoặc cộng đại số để giải hệ hai phương trình bậc nhất hai ẩn.',
    learningObjective: 'Trình bày lời giải chi tiết, chính xác hệ hai phương trình bậc nhất hai ẩn.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    lesson: 'Giải bài toán bằng cách lập hệ phương trình',
    topicKeywords: ['hệ phương trình', 'tự luận', 'toán chuyển động', 'toán thực tế'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'vanDung',
    prompt: 'Một ca nô xuôi dòng một khúc sông dài $90\\text{ km}$ hết $3$ giờ và ngược dòng khúc sông đó hết $5$ giờ. Tính vận tốc riêng của ca nô và vận tốc của dòng nước (biết vận tốc của ca nô và dòng nước không đổi).',
    essayGradingSteps: [
      { step: 'Gọi vận tốc riêng của ca nô là $x\\text{ (km/h)}$ và vận tốc dòng nước là $y\\text{ (km/h)}$ ($x > y > 0$). Vận tốc xuôi dòng là $x + y$, ngược dòng là $x - y$.', point: 0.25 },
      { step: 'Ca nô xuôi dòng $90\\text{ km}$ hết $3$ giờ nên ta có phương trình: $3(x + y) = 90 \\Leftrightarrow x + y = 30$.', point: 0.25 },
      { step: 'Ca nô ngược dòng $90\\text{ km}$ hết $5$ giờ nên ta có phương trình: $5(x - y) = 90 \\Leftrightarrow x - y = 18$.', point: 0.25 },
      { step: 'Lập hệ phương trình $\\begin{cases} x + y = 30 \\\\ x - y = 18 \\end{cases}$. Cộng hai phương trình được $2x = 48 \\Rightarrow x = 24$. Thay vào tìm $y = 6$ (thỏa mãn điều kiện).', point: 0.5 },
      { step: 'Kết luận: Vận tốc riêng của ca nô là $24\\text{ km/h}$, vận tốc dòng nước là $6\\text{ km/h}$.', point: 0.25 },
    ],
    solutionExplanation: 'Lập hệ phương trình từ công thức chuyển động xuôi dòng và ngược dòng: $v_{\\text{xuôi}} = v_{\\text{riêng}} + v_{\\text{nước}}$, $v_{\\text{ngược}} = v_{\\text{riêng}} - v_{\\text{nước}}$.',
    learningObjective: 'Vận dụng giải bài toán thực tế bằng cách lập hệ hai phương trình bậc nhất hai ẩn.',
  },
];

// ----------------------------------------------------------------------------
// 2. KHỐI 7 - CHƯƠNG I: SỐ HỮU TỈ (SGK TOÁN 7 GDPT 2018)
// ----------------------------------------------------------------------------
export const GRADE_7_SO_HUU_TI_QUESTIONS: BankQuestionTemplate[] = [
  // --- NHẬN BIẾT (MCQ) ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Tập hợp các số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'khái niệm', 'tập hợp Q', 'định nghĩa'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số hữu tỉ là số viết được dưới dạng phân số nào sau đây?',
    options: [
      { key: 'A', text: '$\\frac{a}{b}$ với $a, b \\in \\mathbb{Z},\\ b \\ne 0$' },
      { key: 'B', text: '$\\frac{a}{b}$ với $a, b \\in \\mathbb{N}$' },
      { key: 'C', text: '$\\frac{a}{b}$ với $a \\in \\mathbb{Z},\\ b = 0$' },
      { key: 'D', text: '$\\frac{a}{b}$ với $a, b$ là các số thực tùy ý' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Theo định nghĩa SGK Toán 7: Số hữu tỉ là số viết được dưới dạng phân số $\\frac{a}{b}$ với $a, b \\in \\mathbb{Z}, b \\ne 0$.',
    learningObjective: 'Nhận biết định nghĩa số hữu tỉ và điều kiện mẫu số khác 0.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Tập hợp các số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'ký hiệu tập hợp', 'thuộc'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Tập hợp các số hữu tỉ được ký hiệu là:',
    options: [
      { key: 'A', text: '$\\mathbb{Q}$' },
      { key: 'B', text: '$\\mathbb{Z}$' },
      { key: 'C', text: '$\\mathbb{N}$' },
      { key: 'D', text: '$\\mathbb{R}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Tập hợp các số tự nhiên là $\\mathbb{N}$, số nguyên là $\\mathbb{Z}$, số hữu tỉ là $\\mathbb{Q}$.',
    learningObjective: 'Nhận biết ký hiệu tập hợp các số hữu tỉ $\\mathbb{Q}$.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Tập hợp các số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'số đối', 'nhận biết'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số đối của số hữu tỉ $-\\frac{4}{9}$ là:',
    options: [
      { key: 'A', text: '$\\frac{4}{9}$' },
      { key: 'B', text: '$-\\frac{9}{4}$' },
      { key: 'C', text: '$\\frac{9}{4}$' },
      { key: 'D', text: '$-\\frac{4}{9}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số đối của số hữu tỉ $x$ là $-x$. Do đó số đối của $-\\frac{4}{9}$ là $-\\left(-\\frac{4}{9}\\right) = \\frac{4}{9}$.',
    learningObjective: 'Nhận biết và tìm số đối của một số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Tập hợp các số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'số đối', 'hỗn số'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số đối của số hữu tỉ $1\\frac{2}{3}$ là:',
    options: [
      { key: 'A', text: '$-1\\frac{2}{3}$' },
      { key: 'B', text: '$1\\frac{3}{2}$' },
      { key: 'C', text: '$\\frac{5}{3}$' },
      { key: 'D', text: '$-\\frac{3}{5}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số đối của $1\\frac{2}{3}$ là $-1\\frac{2}{3}$ (tương đương $-\\frac{5}{3}$).',
    learningObjective: 'Nhận biết số đối của một hỗn số dương.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Lũy thừa của một số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'lũy thừa', 'công thức nhân'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Với $x \\in \\mathbb{Q}$ và $m, n \\in \\mathbb{N}$, công thức nhân hai lũy thừa cùng cơ số là:',
    options: [
      { key: 'A', text: '$x^m \\cdot x^n = x^{m + n}$' },
      { key: 'B', text: '$x^m \\cdot x^n = x^{m \\cdot n}$' },
      { key: 'C', text: '$x^m \\cdot x^n = x^{m - n}$' },
      { key: 'D', text: '$x^m \\cdot x^n = (2x)^{m + n}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Khi nhân hai lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ: $x^m \\cdot x^n = x^{m + n}$.',
    learningObjective: 'Nhận biết quy tắc nhân hai lũy thừa cùng cơ số trong tập hợp số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Quy tắc dấu ngoặc và quy tắc chuyển vế',
    topicKeywords: ['số hữu tỉ', 'quy tắc chuyển vế', 'dấu ngoặc'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức trong tập hợp $\\mathbb{Q}$, ta phải:',
    options: [
      { key: 'A', text: 'Đổi dấu số hạng đó' },
      { key: 'B', text: 'Giữ nguyên dấu số hạng đó' },
      { key: 'C', text: 'Nghịch đảo số hạng đó' },
      { key: 'D', text: 'Nhân số hạng đó với $-1$ ở cả hai vế' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Quy tắc chuyển vế: Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó ($+$ thành $-$ và $-$ thành $+$).',
    learningObjective: 'Nhận biết quy tắc chuyển vế trong tập hợp số hữu tỉ.',
  },

  // --- THÔNG HIỂU (MCQ) ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'phép cộng', 'phép tính'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Kết quả của phép tính $\\frac{-3}{8} + \\frac{5}{8}$ bằng:',
    options: [
      { key: 'A', text: '$\\frac{1}{4}$' },
      { key: 'B', text: '$-\\frac{1}{4}$' },
      { key: 'C', text: '$\\frac{2}{16}$' },
      { key: 'D', text: '$1$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\frac{-3}{8} + \\frac{5}{8} = \\frac{-3 + 5}{8} = \\frac{2}{8} = \\frac{1}{4}$.',
    learningObjective: 'Thực hiện phép cộng hai số hữu tỉ cùng mẫu số.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'phép trừ', 'khác mẫu'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Kết quả của phép tính $\\frac{1}{2} - \\frac{2}{3}$ bằng:',
    options: [
      { key: 'A', text: '$-\\frac{1}{6}$' },
      { key: 'B', text: '$\\frac{1}{6}$' },
      { key: 'C', text: '$-\\frac{1}{5}$' },
      { key: 'D', text: '$-\\frac{1}{2}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Quy đồng mẫu số: $\\frac{1}{2} - \\frac{2}{3} = \\frac{3}{6} - \\frac{4}{6} = -\\frac{1}{6}$.',
    learningObjective: 'Thực hiện phép trừ hai số hữu tỉ khác mẫu số.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'phép nhân', 'rút gọn'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Kết quả của phép nhân $\\frac{-5}{7} \\cdot \\frac{14}{15}$ bằng:',
    options: [
      { key: 'A', text: '$-\\frac{2}{3}$' },
      { key: 'B', text: '$\\frac{2}{3}$' },
      { key: 'C', text: '$-\\frac{10}{21}$' },
      { key: 'D', text: '$-\\frac{70}{105}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\frac{-5}{7} \\cdot \\frac{14}{15} = \\frac{(-5) \\cdot 14}{7 \\cdot 15} = \\frac{(-1) \\cdot 2}{1 \\cdot 3} = -\\frac{2}{3}$.',
    learningObjective: 'Thực hiện phép nhân hai số hữu tỉ và rút gọn về phân số tối giản.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'phép chia', 'nghịch đảo'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Kết quả của phép chia $\\frac{-4}{5} : \\frac{8}{15}$ bằng:',
    options: [
      { key: 'A', text: '$-\\frac{3}{2}$' },
      { key: 'B', text: '$\\frac{3}{2}$' },
      { key: 'C', text: '$-\\frac{32}{75}$' },
      { key: 'D', text: '$-\\frac{2}{3}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\frac{-4}{5} : \\frac{8}{15} = \\frac{-4}{5} \\cdot \\frac{15}{8} = \\frac{(-4) \\cdot 15}{5 \\cdot 8} = \\frac{(-1) \\cdot 3}{1 \\cdot 2} = -\\frac{3}{2}$.',
    learningObjective: 'Thực hiện phép chia số hữu tỉ bằng cách nhân với số nghịch đảo.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Lũy thừa của một số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'lũy thừa', 'tính giá trị'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Giá trị của lũy thừa $\\left(-\\frac{2}{3}\\right)^3$ bằng:',
    options: [
      { key: 'A', text: '$-\\frac{8}{27}$' },
      { key: 'B', text: '$\\frac{8}{27}$' },
      { key: 'C', text: '$-\\frac{6}{9}$' },
      { key: 'D', text: '$\\frac{6}{9}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\left(-\\frac{2}{3}\\right)^3 = \\frac{(-2)^3}{3^3} = \\frac{-8}{27} = -\\frac{8}{27}$.',
    learningObjective: 'Tính toán giá trị lũy thừa bậc lẻ của một số hữu tỉ âm.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Quy tắc dấu ngoặc và quy tắc chuyển vế',
    topicKeywords: ['số hữu tỉ', 'tìm x', 'chuyển vế'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm $x$, biết: $x - \\frac{1}{4} = \\frac{1}{2}$. Giá trị của $x$ là:',
    options: [
      { key: 'A', text: '$\\frac{3}{4}$' },
      { key: 'B', text: '$\\frac{1}{4}$' },
      { key: 'C', text: '$-\\frac{1}{4}$' },
      { key: 'D', text: '$\\frac{1}{8}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Áp dụng quy tắc chuyển vế: $x = \\frac{1}{2} + \\frac{1}{4} = \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.',
    learningObjective: 'Áp dụng quy tắc chuyển vế để giải bài toán tìm $x$ trong tập hợp số hữu tỉ.',
  },

  // --- VẬN DỤNG (MCQ) ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'tính hợp lý', 'phân phối'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Tính nhanh giá trị biểu thức $A = \\frac{5}{11} \\cdot \\frac{7}{13} + \\frac{5}{11} \\cdot \\frac{6}{13}$:',
    options: [
      { key: 'A', text: '$\\frac{5}{11}$' },
      { key: 'B', text: '$1$' },
      { key: 'C', text: '$\\frac{65}{143}$' },
      { key: 'D', text: '$\\frac{13}{11}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Đặt $\\frac{5}{11}$ làm thừa số chung: $A = \\frac{5}{11} \\cdot \\left(\\frac{7}{13} + \\frac{6}{13}\\right) = \\frac{5}{11} \\cdot \\frac{13}{13} = \\frac{5}{11} \\cdot 1 = \\frac{5}{11}$.',
    learningObjective: 'Vận dụng tính chất phân phối của phép nhân đối với phép cộng để tính hợp lý.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Lũy thừa của một số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'tìm số mũ', 'lũy thừa'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Tìm số tự nhiên $n$ biết: $\\left(\\frac{1}{2}\\right)^n = \\frac{1}{32}$. Giá trị của $n$ là:',
    options: [
      { key: 'A', text: '$5$' },
      { key: 'B', text: '$4$' },
      { key: 'C', text: '$6$' },
      { key: 'D', text: '$16$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Ta có $\\frac{1}{32} = \\left(\\frac{1}{2}\\right)^5$. Do đó $\\left(\\frac{1}{2}\\right)^n = \\left(\\frac{1}{2}\\right)^5 \\Rightarrow n = 5$.',
    learningObjective: 'Vận dụng định nghĩa và tính chất lũy thừa để tìm số mũ chưa biết.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'toán thực tế', 'nhiệt độ'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'vanDung',
    prompt: 'Nhiệt độ tại Sa Pa lúc 6 giờ sáng là $-1{,}5^\\circ\\text{C}$. Đến 12 giờ trưa, nhiệt độ tăng thêm $4{,}8^\\circ\\text{C}$. Nhiệt độ tại Sa Pa lúc 12 giờ trưa là:',
    options: [
      { key: 'A', text: '$3{,}3^\\circ\\text{C}$' },
      { key: 'B', text: '$-6{,}3^\\circ\\text{C}$' },
      { key: 'C', text: '$6{,}3^\\circ\\text{C}$' },
      { key: 'D', text: '$-3{,}3^\\circ\\text{C}$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Nhiệt độ lúc 12 giờ trưa là: $-1{,}5 + 4{,}8 = 3{,}3^\\circ\\text{C}$.',
    learningObjective: 'Giải quyết vấn đề thực tiễn gắn với phép cộng số hữu tỉ.',
  },

  // --- PHẦN 2: ĐÚNG / SAI ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Tập hợp các số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'đúng sai', 'khái niệm số hữu tỉ'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Xét tính Đúng/Sai của các khẳng định sau về tập hợp các số hữu tỉ $\\mathbb{Q}$:',
    tfStatements: [
      { subKey: 'a', text: 'Số nguyên $0$ vừa là số hữu tỉ dương vừa là số hữu tỉ âm.', isCorrect: false, explanation: 'Sai vì số 0 là số hữu tỉ nhưng không là số hữu tỉ dương và cũng không là số hữu tỉ âm.' },
      { subKey: 'b', text: 'Mọi số nguyên đều là số hữu tỉ.', isCorrect: true, explanation: 'Đúng vì mọi số nguyên $a$ đều viết được dưới dạng $\\frac{a}{1}$. Do đó $\\mathbb{Z} \\subset \\mathbb{Q}$.' },
      { subKey: 'c', text: 'Phân số $-\\frac{3}{5}$ và phân số $\\frac{3}{-5}$ biểu diễn cùng một số hữu tỉ.', isCorrect: true, explanation: 'Đúng vì $-\\frac{3}{5} = \\frac{3}{-5} = -0{,}6$.' },
      { subKey: 'd', text: 'Số đối của số hữu tỉ $0$ là chính nó.', isCorrect: true, explanation: 'Đúng vì $-0 = 0$.' },
    ],
    solutionExplanation: 'Nắm vững bản chất của tập hợp số hữu tỉ $\\mathbb{Q}$, mối quan hệ giữa $\\mathbb{Z}$ và $\\mathbb{Q}$, và tính chất của số 0.',
    learningObjective: 'Phân biệt đúng sai các tính chất cơ bản của tập hợp số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Lũy thừa của một số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'đúng sai', 'quy tắc lũy thừa'],
    section: 'part2_true_false',
    type: 'true_false',
    cognitiveLevel: 'thongHieu',
    prompt: 'Cho các biểu thức lũy thừa trong tập số hữu tỉ. Xét tính Đúng/Sai của các khẳng định sau:',
    tfStatements: [
      { subKey: 'a', text: '$\\left(-\\frac{1}{3}\\right)^2 = \\frac{1}{9}$.', isCorrect: true, explanation: 'Đúng vì bình phương của số âm là một số dương: $\\frac{(-1)^2}{3^2} = \\frac{1}{9}$.' },
      { subKey: 'b', text: '$\\left(-\\frac{1}{2}\\right)^3 = \\frac{1}{8}$.', isCorrect: false, explanation: 'Sai vì lũy thừa bậc lẻ của số âm là số âm: $(-1/2)^3 = -1/8$.' },
      { subKey: 'c', text: 'Với mọi $x \\in \\mathbb{Q}, x \\ne 0$, ta luôn có $x^0 = 1$.', isCorrect: true, explanation: 'Đúng theo quy ước định nghĩa lũy thừa với số mũ 0.' },
      { subKey: 'd', text: '$\\left[\\left(\\frac{2}{3}\\right)^2\\right]^3 = \\left(\\frac{2}{3}\\right)^5$.', isCorrect: false, explanation: 'Sai vì lũy thừa của lũy thừa là nhân số mũ: $(a^m)^n = a^{m \\cdot n} = (2/3)^6$, không phải cộng số mũ.' },
    ],
    solutionExplanation: 'Vận dụng đúng các quy tắc lũy thừa: lũy thừa chẵn, lẻ của số âm, lũy thừa số mũ 0 và lũy thừa của lũy thừa.',
    learningObjective: 'Hiểu sâu và phát hiện lỗi sai trong các phép biến đổi lũy thừa số hữu tỉ.',
  },

  // --- PHẦN 3: TRẢ LỜI NGẮN ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'trả lời ngắn', 'tính giá trị'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tính giá trị của biểu thức $M = \\frac{3}{4} + \\frac{1}{4} : \\frac{1}{2}$. Điền kết quả dưới dạng số thập phân:',
    shortAnswerText: '1.25',
    solutionExplanation: 'Thực hiện phép chia trước: $\\frac{1}{4} : \\frac{1}{2} = \\frac{1}{4} \\cdot 2 = \\frac{1}{2} = 0{,}5$. Sau đó thực hiện phép cộng: $\\frac{3}{4} + \\frac{1}{2} = 0{,}75 + 0{,}5 = 1{,}25$.',
    learningObjective: 'Thực hiện đúng thứ tự các phép tính trong tập hợp số hữu tỉ.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Quy tắc dấu ngoặc và quy tắc chuyển vế',
    topicKeywords: ['số hữu tỉ', 'trả lời ngắn', 'tìm x'],
    section: 'part3_short_answer',
    type: 'short_answer',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm giá trị của $x$ thỏa mãn: $2x - \\frac{1}{2} = \\frac{7}{2}$. Điền đáp số:',
    shortAnswerText: '2',
    solutionExplanation: '$2x = \\frac{7}{2} + \\frac{1}{2} = \\frac{8}{2} = 4 \\Rightarrow x = 4 : 2 = 2$.',
    learningObjective: 'Tìm ẩn $x$ qua hai bước biến đổi trong tập hợp số hữu tỉ.',
  },

  // --- PHẦN 4: TỰ LUẬN ---
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Cộng, trừ, nhân, chia số hữu tỉ',
    topicKeywords: ['số hữu tỉ', 'tự luận', 'tính hợp lý'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: 'Thực hiện phép tính một cách hợp lí: $B = \\frac{3}{7} \\cdot \\left(-\\frac{1}{9}\\right) + \\frac{3}{7} \\cdot \\left(-\\frac{8}{9}\\right)$.',
    essayGradingSteps: [
      { step: 'Nhận xét hai tích có thừa số chung là $\\frac{3}{7}$. Áp dụng tính chất phân phối: $B = \\frac{3}{7} \\cdot \\left[\\left(-\\frac{1}{9}\\right) + \\left(-\\frac{8}{9}\\right)\\right]$.', point: 0.5 },
      { step: 'Tính trong ngoặc vuông: $\\left(-\\frac{1}{9}\\right) + \\left(-\\frac{8}{9}\\right) = \\frac{-1 + (-8)}{9} = \\frac{-9}{9} = -1$.', point: 0.5 },
      { step: 'Thực hiện phép nhân: $B = \\frac{3}{7} \\cdot (-1) = -\\frac{3}{7}$. Kết luận.', point: 0.5 },
    ],
    solutionExplanation: 'Dùng tính chất phân phối $a \\cdot b + a \\cdot c = a \\cdot (b + c)$ để đưa về phép nhân với $-1$.',
    learningObjective: 'Trình bày bài toán tính giá trị biểu thức hợp lý bằng tính chất phân phối.',
  },
  {
    subject: 'Toán',
    grade: '7',
    chapter: 'Chương I: Số hữu tỉ',
    lesson: 'Quy tắc dấu ngoặc và quy tắc chuyển vế',
    topicKeywords: ['số hữu tỉ', 'tự luận', 'tìm x'],
    section: 'part4_essay',
    type: 'essay',
    cognitiveLevel: 'thongHieu',
    prompt: 'Tìm số hữu tỉ $x$, biết: $\\frac{2}{3} + \\frac{1}{3}x = \\frac{5}{6}$.',
    essayGradingSteps: [
      { step: 'Chuyển vế số hạng $\\frac{2}{3}$ sang vế phải: $\\frac{1}{3}x = \\frac{5}{6} - \\frac{2}{3}$.', point: 0.5 },
      { step: 'Quy đồng mẫu số và trừ: $\\frac{1}{3}x = \\frac{5}{6} - \\frac{4}{6} \\Leftrightarrow \\frac{1}{3}x = \\frac{1}{6}$.', point: 0.5 },
      { step: 'Tìm $x$: $x = \\frac{1}{6} : \\frac{1}{3} = \\frac{1}{6} \\cdot 3 = \\frac{1}{2}$. Kết luận vậy $x = \\frac{1}{2}$.', point: 0.5 },
    ],
    solutionExplanation: 'Áp dụng quy tắc chuyển vế đổi dấu và quy tắc tìm thừa số chưa biết.',
    learningObjective: 'Trình bày lời giải bài toán tìm $x$ trong số hữu tỉ rõ ràng, đủ bước.',
  },
];

// ----------------------------------------------------------------------------
// 3. KHỐI 9 - CHƯƠNG III: CĂN BẬC HAI VÀ CĂN BẬC BA
// ----------------------------------------------------------------------------
export const GRADE_9_CAN_THUC_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương III: Căn bậc hai và căn bậc ba',
    lesson: 'Căn bậc hai số học',
    topicKeywords: ['căn bậc hai', 'căn thức', 'số học'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Căn bậc hai số học của $25$ là:',
    options: [
      { key: 'A', text: '$5$' },
      { key: 'B', text: '$-5$' },
      { key: 'C', text: '$\\pm 5$' },
      { key: 'D', text: '$625$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Với số dương $a$, căn bậc hai số học của $a$ là $\\sqrt{a} > 0$. Do đó $\\sqrt{25} = 5$.',
    learningObjective: 'Nhận biết khái niệm căn bậc hai số học của một số không âm.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương III: Căn bậc hai và căn bậc ba',
    lesson: 'Căn thức bậc hai và hằng đẳng thức',
    topicKeywords: ['căn thức', 'điều kiện xác định'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Biểu thức $\\sqrt{2x - 6}$ có nghĩa khi và chỉ khi:',
    options: [
      { key: 'A', text: '$x \\ge 3$' },
      { key: 'B', text: '$x > 3$' },
      { key: 'C', text: '$x \\le 3$' },
      { key: 'D', text: '$x \\ge -3$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Biểu thức $\\sqrt{A}$ có nghĩa $\\Leftrightarrow A \\ge 0 \\Leftrightarrow 2x - 6 \\ge 0 \\Leftrightarrow x \\ge 3$.',
    learningObjective: 'Nhận biết điều kiện xác định của căn thức bậc hai.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương III: Căn bậc hai và căn bậc ba',
    lesson: 'Căn thức bậc hai và hằng đẳng thức',
    topicKeywords: ['căn bậc hai', 'hằng đẳng thức', 'giá trị tuyệt đối'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Giá trị của biểu thức $\\sqrt{(\\sqrt{3} - 2)^2}$ bằng:',
    options: [
      { key: 'A', text: '$2 - \\sqrt{3}$' },
      { key: 'B', text: '$\\sqrt{3} - 2$' },
      { key: 'C', text: '$1$' },
      { key: 'D', text: '$-1$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\sqrt{(\\sqrt{3} - 2)^2} = |\\sqrt{3} - 2|$. Vì $\\sqrt{3} < \\sqrt{4} = 2$ nên $\\sqrt{3} - 2 < 0 \\Rightarrow |\\sqrt{3} - 2| = 2 - \\sqrt{3}$.',
    learningObjective: 'Thông hiểu hằng đẳng thức $\\sqrt{A^2} = |A|$.',
  },
  {
    subject: 'Toán',
    grade: '9',
    chapter: 'Chương III: Căn bậc hai và căn bậc ba',
    lesson: 'Rút gọn biểu thức chứa căn thức',
    topicKeywords: ['căn bậc hai', 'rút gọn', 'khai phương'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Rút gọn biểu thức $M = \\sqrt{12} - \\sqrt{27} + \\sqrt{48}$ ta được:',
    options: [
      { key: 'A', text: '$3\\sqrt{3}$' },
      { key: 'B', text: '$5\\sqrt{3}$' },
      { key: 'C', text: '$\\sqrt{3}$' },
      { key: 'D', text: '$4\\sqrt{3}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$M = 2\\sqrt{3} - 3\\sqrt{3} + 4\\sqrt{3} = (2 - 3 + 4)\\sqrt{3} = 3\\sqrt{3}$.',
    learningObjective: 'Thông hiểu việc đưa thừa số ra ngoài dấu căn và rút gọn căn thức đồng dạng.',
  },
];

// ----------------------------------------------------------------------------
// 4. KHỐI 8 - CHƯƠNG I & II: ĐA THỨC VÀ HẰNG ĐẲNG THỨC
// ----------------------------------------------------------------------------
export const GRADE_8_DA_THUC_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '8',
    chapter: 'Chương I: Đa thức nhiều biến',
    lesson: 'Đơn thức và đa thức nhiều biến',
    topicKeywords: ['đa thức', 'đơn thức', 'bậc'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Bậc của đơn thức $4x^2y^3z$ bằng:',
    options: [
      { key: 'A', text: '$6$' },
      { key: 'B', text: '$5$' },
      { key: 'C', text: '$4$' },
      { key: 'D', text: '$2$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Bậc của đơn thức có hệ số khác 0 là tổng số mũ của các biến: $2 + 3 + 1 = 6$.',
    learningObjective: 'Nhận biết bậc của một đơn thức nhiều biến thu gọn.',
  },
  {
    subject: 'Toán',
    grade: '8',
    chapter: 'Chương II: Hằng đẳng thức đáng nhớ',
    lesson: 'Hiệu hai bình phương',
    topicKeywords: ['hằng đẳng thức', 'hiệu hai bình phương'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Khai triển của hằng đẳng thức $x^2 - 9$ là:',
    options: [
      { key: 'A', text: '$(x - 3)(x + 3)$' },
      { key: 'B', text: '$(x - 3)^2$' },
      { key: 'C', text: '$(x + 3)^2$' },
      { key: 'D', text: '$x(x - 9)$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$x^2 - 9 = x^2 - 3^2 = (x - 3)(x + 3)$.',
    learningObjective: 'Nhận biết hằng đẳng thức hiệu hai bình phương $A^2 - B^2 = (A - B)(A + B)$.',
  },
  {
    subject: 'Toán',
    grade: '8',
    chapter: 'Chương II: Hằng đẳng thức đáng nhớ',
    lesson: 'Bình phương của một tổng',
    topicKeywords: ['hằng đẳng thức', 'bình phương một tổng'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'thongHieu',
    prompt: 'Khai triển $(2x + 1)^2$ ta được kết quả:',
    options: [
      { key: 'A', text: '$4x^2 + 4x + 1$' },
      { key: 'B', text: '$4x^2 + 1$' },
      { key: 'C', text: '$2x^2 + 4x + 1$' },
      { key: 'D', text: '$4x^2 + 2x + 1$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$(2x + 1)^2 = (2x)^2 + 2(2x)(1) + 1^2 = 4x^2 + 4x + 1$.',
    learningObjective: 'Thông hiểu việc khai triển bình phương của một tổng $(A + B)^2$.',
  },
];

// ----------------------------------------------------------------------------
// 5. KHỐI 6 - CHƯƠNG I: TẬP HỢP CÁC SỐ TỰ NHIÊN
// ----------------------------------------------------------------------------
export const GRADE_6_SO_TU_NHIEN_QUESTIONS: BankQuestionTemplate[] = [
  {
    subject: 'Toán',
    grade: '6',
    chapter: 'Chương I: Tập hợp các số tự nhiên',
    lesson: 'Tập hợp các số tự nhiên',
    topicKeywords: ['số tự nhiên', 'tập hợp N', 'nhận biết'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Tập hợp $\\mathbb{N}^*$ gồm các phần tử nào sau đây?',
    options: [
      { key: 'A', text: '$\\{1; 2; 3; 4; \\dots\\}$' },
      { key: 'B', text: '$\\{0; 1; 2; 3; 4; \\dots\\}$' },
      { key: 'C', text: '$\\{0; 2; 4; 6; \\dots\\}$' },
      { key: 'D', text: '$\\{1; 3; 5; 7; \\dots\\}$' },
    ],
    correctOption: 'A',
    solutionExplanation: '$\\mathbb{N}^*$ là tập hợp các số tự nhiên khác 0: $\\mathbb{N}^* = \\{1; 2; 3; \\dots\\}$.',
    learningObjective: 'Nhận biết tập hợp các số tự nhiên khác 0.',
  },
  {
    subject: 'Toán',
    grade: '6',
    chapter: 'Chương I: Tập hợp các số tự nhiên',
    lesson: 'Dấu hiệu chia hết',
    topicKeywords: ['số tự nhiên', 'chia hết cho 5'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số nào sau đây chia hết cho cả $2$ và $5$?',
    options: [
      { key: 'A', text: '$130$' },
      { key: 'B', text: '$125$' },
      { key: 'C', text: '$132$' },
      { key: 'D', text: '$134$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số có chữ số tận cùng là $0$ thì chia hết cho cả $2$ và $5$. Do đó $130$ chia hết cho $2$ và $5$.',
    learningObjective: 'Nhận biết dấu hiệu chia hết cho cả 2 và 5.',
  },
  {
    subject: 'Toán',
    grade: '6',
    chapter: 'Chương I: Tập hợp các số tự nhiên',
    lesson: 'Số nguyên tố',
    topicKeywords: ['số tự nhiên', 'số nguyên tố'],
    section: 'part1_mcq',
    type: 'multiple_choice',
    cognitiveLevel: 'nhanBiet',
    prompt: 'Số nguyên tố chẵn duy nhất là:',
    options: [
      { key: 'A', text: '$2$' },
      { key: 'B', text: '$0$' },
      { key: 'C', text: '$4$' },
      { key: 'D', text: '$6$' },
    ],
    correctOption: 'A',
    solutionExplanation: 'Số $2$ là số nguyên tố chẵn duy nhất. Mọi số chẵn lớn hơn 2 đều chia hết cho 2 nên là hợp số.',
    learningObjective: 'Nhận biết số nguyên tố chẵn duy nhất.',
  },
];

// ============================================================================
// HỆ THỐNG TRUY VẤN VÀ KHỚP CHỦ ĐỀ CHUẨN XÁC THEO PPCT & SGK
// ============================================================================

export type TopicClusterId =
  | 'he_phuong_trinh'
  | 'can_thuc'
  | 'so_huu_ti'
  | 'so_thuc'
  | 'da_thuc_8'
  | 'so_tu_nhien_6'
  | 'so_nguyen_6'
  | 'other';

/**
 * Nhận diện chính xác cụm chủ đề chương trình học theo văn bản bài học/chương và khối lớp
 */
export function detectCurriculumTopicCluster(text: string, grade: string): TopicClusterId {
  if (!text) return 'other';
  const t = text.toLowerCase();
  const normG = String(grade || '').replace(/\D/g, '') || '9';

  // Khối 9
  if (normG === '9') {
    if (
      t.includes('hệ phương trình') ||
      t.includes('hệ hai phương trình') ||
      t.includes('phương trình bậc nhất hai ẩn') ||
      t.includes('bậc nhất hai ẩn') ||
      t.includes('cộng đại số') ||
      t.includes('phương pháp thế') ||
      t.includes('toán bằng cách lập hệ phương trình')
    ) {
      return 'he_phuong_trinh';
    }
    if (
      t.includes('căn bậc hai') ||
      t.includes('căn thức') ||
      t.includes('căn bậc ba') ||
      t.includes('khai phương')
    ) {
      return 'can_thuc';
    }
  }

  // Khối 7
  if (normG === '7') {
    if (
      t.includes('số hữu tỉ') ||
      t.includes('số hữu tỷ') ||
      t.includes('hữu tỉ') ||
      t.includes('tập hợp q') ||
      t.includes('cộng, trừ, nhân, chia số hữu tỉ') ||
      t.includes('lũy thừa của một số hữu tỉ') ||
      t.includes('quy tắc chuyển vế')
    ) {
      return 'so_huu_ti';
    }
    if (
      t.includes('số thực') ||
      t.includes('số vô tỉ') ||
      t.includes('căn bậc hai số học') ||
      t.includes('giá trị tuyệt đối')
    ) {
      return 'so_thuc';
    }
  }

  // Khối 8
  if (normG === '8') {
    if (
      t.includes('đơn thức') ||
      t.includes('đa thức') ||
      t.includes('hằng đẳng thức') ||
      t.includes('nhân tử')
    ) {
      return 'da_thuc_8';
    }
  }

  // Khối 6
  if (normG === '6') {
    if (
      t.includes('số tự nhiên') ||
      t.includes('chia hết') ||
      t.includes('số nguyên tố') ||
      t.includes('ước chung') ||
      t.includes('bội chung')
    ) {
      return 'so_tu_nhien_6';
    }
    if (t.includes('số nguyên') || t.includes('tập hợp z')) {
      return 'so_nguyen_6';
    }
  }

  return 'other';
}

/**
 * Lấy danh sách toàn bộ câu hỏi chuẩn SGK theo đúng chủ đề cụ thể
 */
export function getCurriculumQuestionsForTopic(
  grade: string,
  topic: string,
  chapter?: string
): BankQuestionTemplate[] {
  const combined = `${topic} ${chapter || ''}`;
  const cluster = detectCurriculumTopicCluster(combined, grade);

  if (cluster === 'he_phuong_trinh') {
    return GRADE_9_HE_PHUONG_TRINH_QUESTIONS;
  }
  if (cluster === 'so_huu_ti') {
    return GRADE_7_SO_HUU_TI_QUESTIONS;
  }
  if (cluster === 'can_thuc') {
    return GRADE_9_CAN_THUC_QUESTIONS;
  }
  if (cluster === 'da_thuc_8') {
    return GRADE_8_DA_THUC_QUESTIONS;
  }
  if (cluster === 'so_tu_nhien_6') {
    return GRADE_6_SO_TU_NHIEN_QUESTIONS;
  }

  return [];
}

