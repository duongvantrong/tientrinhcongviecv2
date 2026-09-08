import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Layers,
  FileImage,
  RefreshCw,
} from 'lucide-react';
import { TeacherTimetableConfig, TimetableSlot } from '../../types';
import { getDefaultTeacherTimetable } from '../../utils/timetableScheduler';

interface TimetableUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: TeacherTimetableConfig;
  onSaveConfig: (config: TeacherTimetableConfig) => void;
}

export const TimetableUploadModal: React.FC<TimetableUploadModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for editable config
  const [teacherName, setTeacherName] = useState<string>(currentConfig.teacherName || 'Dương Văn Trong');
  const [schoolName, setSchoolName] = useState<string>(currentConfig.schoolName || 'TRƯỜNG THCS VÀ THPT PHÚ THÀNH');
  const [appliedDate, setAppliedDate] = useState<string>(currentConfig.appliedDate || '2026-09-07');
  const [slots, setSlots] = useState<TimetableSlot[]>(() => {
    return currentConfig.slots && currentConfig.slots.length > 0
      ? currentConfig.slots
      : getDefaultTeacherTimetable().slots;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn file hình ảnh (.jpg, .png, .webp)');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Call AI OCR endpoint on server
  const handleAnalyzeWithAI = async () => {
    if (!selectedImage) {
      setErrorMsg('Vui lòng chọn hoặc chụp ảnh Thời khóa biểu trước.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/parse-tkb-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          teacherName,
          schoolName,
        }),
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.slots) && data.slots.length > 0) {
        setSlots(data.slots);
        if (data.teacherName) setTeacherName(data.teacherName);
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.appliedDate) setAppliedDate(data.appliedDate);
        setSuccessMsg(data.summary || `Đã trích xuất thành công ${data.slots.length} tiết dạy từ ảnh TKB!`);
      } else {
        // Trích xuất chưa đạt hoặc chưa cấu hình API key -> cung cấp hướng dẫn rõ ràng
        setErrorMsg(
          data.message ||
            'Không đọc được các tiết dạy từ ảnh. Thầy/Cô có thể dùng TKB mẫu Khối 7 & 9 hoặc chỉnh sửa trực tiếp bên dưới.'
        );
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ phân tích ảnh: ' + (err?.message || 'Thử lại sau.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Nạp nhanh TKB mẫu Toán 7 & 9 (8 tiết/tuần)
  const handleLoadDefaultPreset = () => {
    const def = getDefaultTeacherTimetable();
    setSlots(def.slots);
    setTeacherName(def.teacherName);
    setSchoolName(def.schoolName);
    setAppliedDate(def.appliedDate);
    setSuccessMsg('Đã nạp Thời khóa biểu mẫu chuẩn Toán Khối 7 & Khối 9 (8 tiết/tuần, áp dụng từ 07/09/2026).');
    setErrorMsg(null);
  };

  // Thêm 1 tiết dạy thủ công
  const handleAddSlot = () => {
    const newSlot: TimetableSlot = {
      id: `slot-manual-${Date.now()}`,
      dayOfWeek: 2,
      period: 1,
      session: 'sang',
      className: '9A1',
      grade: '9',
      subject: 'Toán',
      room: 'Phòng 9A1',
    };
    setSlots((prev) => [...prev, newSlot]);
  };

  // Cập nhật 1 slot
  const handleUpdateSlot = (id: string, updates: Partial<TimetableSlot>) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        // Tự động nhận diện Khối từ tên lớp nếu đổi className
        if (updates.className) {
          const num = updates.className.replace(/\D/g, '');
          if (num.startsWith('6') || num.startsWith('7') || num.startsWith('8') || num.startsWith('9')) {
            updated.grade = num[0];
          }
        }
        return updated;
      })
    );
  };

  // Xóa 1 slot
  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Lưu toàn bộ cấu hình TKB
  const handleSave = () => {
    if (slots.length === 0) {
      setErrorMsg('Vui lòng thêm ít nhất 1 tiết dạy trong thời khóa biểu.');
      return;
    }

    const updatedConfig: TeacherTimetableConfig = {
      ...currentConfig,
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      appliedDate: appliedDate || '2026-09-07',
      appliedWeek: 1,
      slots,
      lastPhotoUploadedAt: selectedImage ? new Date().toISOString() : currentConfig.lastPhotoUploadedAt,
      lastPhotoName: imageFileName || currentConfig.lastPhotoName,
      sourceImageBase64: selectedImage || currentConfig.sourceImageBase64,
    };

    onSaveConfig(updatedConfig);
    onClose();
  };

  const dayLabels: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-850 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Chụp ảnh / Tải lên Thời khóa biểu môn Toán</h2>
              <p className="text-xs text-emerald-100">
                Nhận diện tự động TKB & Trực tiếp xếp nội dung bài học PPCT vào từng buổi dạy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Section 1: Upload Photo / Take Camera */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Tải ảnh hoặc Chụp ảnh Thời khóa biểu (TKB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleLoadDefaultPreset}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200 px-3 py-1 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nạp TKB mẫu Toán 7 & 9
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Upload Dropzone */}
              <div className="md:col-span-8">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 group-hover:scale-110 flex items-center justify-center transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Nhấn để tải lên ảnh TKB từ máy tính hoặc điện thoại
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hỗ trợ ảnh chụp JPG, PNG, WEBP, ảnh bảng phân công chuyên môn hoặc TKB tuần
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      Chụp trực tiếp bằng camera
                    </button>
                    <span className="text-xs text-slate-400">hoặc kéo thả ảnh vào đây</span>
                  </div>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="md:col-span-4 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-3 min-h-[140px]">
                {selectedImage ? (
                  <div className="w-full space-y-2 text-center">
                    <div className="relative max-h-28 overflow-hidden rounded-lg border border-slate-200 mx-auto">
                      <img
                        src={selectedImage}
                        alt="TKB Preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 truncate max-w-[200px] mx-auto">
                      {imageFileName || 'Ảnh TKB đã chọn'}
                    </p>
                    <button
                      type="button"
                      onClick={handleAnalyzeWithAI}
                      disabled={isProcessing}
                      className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang nhận diện AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Trích xuất TKB bằng AI</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 p-2">
                    <FileImage className="w-8 h-8 mx-auto stroke-1 mb-1 text-slate-300" />
                    <p className="text-xs">Chưa có ảnh nào được chọn</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Section 2: General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Giáo viên phụ trách
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ví dụ: Dương Văn Trong"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Đơn vị trường học
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ví dụ: TRƯỜNG THCS VÀ THPT PHÚ THÀNH"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                Ngày áp dụng TKB Tuần 1
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 3: Slots Verification & Editor */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>2. Danh sách tiết dạy môn Toán trong tuần ({slots.length} tiết)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Hệ thống sẽ dựa vào danh sách này để tự động xếp chính xác từng tiết PPCT theo tiến độ thời gian thực.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm tiết dạy</span>
              </button>
            </div>

            {/* Slots Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3">Thứ trong tuần</th>
                    <th className="py-2.5 px-3 w-28">Tiết dạy</th>
                    <th className="py-2.5 px-3 w-28">Buổi</th>
                    <th className="py-2.5 px-3 w-28">Lớp học</th>
                    <th className="py-2.5 px-3 w-24">Khối</th>
                    <th className="py-2.5 px-3">Phòng học</th>
                    <th className="py-2.5 px-3 w-12 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slots.map((slot, index) => (
                    <tr key={slot.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-2 px-3">
                        <select
                          value={slot.dayOfWeek}
                          onChange={(e) => handleUpdateSlot(slot.id, { dayOfWeek: Number(e.target.value) })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                        >
                          <option value={2}>Thứ Hai</option>
                          <option value={3}>Thứ Ba</option>
                          <option value={4}>Thứ Tư</option>
                          <option value={5}>Thứ Năm</option>
                          <option value={6}>Thứ Sáu</option>
                          <option value={7}>Thứ Bảy</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={slot.period}
                          onChange={(e) => handleUpdateSlot(slot.id, { period: Number(e.target.value) })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                        >
                          <option value={1}>Tiết 1</option>
                          <option value={2}>Tiết 2</option>
                          <option value={3}>Tiết 3</option>
                          <option value={4}>Tiết 4</option>
                          <option value={5}>Tiết 5</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={slot.session || 'sang'}
                          onChange={(e) => handleUpdateSlot(slot.id, { session: e.target.value as 'sang' | 'chieu' })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-700"
                        >
                          <option value="sang">Sáng</option>
                          <option value="chieu">Chiều</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={slot.className}
                          onChange={(e) => handleUpdateSlot(slot.id, { className: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold text-emerald-900"
                          placeholder="e.g. 9A1"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={slot.grade}
                          onChange={(e) => handleUpdateSlot(slot.id, { grade: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                        >
                          <option value="6">Khối 6</option>
                          <option value="7">Khối 7</option>
                          <option value="8">Khối 8</option>
                          <option value="9">Khối 9</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={slot.room || ''}
                          onChange={(e) => handleUpdateSlot(slot.id, { room: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-600"
                          placeholder="P. học"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Xóa tiết này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-emerald-900">{slots.length} tiết/tuần</strong> • Áp dụng tuần 1 từ{' '}
            <strong>{appliedDate}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác nhận & Tự động xếp PPCT vào TKB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
