import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import courseService from "../../services/course.service";
import studentEnrollmentService from "../../services/student.enrollment.service";

const ModalAddEnroll = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    student_code: "",
    course_section_code: "",
    learning_mode_value: "",
  });
  const [loadingModes, setLoadingModes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [learningModes, setLearningModes] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetState = () => {
    setFormData({
      student_code: "",
      course_section_code: "",
      learning_mode_value: "",
    });
    setLearningModes([]);
    setCourseInfo(null);
    setLoadingModes(false);
    setSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  useEffect(() => {
    const code = formData.course_section_code.trim();
    if (!isOpen || !code) {
      setLearningModes([]);
      setCourseInfo(null);
      setFormData((prev) => ({ ...prev, learning_mode_value: "" }));
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoadingModes(true);
        const response = await courseService.getLearningModesByCourseSectionCode(code);
        if (!active) return;

        const data = response?.data || response;
        const modes = data?.learning_modes || [];

        setCourseInfo(data);
        setLearningModes(modes);
        setFormData((prev) => ({
          ...prev,
          learning_mode_value: modes.length > 0
            ? (modes[0].type === "LT" ? "LT" : `TH-${modes[0].number_group}`)
            : "",
        }));
      } catch (error) {
        if (!active) return;
        setLearningModes([]);
        setCourseInfo(null);
        setFormData((prev) => ({ ...prev, learning_mode_value: "" }));
        toast.error(error.message || "Không thể tải hình thức học theo mã học phần");
      } finally {
        if (active) setLoadingModes(false);
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.course_section_code, isOpen]);

  const selectedLearningMode = useMemo(() => {
    if (!formData.learning_mode_value) return null;
    if (formData.learning_mode_value === "LT") {
      return learningModes.find((m) => m.type === "LT") || null;
    }

    if (formData.learning_mode_value.startsWith("TH-")) {
      const number = Number(formData.learning_mode_value.replace("TH-", ""));
      return learningModes.find((m) => m.type === "TH" && Number(m.number_group) === number) || null;
    }

    return null;
  }, [formData.learning_mode_value, learningModes]);

  const handleSubmit = async () => {
    const studentCode = formData.student_code.trim();
    const courseSectionCode = formData.course_section_code.trim();

    if (!studentCode || !courseSectionCode) {
      toast.error("Vui lòng nhập mã sinh viên và mã môn học");
      return;
    }

    if (loadingModes || !selectedLearningMode) {
      toast.error("Vui lòng chọn hình thức học hợp lệ");
      return;
    }

    const payload = {
      student_code: studentCode,
      course_section_code: courseSectionCode,
      practice_group_number:
        selectedLearningMode.type === "TH"
          ? Number(selectedLearningMode.number_group)
          : null,
    };

    try {
      setSubmitting(true);
      const response = await studentEnrollmentService.createStudentEnrollmentByAdmin(payload);
      toast.success(response?.message || "Thêm đăng ký môn học thành công");

      if (onSubmit) {
        onSubmit(response?.data || payload);
      }

      resetState();
      onClose();
    } catch (error) {
      toast.error(error.message || "Không thể thêm đăng ký môn học");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-teal-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Thêm đăng ký môn học
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-teal-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sinh viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="student_code"
                value={formData.student_code}
                onChange={handleChange}
                placeholder="Ví dụ: 21210008"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã học phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="course_section_code"
                value={formData.course_section_code}
                onChange={handleChange}
                placeholder="Ví dụ: 312574340"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập mã học phần để tự động tải Lý thuyết/Thực hành nhóm.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình thức học <span className="text-red-500">*</span>
              </label>
              <select
                name="learning_mode_value"
                value={formData.learning_mode_value}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={loadingModes || learningModes.length === 0}
              >
                {loadingModes && <option value="">Đang tải hình thức học...</option>}
                {!loadingModes && learningModes.length === 0 && (
                  <option value="">Chưa có dữ liệu hình thức học</option>
                )}
                {!loadingModes && learningModes.map((mode) => {
                  const value = mode.type === "LT" ? "LT" : `TH-${mode.number_group}`;
                  return (
                    <option key={value} value={value}>
                      {mode.label}
                    </option>
                  );
                })}
              </select>
            </div>

            {courseInfo && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
                <p><span className="font-medium">Môn học:</span> {courseInfo.course_section_name}</p>
                <p><span className="font-medium">Mã học phần:</span> {courseInfo.course_section_code}</p>
                <p><span className="font-medium">Kỳ:</span> {courseInfo.semester}</p>
                <p><span className="font-medium">Số nhóm thực hành:</span> {courseInfo.practice_sessions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting || loadingModes}
            className="px-6 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
          >
            {submitting ? "Đang thêm..." : "Thêm đăng ký"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddEnroll;
