import React, { useState } from "react";
import Select from "react-select";
import { Send, Info } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const subjectOptions = [
  { value: "hp1", label: "Lập trình Web - Nhóm 01" },
  { value: "hp2", label: "Cơ sở dữ liệu - Nhóm 05" },
];

const studentOptions = [
  { value: "sv1", label: "SV. Nguyễn Minh Anh - 22110001" },
  { value: "sv2", label: "SV. Trần Quốc Bảo - 22110002" },
  { value: "sv3", label: "SV. Lê Khánh Chi - 22110003" },
];

const AnnouncementPage = () => {
  const [studentTargetType, setStudentTargetType] = useState("students");

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
                      <option value="subjects">1 hoặc nhiều học phần</option>
                    </select>
                  </div>

                  {studentTargetType === "students" ? (
                    <div className="animate-in fade-in duration-500">
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Danh sách sinh viên</label>
                      <Select
                        options={studentOptions}
                        isMulti
                        styles={customSelectStyles}
                        placeholder="Tìm và chọn sinh viên..."
                        onChange={setSelectedStudents}
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
                        placeholder="Chọn một hoặc nhiều học phần..."
                        onChange={setSelectedSubjects}
                        className="text-sm"
                      />
                    </div>
                  ) : null}
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
                      <p>Người gửi: <span className="text-slate-700">ABCXDRFXYX</span></p>
                      <p>Quyền: <span className="text-slate-700">Giảng viên</span></p>
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
                  <button className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest transition-all shadow-lg active:transform active:scale-95">
                    <Send size={16} />
                    Gửi thông báo ngay
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