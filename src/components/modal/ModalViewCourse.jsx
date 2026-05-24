import React, { useState, useEffect } from "react";
import { X, BookOpen, Calendar, GraduationCap, Users, Building2, FileText, Clock, Loader2 } from "lucide-react";
import courseService from "../../services/course.service";
import { toast } from "sonner";

// InfoRow component for displaying course information
// eslint-disable-next-line no-unused-vars
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-emerald-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewCourse = ({ isOpen, onClose, courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch course data when modal opens
  useEffect(() => {
    if (isOpen && courseId) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseSectionById(courseId);
      if (response.data) {
        setCourseData(response.data);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Không thể tải thông tin học phần");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Parse semester format "2026-1" to year and ky
  const parseSemester = (semester) => {
    if (!semester) return { year: "", ky: "" };
    const parts = semester.split("-");
    return {
      year: parts[0] || "",
      ky: parts[1] || ""
    };
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-emerald-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết môn học
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-emerald-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600">Đang tải thông tin học phần...</p>
            </div>
          ) : courseData ? (
            <>
              {/* Course Info Header */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                  {courseData.name}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  {courseData.code}
                </p>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-600">
                  Đang hoạt động
                </span>
              </div>

              {/* Course Details */}
              <div className="space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Năm học"
                  value={parseSemester(courseData.semester).year}
                />
                <InfoRow
                  icon={Clock}
                  label="Học kỳ"
                  value={`Kỳ ${parseSemester(courseData.semester).ky}`}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Số tín chỉ"
                  value={courseData.credits}
                />
                <InfoRow
                  icon={Users}
                  label="Sĩ số tối đa"
                  value={courseData.max_students}
                />
                <InfoRow
                  icon={Building2}
                  label="Số nhóm thực hành"
                  value={courseData.practice_sessions || "Không có"}
                />
              </div>

              {/* Practice Groups Section */}
              {courseData.practiceGroups && courseData.practiceGroups.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Các nhóm thực hành
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {courseData.practiceGroups.map((group) => (
                      <div 
                        key={group.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      >
                        <p className="font-medium text-gray-800 mb-1">{group.group_name}</p>
                        <p className="text-sm text-gray-600">
                          Sĩ số: {group.max_students} sinh viên
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              {courseData.description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Mô tả</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {courseData.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-600">Không tìm thấy thông tin học phần</p>
            </div>
          )}
        </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewCourse;
