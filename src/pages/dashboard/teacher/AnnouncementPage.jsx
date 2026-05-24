import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Send, Info } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import teacherService from "@services/teacher.service";
import notificationService from "@services/notification.service";
import { useAuth } from "@contexts/AuthContext";
import { ROLE_LABELS } from "@constants/roles";
import { toast } from "sonner";

const AnnouncementPage = () => {
  const { user, activeRole, getActiveRoleLabel } = useAuth();
  const [studentTargetType, setStudentTargetType] = useState("students");

  const [studentOptions, setStudentOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [teacherStudentPayload, setTeacherStudentPayload] = useState({
    teacher: null,
    totalClassSessions: 0,
    totalStudents: 0,
    students: [],
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const senderDisplayName =
    user?.profile?.full_name ||
    user?.full_name ||
    user?.name ||
    user?.user_name ||
    user?.userName ||
    "--";

  const senderRoleLabel =
    getActiveRoleLabel?.() ||
    ROLE_LABELS[activeRole] ||
    (Array.isArray(user?.roles) && user.roles.length > 0 ? ROLE_LABELS[user.roles[0]] || user.roles[0] : "--");

  useEffect(() => {
    const fetchMyStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const response = await teacherService.getMyStudents();
        const students = Array.isArray(response?.data?.students) ? response.data.students : [];

        setTeacherStudentPayload({
          teacher: response?.data?.teacher || null,
          totalClassSessions: Number(response?.data?.totalClassSessions) || 0,
          totalStudents: Number(response?.data?.totalStudents) || students.length,
          students,
        });

        const mappedStudentOptions = students.map((student) => ({
          value: student.studentId,
          label: student.studentCode
            ? `${student.fullName || "Không rõ tên"} - ${student.studentCode}`
            : student.fullName || "Không rõ tên",
          student,
        }));
        setStudentOptions(mappedStudentOptions);

        const subjectMap = new Map();
        students.forEach((student) => {
          const enrollments = Array.isArray(student?.enrollments) ? student.enrollments : [];

          enrollments.forEach((enrollment) => {
            const courseSection = enrollment?.courseSection;
            if (!courseSection?.id) return;

            const practiceGroup = enrollment?.practiceGroup || null;
            const subjectKey = `${courseSection.id}:${practiceGroup?.id || 'LT'}`;

            if (!subjectMap.has(subjectKey)) {
              const modeLabel = practiceGroup?.id
                ? `Thực hành - Nhóm ${practiceGroup?.numberGroup ?? '?'}`
                : 'Lý thuyết';

              subjectMap.set(subjectKey, {
                value: subjectKey,
                label: `${courseSection.name || 'Không rõ tên'} - ${courseSection.code || 'N/A'} - ${modeLabel}`,
                payload: {
                  courseSectionId: courseSection.id,
                  practiceGroupId: practiceGroup?.id || null,
                  studentIds: new Set(),
                },
              });
            }

            subjectMap.get(subjectKey).payload.studentIds.add(student.studentId);
          });
        });

        const mappedSubjectOptions = Array.from(subjectMap.values()).map((item) => ({
          value: item.value,
          label: item.label,
          payload: {
            ...item.payload,
            studentIds: Array.from(item.payload.studentIds),
          },
        }));
        setSubjectOptions(mappedSubjectOptions);
      } catch (error) {
        setTeacherStudentPayload({
          teacher: null,
          totalClassSessions: 0,
          totalStudents: 0,
          students: [],
        });
        setStudentOptions([]);
        setSubjectOptions([]);
        toast.error(error.message || 'Không thể tải danh sách sinh viên.');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchMyStudents();
  }, []);

  useEffect(() => {
    if (studentTargetType !== 'students') {
      setSelectedStudents([]);
    }

    if (studentTargetType !== 'subjects') {
      setSelectedSubjects([]);
    }
  }, [studentTargetType]);

  const getPlainTextFromHtml = (html) =>
    (html || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

  const resolveTargetStudentIds = () => {
    if (studentTargetType === 'students') {
      return [...new Set((selectedStudents || []).map((item) => item?.value).filter(Boolean))];
    }

    if (studentTargetType === 'subjects') {
      return [
        ...new Set(
          (selectedSubjects || [])
            .flatMap((item) => (Array.isArray(item?.payload?.studentIds) ? item.payload.studentIds : []))
            .filter(Boolean)
        ),
      ];
    }

    return [];
  };

  const sendNotificationsBySingleTarget = async (targetStudentIds, normalizedTitle) => {
    const studentUserIdMap = new Map(
      (teacherStudentPayload.students || [])
        .filter((student) => student?.studentId && student?.user?.userId)
        .map((student) => [String(student.studentId), student.user.userId])
    );

    const targetUserIds = [
      ...new Set(
        (targetStudentIds || [])
          .map((studentId) => studentUserIdMap.get(String(studentId)))
          .filter(Boolean)
      ),
    ];

    if (!targetUserIds.length) {
      throw new Error('Không tìm thấy tài khoản người dùng hợp lệ để gửi thông báo.');
    }

    const payloadBase = {
      title: normalizedTitle,
      message: content,
      target_role: 'student',
      metadata: {
        sender_name: senderDisplayName,
        sender_role: senderRoleLabel,
        sender_user_id: user?.id || null,
        source: 'teacher_announcement_page',
        target_mode: studentTargetType,
      },
    };

    const settledResults = await Promise.allSettled(
      targetUserIds.map((userId) =>
        notificationService.createNotification({
          ...payloadBase,
          target_user_id: userId,
        })
      )
    );

    const successCount = settledResults.filter((item) => item.status === 'fulfilled').length;

    if (successCount === 0) {
      throw new Error('Không thể gửi thông báo cho sinh viên.');
    }

    return {
      successCount,
      failCount: settledResults.length - successCount,
    };
  };

  const handleSendAnnouncement = async () => {
    const normalizedTitle = title.trim();
    const plainTextContent = getPlainTextFromHtml(content);

    if (!normalizedTitle) {
      toast.error('Vui lòng nhập tiêu đề thông báo.');
      return;
    }

    if (!plainTextContent) {
      toast.error('Vui lòng nhập nội dung thông báo.');
      return;
    }

    const targetIds = resolveTargetStudentIds();

    if (!targetIds.length) {
      toast.error('Vui lòng chọn ít nhất 1 sinh viên nhận thông báo.');
      return;
    }

    try {
      setIsSending(true);

      try {
        const response = await notificationService.createBulkByTargetType({
          title: normalizedTitle,
          message: content,
          target_type: 'student',
          target_ids: targetIds,
          metadata: {
            sender_name: senderDisplayName,
            sender_role: senderRoleLabel,
            sender_user_id: user?.id || null,
            source: 'teacher_announcement_page',
            target_mode: studentTargetType,
          },
        });

        const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
        toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} sinh viên.`);
      } catch (bulkError) {
        if (bulkError?.status === 401 || bulkError?.status === 403) {
          const fallbackResult = await sendNotificationsBySingleTarget(targetIds, normalizedTitle);
          if (fallbackResult.failCount > 0) {
            toast.warning(`Đã gửi ${fallbackResult.successCount} sinh viên, ${fallbackResult.failCount} sinh viên gửi thất bại.`);
          } else {
            toast.success(`Đã gửi thông báo cho ${fallbackResult.successCount} sinh viên.`);
          }
        } else {
          throw bulkError;
        }
      }

      setTitle('');
      setContent('');
      setSelectedStudents([]);
      setSelectedSubjects([]);
    } catch (error) {
      toast.error(error.message || 'Không thể gửi thông báo. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  // Custom style cho React Select để hạn chế bo góc và trông chuyên nghiệp hơn
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '2px',
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      '&:hover': { borderColor: '#3b82f6' }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#eff6ff',
      borderRadius: '0px',
    })
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen text-slate-700">
      <div className="mx-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600">Giảng viên gửi thông báo đến sinh viên</h2>
        </div>

        <div className="grid grid-cols-12 gap-8 mt-8">
            {/* LEFT PANEL - Cấu hình người nhận */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-600 pl-3">
                  <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Đối tượng nhận tin</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Hình thức gửi</label>
                    <select
                      className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                      value={studentTargetType}
                      onChange={(e) => setStudentTargetType(e.target.value)}
                    >
                      <option value="students">1 hoặc nhiều sinh viên</option>
                      <option value="subjects">1 hoặc nhiều học phần / nhóm</option>
                    </select>
                  </div>

                  {studentTargetType === "students" ? (
                    <div className="animate-in fade-in duration-500">
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách sinh viên</label>
                      <Select
                        options={studentOptions}
                        isMulti
                        styles={customSelectStyles}
                        value={selectedStudents}
                        placeholder="Tìm và chọn sinh viên..."
                        onChange={(value) => setSelectedStudents(value || [])}
                        isLoading={isLoadingStudents}
                        loadingMessage={() => "Đang tải danh sách sinh viên..."}
                        noOptionsMessage={() =>
                          isLoadingStudents
                            ? "Đang tải..."
                            : "Không tìm thấy sinh viên"
                        }
                        className="text-sm"
                      />
                    </div>
                  ) : null}

                  {studentTargetType === "subjects" ? (
                    <div className="animate-in fade-in duration-500">
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách học phần / lớp</label>
                      <Select
                        options={subjectOptions}
                        isMulti
                        styles={customSelectStyles}
                        value={selectedSubjects}
                        placeholder="Chọn một hoặc nhiều học phần..."
                        onChange={(value) => setSelectedSubjects(value || [])}
                        isLoading={isLoadingStudents}
                        loadingMessage={() => "Đang tải học phần từ danh sách sinh viên..."}
                        noOptionsMessage={() =>
                          isLoadingStudents
                            ? "Đang tải..."
                            : "Không có dữ liệu học phần"
                        }
                        className="text-sm"
                      />
                    </div>
                  ) : null}

                  <div className="pt-1 text-xs text-slate-500">
                    Tổng buổi học: <span className="font-semibold text-slate-700">{teacherStudentPayload.totalClassSessions}</span>
                    {' | '}
                    Tổng sinh viên: <span className="font-semibold text-slate-700">{teacherStudentPayload.totalStudents}</span>
                  </div>
                </div>
              </div>
              
              {/* Box hỗ trợ bổ sung (Phần trống phía dưới) */}
              <div className="bg-blue-50 p-5 border border-blue-100 rounded-sm">
                <div className="flex gap-3">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Lưu ý</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Thông báo sẽ được gửi qua Email và thông báo đẩy trên ứng dụng di động của người nhận. Hãy kiểm tra kỹ nội dung trước khi bấm "Gửi".
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Soạn thảo nội dung */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col h-full">
                <div className="p-6 border-b border-gray-50 bg-[#fafafa]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight border-l-4 border-emerald-500 pl-3">Soạn thảo nội dung</h3>
                    </div>
                    <div className="flex items-center gap-6 text-[11px] uppercase font-bold text-slate-400 tracking-widest">
                      <p>Người gửi: <span className="text-slate-700">{senderDisplayName}</span></p>
                      <p>Quyền: <span className="text-slate-700">{senderRoleLabel}</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-grow">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tiêu đề thông báo</label>
                    <input
                      className="w-full border-b-2 border-gray-100 p-2 text-lg font-medium focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Nhập tiêu đề ngắn gọn, xúc tích..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col h-[400px]">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nội dung chi tiết</label>
                    <div className="flex-grow overflow-hidden border border-gray-100">
                      <ReactQuill 
                        theme="snow"
                        value={content} 
                        onChange={setContent} 
                        className="h-full flex flex-col"
                        placeholder="Nội dung thông báo viết tại đây..."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-slate-400 italic">
                    * Nhấn Gửi để xác nhận tác vụ.
                  </div>
                  <button
                    onClick={handleSendAnnouncement}
                    disabled={isSending || isLoadingStudents}
                    className="flex items-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest transition-all shadow-lg active:transform active:scale-95"
                  >
                    <Send size={16} />
                    {isSending ? "Đang gửi..." : "Gửi thông báo ngay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;