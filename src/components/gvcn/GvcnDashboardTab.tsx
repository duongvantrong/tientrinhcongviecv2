import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Award,
  CalendarDays,
  FileText,
  HeartHandshake,
  BookOpen,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Printer,
  Sparkles,
  Search,
  ExternalLink,
  Settings,
  FileSpreadsheet,
  UserPlus,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import {
  GvcnClassInfo,
  GvcnClassRule,
  GvcnStudent,
  GvcnWeeklyRecord,
  GvcnSpecialStudent,
  GvcnParentContact,
  GvcnMonthlyTask,
  GvcnLogEntry,
} from '../../types';
import {
  defaultGvcnClassInfo,
  defaultGvcnRules,
  defaultGvcnStudents,
  defaultGvcnWeeklyRecords,
  defaultGvcnSpecialStudents,
  defaultGvcnParentContacts,
  defaultGvcnYearTasks,
} from '../../data/gvcnDefaultData';
import {
  getGradeFromClassInfo,
  getPhuThoYearPlanForGrade,
} from '../../data/gvcnPhuThoPlans';
import { GvcnRulesSection } from './GvcnRulesSection';
import { GvcnWeeklyRecordSection } from './GvcnWeeklyRecordSection';
import { GvcnMeetingSection } from './GvcnMeetingSection';
import { GvcnSpecialStudentsSection } from './GvcnSpecialStudentsSection';
import { GvcnYearPlanSection } from './GvcnYearPlanSection';
import { GvcnStudentGradesSection } from './GvcnStudentGradesSection';
import { GvcnTT22EvaluationSection } from './GvcnTT22EvaluationSection';
import { GvcnStudentListModal } from './GvcnStudentListModal';
import { GvcnQuickLogModal } from './GvcnQuickLogModal';
import { GvcnClassSettingsModal } from './GvcnClassSettingsModal';
import { GvcnStudentProfileModal } from './GvcnStudentProfileModal';
import { GvcnAddStudentModal } from './GvcnAddStudentModal';
import { useAuth } from '../auth/AuthGate';
import { subscribeToGvcnData, syncGvcnDataToCloud } from '../../lib/firebase';

export type GvcnSubTab =
  | 'students_grades'
  | 'tt22'
  | 'records'
  | 'rules'
  | 'meeting'
  | 'special'
  | 'year_plan';

