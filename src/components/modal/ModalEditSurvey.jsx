import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import surveyService from "../../services/survey.service";
import { toast } from "sonner";

const ModalEditSurvey = ({ isOpen, onClose, surveyData, onSubmit }) => {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [formData, setFormData] = useState({
    surveyId: "",
    title: "",
    createdAt: "",
    endAt: "",
    status: "",
  });
  const [questions, setQuestions] = useState([]);

  const toDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const parseOptionsText = (value) => {
    if (!value?.trim()) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // Initialize form data when surveyData changes
  useEffect(() => {
    const fetchSurveyDetail = async () => {
      if (!isOpen || !surveyData?.id) return;

      try {
        setLoadingDetail(true);
        const response = await surveyService.getSurveyById(surveyData.id);
        const detail = response?.data || {};

        setFormData({
          surveyId: detail.id || surveyData.id || "",
          title: detail.title || "",
          createdAt: toDateInputValue(detail.opens_at || surveyData.created_at),
          endAt: toDateInputValue(detail.closes_at || surveyData.end_at),
          status: detail.is_active ? "Active" : "Inactive",
        });

        const detailQuestions = Array.isArray(detail.questions) ? detail.questions : [];
        setQuestions(
          detailQuestions
            .sort((a, b) => Number(a.order_index || 0) - Number(b.order_index || 0))
            .map((item) => ({
              id: item.id,
              question_text: item.question_text || "",
              question_type: item.question_type || "text",
              options_text: Array.isArray(item.options) ? item.options.join(", ") : "",
              is_required: Boolean(item.is_required),
              order_index: item.order_index || 0,
            }))
        );
      } catch (error) {
        toast.error(error.message || "Không thể tải thông tin khảo sát");
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchSurveyDetail();
  }, [isOpen, surveyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate and submit logic
    if (onSubmit) {
      onSubmit({
        ...formData,
        is_active: formData.status === "Active",
        questions: questions.map((item) => ({
          id: item.id,
          question_text: item.question_text,
          question_type: item.question_type,
          options: item.question_type === "multiple_choice" ? parseOptionsText(item.options_text) : null,
          is_required: item.is_required,
          order_index: item.order_index,
        })),
      });
    }
    onClose();
  };

  const handleQuestionChange = (id, key, value) => {
    setQuestions((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
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
        <div className="flex items-center justify-between px-6 py-5 border-b bg-indigo-300">
          <h3 className="text-xl font-semibold text-gray-800">
            Cập nhật khảo sát học phần
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-indigo-500 transition-all duration-300 hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
          {loadingDetail && (
            <div className="text-sm text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg">
              Đang tải thông tin khảo sát...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề khảo sát
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endAt"
              value={formData.endAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="pt-2">
            <p className="text-sm font-semibold text-gray-800 mb-2">Câu hỏi khảo sát</p>
            <div className="space-y-3">
              {questions.length === 0 && (
                <div className="text-sm text-gray-500 border border-dashed rounded-lg px-3 py-2">
                  Không có câu hỏi trong khảo sát này.
                </div>
              )}

              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600">Câu {index + 1}</span>
                    <label className="text-xs text-gray-600 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={question.is_required}
                        onChange={(e) => handleQuestionChange(question.id, "is_required", e.target.checked)}
                      />
                      Bắt buộc
                    </label>
                  </div>

                  <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(question.id, "question_text", e.target.value)}
                    className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm"
                    placeholder="Nội dung câu hỏi"
                  />

                  <select
                    value={question.question_type}
                    onChange={(e) => handleQuestionChange(question.id, "question_type", e.target.value)}
                    className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm"
                  >
                    <option value="rating">rating</option>
                    <option value="multiple_choice">multiple_choice</option>
                    <option value="text">text</option>
                  </select>

                  {question.question_type === "multiple_choice" && (
                    <input
                      type="text"
                      value={question.options_text}
                      onChange={(e) => handleQuestionChange(question.id, "options_text", e.target.value)}
                      className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm"
                      placeholder="Các lựa chọn, ngăn cách bằng dấu phẩy"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditSurvey;
