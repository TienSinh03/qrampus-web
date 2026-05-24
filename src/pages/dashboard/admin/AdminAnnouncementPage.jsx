import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Select from "react-select";
import { Send, Users, Info } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import teacherService from "@services/teacher.service";
import studentService from "@services/student.service";
import courseService from "@services/course.service";
import notificationService from "@services/notification.service";
import { useAuth } from "@contexts/AuthContext";
import { ROLE_LABELS } from "@constants/roles";
import { toast } from "sonner";

const AdminAnnouncementPage = () => {
  const { user, activeRole, getActiveRoleLabel } = useAuth();
  const [activeTab, setActiveTab] = useState("lecturer");

  const [lecturerType, setLecturerType] = useState("all");
  const [studentTargetType, setStudentTargetType] = useState("all");

  const [lecturerOptions, setLecturerOptions] = useState([]);
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);

  const [studentOptions, setStudentOptions] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const [subjectGroupOptions, setSubjectGroupOptions] = useState([]);
  const [isLoadingSubjectGroups, setIsLoadingSubjectGroups] = useState(false);

  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  useEffect(() => {
    if (lecturerType !== "specific") {
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setIsLoadingLecturers(true);

        const params = {
          page: 1,
          limit: 50,
        };

        if (lecturerSearch.trim()) {
          params.search = lecturerSearch.trim();
        }

        const response = await teacherService.getAllTeachers(params);
        const teachers = Array.isArray(response?.data) ? response.data : [];

        setLecturerOptions(
          teachers.map((teacher) => ({
            value: teacher.id || teacher.teacher_code,
            label: teacher.teacher_code
              ? `${teacher.full_name || "Không rõ tên"} - ${teacher.teacher_code}`
              : teacher.full_name || "Không rõ tên",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        setLecturerOptions([]);
      } finally {
        setIsLoadingLecturers(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [lecturerType, lecturerSearch]);

  useEffect(() => {
    if (lecturerType !== "specific") {
      setSelectedLecturers([]);
      setLecturerSearch("");
      setLecturerOptions([]);
    }
  }, [lecturerType]);

  useEffect(() => {
    if (studentTargetType !== "students") {
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setIsLoadingStudents(true);

        const params = {
          page: 1,
          limit: 10,
        };

        if (studentSearch.trim()) {
          params.search = studentSearch.trim();
        }

        const response = await studentService.getAllStudents(params);
        const students = Array.isArray(response?.data) ? response.data : [];

        setStudentOptions(
          students.map((student) => ({
            value: student.id,
            label: student.student_code
              ? `${student.full_name || "Không rõ tên"} - ${student.student_code}`
              : student.full_name || "Không rõ tên",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudentOptions([]);
      } finally {
        setIsLoadingStudents(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [studentTargetType, studentSearch]);

  useEffect(() => {
    if (studentTargetType !== "students") {
      setSelectedStudents([]);
      setStudentSearch("");
      setStudentOptions([]);
    }
  }, [studentTargetType]);

  useEffect(() => {
    if (studentTargetType !== "subjects") {
      setSelectedSubjects([]);
      setSubjectGroupOptions([]);
      return;
    }

    const fetchSubjectGroups = async () => {
      try {
        setIsLoadingSubjectGroups(true);
        const response = await courseService.getCourseSectionRows({ page: 1, limit: 200 });
        const rows = Array.isArray(response?.data) ? response.data : [];

        const options = rows
          .filter((row) => row?.code)
          .map((row) => {
            const isTheory = row?.type === "LT";
            const modeLabel = isTheory
              ? "Lý thuyết"
              : `Thực hành - Nhóm ${row?.number_group ?? "?"}`;

            return {
              value: `${row.course_section_id || row.code}:${row.group_id || "LT"}`,
              label: `${row.name || "Không rõ tên"} - ${row.code} - ${modeLabel}`,
              payload: {
                courseSectionCode: row.code,
                courseSectionId: row.course_section_id,
                practiceGroupId: isTheory ? null : row.group_id,
                learningType: row.type,
                numberGroup: row.number_group || null,
              },
            };
          });

        setSubjectGroupOptions(options);
      } catch (error) {
        console.error("Failed to fetch course section groups:", error);
        setSubjectGroupOptions([]);
      } finally {
        setIsLoadingSubjectGroups(false);
      }
    };

    fetchSubjectGroups();
  }, [studentTargetType]);

  const getPlainTextFromHtml = (html) =>
    (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  const fetchAllTeacherIds = async () => {
    const allIds = [];
    const pageSize = 200;
    let page = 1;
    let totalPages = 1;

    do {
      const response = await teacherService.getAllTeachers({ page, limit: pageSize });
      const teachers = Array.isArray(response?.data) ? response.data : [];
      allIds.push(...teachers.map((teacher) => teacher?.id).filter(Boolean));

      totalPages = Number(response?.pagination?.totalPages) || 1;
      page += 1;
    } while (page <= totalPages);

    return [...new Set(allIds)];
  };

  const fetchAllStudentIds = async () => {
    const allIds = [];
    const pageSize = 200;
    let page = 1;
    let totalPages = 1;

    do {
      const response = await studentService.getAllStudents({ page, limit: pageSize });
      const students = Array.isArray(response?.data) ? response.data : [];
      allIds.push(...students.map((student) => student?.id).filter(Boolean));

      totalPages = Number(response?.meta?.totalPages || response?.pagination?.totalPages) || 1;
      page += 1;
    } while (page <= totalPages);

    return [...new Set(allIds)];
  };

  const handleSendAnnouncement = async () => {
    const normalizedTitle = title.trim();
    const plainTextContent = getPlainTextFromHtml(content);

    if (!normalizedTitle) {
      toast.error("Vui lòng nhập tiêu đề thông báo.");
      return;
    }

    if (!plainTextContent) {
      toast.error("Vui lòng nhập nội dung thông báo.");
      return;
    }

    try {
      setIsSending(true);

      if (activeTab === "lecturer") {
        if (lecturerType === "all") {
          const targetIds = await fetchAllTeacherIds();

          if (targetIds.length === 0) {
            toast.error("Không tìm thấy giảng viên để gửi thông báo.");
            return;
          }

          const response = await notificationService.createBulkByTargetType({
            title: normalizedTitle,
            message: content,
            target_type: "teacher",
            target_ids: targetIds,
            metadata: {
              sender_name: senderDisplayName,
              sender_role: senderRoleLabel,
              sender_user_id: user?.id || null,
            },
          });

          const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
          toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} giảng viên.`);
        } else {
          const targetIds = [...new Set((selectedLecturers || []).map((item) => item?.value).filter(Boolean))];

          if (targetIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 giảng viên.");
            return;
          }

          const payload = {
            title: normalizedTitle,
            message: content,
            target_type: "teacher",
            target_ids: targetIds,
            metadata: {
              sender_name: senderDisplayName,
              sender_role: senderRoleLabel,
              sender_user_id: user?.id || null,
            },
          };

          const response = await notificationService.createBulkByTargetType(payload);
          const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
          toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} giảng viên.`);
        }
      } else {
        if (studentTargetType === "subjects") {
          const selectedGroups = [
            ...new Map(
              (selectedSubjects || [])
                .map((item) => item?.payload)
                .filter((payload) => payload?.courseSectionCode)
                .map((payload) => [
                  `${payload.courseSectionCode}:${payload.practiceGroupId || "LT"}`,
                  payload,
                ])
            ).values(),
          ];

          if (selectedGroups.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 nhóm học phần.");
            return;
          }

          const studentResults = await Promise.all(
            selectedGroups.map((group) => {
              const params = group.practiceGroupId
                ? { practiceGroupId: group.practiceGroupId }
                : {};
              return teacherService.getStudentsInCourseSection(group.courseSectionCode, params);
            })
          );

          const targetIds = [
            ...new Set(
              studentResults
                .flatMap((result) => (Array.isArray(result?.data?.students) ? result.data.students : []))
                .map((student) => student?.studentId || student?.id)
                .filter(Boolean)
            ),
          ];

          if (targetIds.length === 0) {
            toast.error("Không tìm thấy sinh viên trong nhóm học phần đã chọn.");
            return;
          }

          const response = await notificationService.createBulkByTargetType({
            title: normalizedTitle,
            message: content,
            target_type: "student",
            target_ids: targetIds,
            metadata: {
              sender_name: senderDisplayName,
              sender_role: senderRoleLabel,
              sender_user_id: user?.id || null,
              subject_groups: selectedGroups.map((group) => ({
                course_section_code: group.courseSectionCode,
                learning_type: group.learningType,
                practice_group_id: group.practiceGroupId,
              })),
            },
          });

          const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
          toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} sinh viên theo nhóm học phần.`);
        } else if (studentTargetType === "all") {
          const targetIds = await fetchAllStudentIds();

          if (targetIds.length === 0) {
            toast.error("Không tìm thấy sinh viên để gửi thông báo.");
            return;
          }

          const response = await notificationService.createBulkByTargetType({
            title: normalizedTitle,
            message: content,
            target_type: "student",
            target_ids: targetIds,
            metadata: {
              sender_name: senderDisplayName,
              sender_role: senderRoleLabel,
              sender_user_id: user?.id || null,
            },
          });

          const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
          toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} sinh viên.`);
        }

        if (studentTargetType === "students") {
          const targetIds = [...new Set((selectedStudents || []).map((item) => item?.value).filter(Boolean))];

          if (targetIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 sinh viên.");
            return;
          }

          const response = await notificationService.createBulkByTargetType({
            title: normalizedTitle,
            message: content,
            target_type: "student",
            target_ids: targetIds,
            metadata: {
              sender_name: senderDisplayName,
              sender_role: senderRoleLabel,
              sender_user_id: user?.id || null,
            },
          });

          const recipientCount = response?.data?.summary?.recipient_count || targetIds.length;
          toast.success(response?.message || `Đã gửi thông báo cho ${recipientCount} sinh viên.`);
        }
      }

      setTitle("");
      setContent("");
      setSelectedLecturers([]);
      setLecturerSearch("");
      setSelectedStudents([]);
      setStudentSearch("");
      setSelectedSubjects([]);
    } catch (error) {
      toast.error(error.message || "Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen text-slate-700">
      <div className="mx-auto">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          {/* TAB HEADER - Cắt góc vuông vức */}
          <Tabs.List className="flex bg-white border-b border-gray-200">
            <Tabs.Trigger
              value="lecturer"
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-slate-400 hover:text-slate-600"
            >
              Thông báo Giảng viên
            </Tabs.Trigger>
            <Tabs.Trigger
              value="student"
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-slate-400 hover:text-slate-600"
            >
              Thông báo Sinh viên
            </Tabs.Trigger>
          </Tabs.List>

          <div className="grid grid-cols-12 gap-8 mt-8">
            {/* LEFT PANEL - Cấu hình người nhận */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-600 pl-3">
                  <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Đối tượng nhận tin</h3>
                </div>

                <Tabs.Content value="lecturer" className="focus:outline-none">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Hình thức gửi</label>
                      <select
                        className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                        value={lecturerType}
                        onChange={(e) => setLecturerType(e.target.value)}
                      >
                        <option value="all">Gửi cho tất cả Giảng viên</option>
                        <option value="specific">Chọn danh sách cụ thể</option>
                      </select>
                    </div>

                    {lecturerType === "specific" ? (
                      <div className="animate-in fade-in duration-500">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách giảng viên</label>
                        <Select
                          options={lecturerOptions}
                          isMulti
                          styles={customSelectStyles}
                          value={selectedLecturers}
                          placeholder="Tìm tên giảng viên..."
                          inputValue={lecturerSearch}
                          onInputChange={(value, actionMeta) => {
                            if (actionMeta.action === "input-change") {
                              setLecturerSearch(value);
                            }
                            return value;
                          }}
                          onChange={(value) => setSelectedLecturers(value || [])}
                          isLoading={isLoadingLecturers}
                          loadingMessage={() => "Đang tải danh sách giảng viên..."}
                          noOptionsMessage={() =>
                            isLoadingLecturers
                              ? "Đang tải..."
                              : "Không tìm thấy giảng viên"
                          }
                          filterOption={null}
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <div className="py-12 border-2 border-dashed border-gray-100 rounded-sm flex flex-col items-center justify-center text-slate-400">
                        <Users size={40} strokeWidth={1.5} className="mb-2 text-blue-200" />
                        <p className="text-xs font-medium uppercase tracking-widest">Toàn hệ thống</p>
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                <Tabs.Content value="student" className="focus:outline-none">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Hình thức gửi</label>
                      <select
                        className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                        value={studentTargetType}
                        onChange={(e) => setStudentTargetType(e.target.value)}
                      >
                        <option value="all">Tất cả sinh viên</option>
                        <option value="students">1 hoặc nhiều sinh viên</option>
                        <option value="subjects">1 hoặc nhiều học phần</option>
                      </select>
                    </div>

                    {studentTargetType === "all" ? (
                      <div className="py-12 border-2 border-dashed border-gray-100 rounded-sm flex flex-col items-center justify-center text-slate-400">
                        <Users size={40} strokeWidth={1.5} className="mb-2 text-blue-200" />
                        <p className="text-xs font-medium uppercase tracking-widest">Tất cả sinh viên</p>
                      </div>
                    ) : null}

                    {studentTargetType === "students" ? (
                      <div className="animate-in fade-in duration-500">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách sinh viên</label>
                        <Select
                          options={studentOptions}
                          isMulti
                          styles={customSelectStyles}
                          value={selectedStudents}
                          placeholder="Tìm và chọn sinh viên..."
                          inputValue={studentSearch}
                          onInputChange={(value, actionMeta) => {
                            if (actionMeta.action === "input-change") {
                              setStudentSearch(value);
                            }
                            return value;
                          }}
                          onChange={(value) => setSelectedStudents(value || [])}
                          isLoading={isLoadingStudents}
                          loadingMessage={() => "Đang tải danh sách sinh viên..."}
                          noOptionsMessage={() =>
                            isLoadingStudents
                              ? "Đang tải..."
                              : "Không tìm thấy sinh viên"
                          }
                          filterOption={null}
                          className="text-sm"
                        />
                      </div>
                    ) : null}

                    {studentTargetType === "subjects" ? (
                      <div className="animate-in fade-in duration-500">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách nhóm học phần (LT/TH)</label>
                        <Select
                          options={subjectGroupOptions}
                          isMulti
                          styles={customSelectStyles}
                          value={selectedSubjects}
                          placeholder="Chọn một hoặc nhiều nhóm học phần..."
                          onChange={(value) => setSelectedSubjects(value || [])}
                          isLoading={isLoadingSubjectGroups}
                          loadingMessage={() => "Đang tải danh sách nhóm học phần..."}
                          noOptionsMessage={() =>
                            isLoadingSubjectGroups ? "Đang tải..." : "Không có nhóm học phần"
                          }
                          className="text-sm"
                        />
                      </div>
                    ) : null}
                  </div>
                </Tabs.Content>
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
                    disabled={isSending}
                    className="flex items-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest transition-all shadow-lg active:transform active:scale-95"
                  >
                    <Send size={16} />
                    {isSending ? "Đang gửi..." : "Gửi thông báo ngay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default AdminAnnouncementPage;