export const GvcnDashboardTab: React.FC = () => {
  // Load persisted data or default
  const [classInfo, setClassInfo] = useState<GvcnClassInfo>(() => {
    const saved = localStorage.getItem('gvcn_class_info');
    return saved ? JSON.parse(saved) : defaultGvcnClassInfo;
  });

  const [rules, setRules] = useState<GvcnClassRule[]>(() => {
    const saved = localStorage.getItem('gvcn_rules');
    return saved ? JSON.parse(saved) : defaultGvcnRules;
  });

  const [students, setStudents] = useState<GvcnStudent[]>(() => {
    const saved = localStorage.getItem('gvcn_students');
    return saved ? JSON.parse(saved) : defaultGvcnStudents;
  });

  const [weeklyRecords, setWeeklyRecords] = useState<GvcnWeeklyRecord[]>(() => {
    const saved = localStorage.getItem('gvcn_weekly_records');
    return saved ? JSON.parse(saved) : defaultGvcnWeeklyRecords;
  });

  const [specialStudents, setSpecialStudents] = useState<GvcnSpecialStudent[]>(() => {
    const saved = localStorage.getItem('gvcn_special_students');
    return saved ? JSON.parse(saved) : defaultGvcnSpecialStudents;
  });

  const [parentContacts, setParentContacts] = useState<GvcnParentContact[]>(() => {
    const saved = localStorage.getItem('gvcn_parent_contacts');
    return saved ? JSON.parse(saved) : defaultGvcnParentContacts;
  });

  const [monthlyTasks, setMonthlyTasks] = useState<GvcnMonthlyTask[]>(() => {
    const saved = localStorage.getItem('gvcn_monthly_tasks');
    return saved ? JSON.parse(saved) : defaultGvcnYearTasks;
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('gvcn_class_info', JSON.stringify(classInfo));
  }, [classInfo]);

  useEffect(() => {
    localStorage.setItem('gvcn_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('gvcn_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('gvcn_weekly_records', JSON.stringify(weeklyRecords));
  }, [weeklyRecords]);

  useEffect(() => {
    localStorage.setItem('gvcn_special_students', JSON.stringify(specialStudents));
  }, [specialStudents]);

  useEffect(() => {
    localStorage.setItem('gvcn_parent_contacts', JSON.stringify(parentContacts));
  }, [parentContacts]);

  useEffect(() => {
    localStorage.setItem('gvcn_monthly_tasks', JSON.stringify(monthlyTasks));
  }, [monthlyTasks]);

  // Active subtab
  const [activeSubTab, setActiveSubTab] = useState<GvcnSubTab>('students_grades');
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // Auth & Cloud Sync
  const { user } = useAuth();
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // Subscribe to real-time Cloud updates across devices using same Gmail
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToGvcnData(
      user.uid,
      (cloudPayload) => {
        if (cloudPayload && Array.isArray(cloudPayload.students) && cloudPayload.students.length > 0) {
          setStudents(cloudPayload.students);
          if (cloudPayload.classInfo) setClassInfo(cloudPayload.classInfo);
          if (cloudPayload.weeklyRecords) setWeeklyRecords(cloudPayload.weeklyRecords);
          if (cloudPayload.rules) setRules(cloudPayload.rules);
          setLastCloudSyncTime(new Date().toLocaleTimeString('vi-VN'));
        }
      },
      (err) => console.warn('Could not sync from cloud:', err)
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Trigger manual or automatic cloud save
  const handleManualCloudSync = async () => {
    if (!user?.uid || !user.email) {
      alert('Vui lòng đăng nhập tài khoản Gmail để đồng bộ đám mây!');
      return;
    }
    setIsCloudSyncing(true);
    try {
      await syncGvcnDataToCloud(user.uid, user.email, {
        classInfo,
        students,
        weeklyRecords,
        rules,
      });
      setLastCloudSyncTime(new Date().toLocaleTimeString('vi-VN'));
    } catch (err: any) {
      console.error('Cloud sync error:', err);
      alert('Lỗi đồng bộ đám mây: ' + (err?.message || 'Kiểm tra kết nối'));
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Modals
  const [showStudentListModal, setShowStudentListModal] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showQuickLogModal, setShowQuickLogModal] = useState<boolean>(false);
  const [showClassSettingsModal, setShowClassSettingsModal] = useState<boolean>(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<GvcnStudent | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Handlers for student 360 profile
  const handleSelectStudent = (student: GvcnStudent) => {
    setSelectedStudentForProfile(student);
    setShowProfileModal(true);
  };

  const handleUpdateStudent = (updatedStudent: GvcnStudent) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updated);
    if (selectedStudentForProfile?.id === updatedStudent.id) {
      setSelectedStudentForProfile(updatedStudent);
    }
    if (user?.uid && user.email) {
      syncGvcnDataToCloud(user.uid, user.email, {
        classInfo,
        students: updated,
        weeklyRecords,
        rules,
      }).catch(console.error);
    }
  };

  const handleUpdateStudents = (updatedList: GvcnStudent[]) => {
    setStudents(updatedList);
    if (user?.uid && user.email) {
      syncGvcnDataToCloud(user.uid, user.email, {
        classInfo,
        students: updatedList,
        weeklyRecords,
        rules,
      }).catch(console.error);
    }
  };

  // Handler to add a specific student individually
  const handleAddStudent = (newStudent: GvcnStudent) => {
    const updatedList = [...students, newStudent].sort((a, b) => (a.stt || 0) - (b.stt || 0));
    setStudents(updatedList);
    if (user?.uid && user.email) {
      syncGvcnDataToCloud(user.uid, user.email, {
        classInfo,
        students: updatedList,
        weeklyRecords,
        rules,
      }).catch(console.error);
    }
  };

  const handleSaveClassInfo = (newInfo: GvcnClassInfo) => {
    const oldGrade = getGradeFromClassInfo(classInfo);
    const newGrade = getGradeFromClassInfo(newInfo);
    setClassInfo(newInfo);

    // If grade changed, automatically update homeroom year plan to match the new grade
    if (newGrade !== oldGrade) {
      const newPlan = getPhuThoYearPlanForGrade(newGrade, newInfo.academicYear);
      setMonthlyTasks(newPlan);
    }

    if (user?.uid && user.email) {
      syncGvcnDataToCloud(user.uid, user.email, {
        classInfo: newInfo,
        students,
        weeklyRecords,
        rules,
      }).catch(console.error);
    }
  };

  const handleApplyGradePlan = (grade: 6 | 7 | 8 | 9) => {
    const newPlan = getPhuThoYearPlanForGrade(grade, classInfo.academicYear);
    setMonthlyTasks(newPlan);
  };

  const handleAddSpecialStudent = (student: GvcnSpecialStudent) => {
    setSpecialStudents((prev) => [student, ...prev]);
  };

  const handleDeleteSpecialStudent = (studentId: string) => {
    setSpecialStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Handlers for updating state
  const handleAddRule = (newRule: GvcnClassRule) => {
    setRules((prev) => [...prev, newRule]);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleSaveQuickLog = (log: GvcnLogEntry) => {
    setWeeklyRecords((prev) => {
      const existing = prev.find((r) => r.week === log.week);
      if (existing) {
        // Calculate updated group points
        const updatedScores = existing.groupScores.map((g) => {
          if (g.group === log.group) {
            const deducted = log.points < 0 ? g.deductedPoints + log.points : g.deductedPoints;
            const bonus = log.points > 0 ? g.bonusPoints + log.points : g.bonusPoints;
            const total = g.initialPoints + deducted + bonus;
            return {
              ...g,
              deductedPoints: deducted,
              bonusPoints: bonus,
              totalPoints: total,
            };
          }
          return g;
        });

        // Re-rank groups
        const sorted = [...updatedScores].sort((a, b) => b.totalPoints - a.totalPoints);
        const reRanked = updatedScores.map((g) => {
          const rank = sorted.findIndex((s) => s.group === g.group) + 1;
          return { ...g, rank };
        });

        return prev.map((r) =>
          r.week === log.week
            ? {
                ...r,
                logs: [log, ...r.logs],
                groupScores: reRanked,
              }
            : r
        );
      } else {
        // Create new week record
        const newRecord: GvcnWeeklyRecord = {
          week: log.week,
          dateRange: `Tuần ${log.week}`,
          groupScores: [1, 2, 3, 4].map((gNum) => {
            const isTarget = gNum === log.group;
            const deducted = isTarget && log.points < 0 ? log.points : 0;
            const bonus = isTarget && log.points > 0 ? log.points : 0;
            return {
              group: gNum as any,
              groupName: `Tổ ${gNum}`,
              leaderName: `Tổ trưởng ${gNum}`,
              initialPoints: 100,
              deductedPoints: deducted,
              bonusPoints: bonus,
              totalPoints: 100 + deducted + bonus,
              rank: 1,
            };
          }),
          logs: [log],
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleUpdateMeetingMinutes = (
    week: number,
    minutes: NonNullable<GvcnWeeklyRecord['meetingMinutes']>
  ) => {
    setWeeklyRecords((prev) => {
      const found = prev.find((r) => r.week === week);
      if (found) {
        return prev.map((r) => (r.week === week ? { ...r, meetingMinutes: minutes } : r));
      } else {
        return [
          ...prev,
          {
            week,
            dateRange: `Tuần ${week}`,
            groupScores: [],
            logs: [],
            meetingMinutes: minutes,
          },
        ];
      }
    });
  };

  const handleAddSpecialNote = (
    specialStudentId: string,
    note: string,
    status: 'improving' | 'stable' | 'needs_attention'
  ) => {
    setSpecialStudents((prev) =>
      prev.map((s) => {
        if (s.id === specialStudentId) {
          return {
            ...s,
            progressNotes: [
              {
                date: new Date().toLocaleDateString('vi-VN'),
                note,
                status,
              },
              ...s.progressNotes,
            ],
          };
        }
        return s;
      })
    );
  };

  const handleAddParentContact = (contact: GvcnParentContact) => {
    setParentContacts((prev) => [contact, ...prev]);
  };

  const handleToggleTask = (month: number, taskId: string) => {
    setMonthlyTasks((prev) =>
      prev.map((m) => {
        if (m.month === month) {
          return {
            ...m,
            tasks: m.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return m;
      })
    );
  };

  const handleAddTask = (month: number, title: string, targetWeek: number) => {
    setMonthlyTasks((prev) =>
      prev.map((m) => {
        if (m.month === month) {
          return {
            ...m,
            tasks: [
              ...m.tasks,
              {
                id: `task-${Date.now()}`,
                title,
                targetWeek,
                completed: false,
              },
            ],
          };
        }
        return m;
      })
    );
  };

  const currentWeeklyRecord = weeklyRecords.find((r) => r.week === activeWeek);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner: Tình hình lớp chủ nhiệm & Thông tin GVCN */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30 flex-shrink-0 shadow-xs">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  SỔ CHỦ NHIỆM LỚP — {classInfo.className}
                </h1>
                <span className="px-3 py-0.5 text-xs font-black bg-emerald-500/30 text-emerald-300 rounded-full border border-emerald-400/40">
                  Năm học {classInfo.academicYear}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-white/10 text-white rounded-full">
                  {classInfo.room}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-3xl">
                <strong>{classInfo.homeroomTeacher}</strong> • {classInfo.schoolName}. Bảng điều khiển quản lý nề nếp, thi đua 4 tổ, biên bản sinh hoạt lớp và đồng hành cùng phụ huynh theo phong cách sư phạm mẫu mực.
              </p>

              {/* Cloud Sync Status Indicator */}
              {user?.email && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Đồng bộ Cloud đa thiết bị: {user.email}</span>
                  </span>
                  {lastCloudSyncTime && (
                    <span className="text-[10px] text-emerald-300/80 font-mono">
                      (Cập nhật: {lastCloudSyncTime})
                    </span>
                  )}
                  <button
                    onClick={handleManualCloudSync}
                    disabled={isCloudSyncing}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
                    title="Bấm để đẩy dữ liệu lên máy chủ đám mây ngay lập tức"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCloudSyncing ? 'animate-spin text-emerald-300' : ''}`} />
                    <span>{isCloudSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Top Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0 w-full lg:w-auto">
            {/* Button Thêm học sinh cụ thể từng học sinh */}
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-teal-400/40 cursor-pointer"
              title="Thêm học sinh mới cụ thể từng em vào danh sách lớp"
            >
              <UserPlus className="w-4 h-4 text-teal-200" />
              <span>Thêm Học Sinh Mới</span>
            </button>

            <button
              onClick={() => setShowClassSettingsModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-emerald-400/40 cursor-pointer"
              title="Tùy chỉnh tên trường, lớp chủ nhiệm, năm học và họ tên GVCN"
            >
              <Settings className="w-4 h-4 text-emerald-200" />
              <span>Tùy Chỉnh Lớp & GVCN</span>
            </button>

            <button
              onClick={() => setShowStudentListModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Hồ sơ {students.length} Học sinh</span>
            </button>

            <button
              onClick={() => setShowQuickLogModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhận Nề nếp / Việc tốt</span>
            </button>
          </div>
        </div>

        {/* 4 Real-time Vital Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-emerald-800/40">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
              Sĩ số & Chuyên cần
            </span>
            <div className="text-xl font-black text-white mt-1">
              {students.length}/{students.length}{' '}
              <span className="text-xs font-normal text-emerald-200/80">(100%)</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">
              {students.filter((s) => s.gender === 'Nam').length} Nam •{' '}
              {students.filter((s) => s.gender === 'Nữ').length} Nữ • 0 vắng
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              Thi đua tuần {activeWeek}
            </span>
            <div className="text-xl font-black text-white mt-1 flex items-center gap-1.5">
              <span>Hạng 2 / 12</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-200/70 block mt-0.5">
              Điểm tổng kết: 96/100 (Khối 9)
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              ĐTB Chung Của Lớp
            </span>
            {(() => {
              const studentsWithGrades = students.filter(
                (s) => s.grades && typeof s.grades.dtbChung === 'number'
              );
              if (studentsWithGrades.length === 0) {
                return (
                  <>
                    <div className="text-xl font-black text-white/70 mt-1">
                      — <span className="text-xs font-normal text-cyan-200/60">(Chưa có điểm)</span>
                    </div>
                    <span className="text-[10px] text-cyan-200/70 block mt-0.5">
                      Chưa nhập điểm • Khi nào nhập mới tính ĐTB
                    </span>
                  </>
                );
              }
              const avg =
                studentsWithGrades.reduce((acc, s) => acc + s.grades!.dtbChung!, 0) /
                studentsWithGrades.length;
              const totCount = studentsWithGrades.filter((s) => s.grades!.dtbChung! >= 8.0).length;
              const khaCount = studentsWithGrades.filter(
                (s) => s.grades!.dtbChung! >= 6.5 && s.grades!.dtbChung! < 8.0
              ).length;
              return (
                <>
                  <div className="text-xl font-black text-white mt-1">
                    {avg.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-cyan-200/80">/ 10</span>
                  </div>
                  <span className="text-[10px] text-cyan-200/70 block mt-0.5">
                    Đã nhập {studentsWithGrades.length}/{students.length} HS • Tốt: {totCount} • Khá: {khaCount}
                  </span>
                </>
              );
            })()}
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
              Học sinh cần theo dõi
            </span>
            <div className="text-xl font-black text-white mt-1">
              {specialStudents.length} em <span className="text-xs font-normal text-rose-200/80">(Đã kèm đôi bạn)</span>
            </div>
            <span className="text-[10px] text-rose-200/70 block mt-0.5">
              Đã phân công đôi bạn kèm cặp uốn nắn
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('students_grades')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'students_grades'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bảng Điểm & DS VnEdu</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'students_grades'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {students.length} HS
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('tt22')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'tt22'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Nhận Xét Theo TT22 (Bộ GD&ĐT)</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'tt22'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Xuất Excel
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('records')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'records'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Sổ Nề Nếp & Xếp Hạng 4 Tổ</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'records'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Tuần {activeWeek}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'rules'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Quy Chế & Thang Điểm Thi Đua</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'rules'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {rules.length} quy định
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('meeting')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'meeting'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Biên Bản Sinh Hoạt Lớp (5 Bước)</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'meeting'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Thứ Bảy
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('special')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'special'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Học Sinh Đặc Biệt & Liên Lạc CMHS</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'special'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {specialStudents.length} em • {parentContacts.length} cuộc gọi
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('year_plan')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === 'year_plan'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Kế Hoạch 9 Tháng Năm Học</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'year_plan'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            T9 → T5
          </span>
        </button>
      </div>

      {/* 3. Render Active Sub-section */}
      <div>
        {activeSubTab === 'students_grades' && (
          <GvcnStudentGradesSection
            students={students}
            classInfo={classInfo}
            onUpdateStudents={handleUpdateStudents}
            onSelectStudent={handleSelectStudent}
            onOpenAddStudent={() => setShowAddStudentModal(true)}
          />
        )}

        {activeSubTab === 'tt22' && (
          <GvcnTT22EvaluationSection
            students={students}
            classInfo={classInfo}
            onUpdateStudents={handleUpdateStudents}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeSubTab === 'records' && (
          <GvcnWeeklyRecordSection
            weeklyRecords={weeklyRecords}
            activeWeek={activeWeek}
            onSelectWeek={setActiveWeek}
            onOpenQuickLogModal={() => setShowQuickLogModal(true)}
            students={students}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeSubTab === 'rules' && (
          <GvcnRulesSection
            rules={rules}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
          />
        )}

        {activeSubTab === 'meeting' && (
          <GvcnMeetingSection
            activeWeek={activeWeek}
            weeklyRecord={currentWeeklyRecord}
            onUpdateMeetingMinutes={handleUpdateMeetingMinutes}
          />
        )}

        {activeSubTab === 'special' && (
          <GvcnSpecialStudentsSection
            specialStudents={specialStudents}
            parentContacts={parentContacts}
            classInfo={classInfo}
            students={students}
            onAddSpecialNote={handleAddSpecialNote}
            onAddParentContact={handleAddParentContact}
            onAddSpecialStudent={handleAddSpecialStudent}
            onDeleteSpecialStudent={handleDeleteSpecialStudent}
          />
        )}

        {activeSubTab === 'year_plan' && (
          <GvcnYearPlanSection
            monthlyTasks={monthlyTasks}
            classInfo={classInfo}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onApplyGradePlan={handleApplyGradePlan}
          />
        )}
      </div>

      {/* Modals */}
      <GvcnClassSettingsModal
        isOpen={showClassSettingsModal}
        onClose={() => setShowClassSettingsModal(false)}
        classInfo={classInfo}
        onSaveClassInfo={handleSaveClassInfo}
      />

      <GvcnStudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        student={selectedStudentForProfile}
        classInfo={classInfo}
        onUpdateStudent={handleUpdateStudent}
        specialRecord={
          selectedStudentForProfile
            ? specialStudents.find(
                (s) =>
                  s.studentId === selectedStudentForProfile.id ||
                  (Boolean(s.name && selectedStudentForProfile.name) &&
                    s.name.toLowerCase().trim() === selectedStudentForProfile.name.toLowerCase().trim())
              )
            : undefined
        }
        logs={weeklyRecords.flatMap((w) => w.logs)}
        parentContacts={parentContacts}
      />

      <GvcnStudentListModal
        isOpen={showStudentListModal}
        onClose={() => setShowStudentListModal(false)}
        students={students}
        classInfo={classInfo}
        onSelectStudent={handleSelectStudent}
      />

      <GvcnQuickLogModal
        isOpen={showQuickLogModal}
        onClose={() => setShowQuickLogModal(false)}
        students={students}
        rules={rules}
        activeWeek={activeWeek}
        onSaveLog={handleSaveQuickLog}
      />

      <GvcnAddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAddStudent={handleAddStudent}
        existingStudents={students}
      />
    </div>
  );
};
