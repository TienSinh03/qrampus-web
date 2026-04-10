import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Select from "react-select";
import { Send, Users, Info } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const lecturerOptions = [
  { value: "gv1", label: "GV. Nguyễn Văn A" },
  { value: "gv2", label: "GV. Trần Thị B" },
];

const subjectOptions = [
  { value: "hp1", label: "Lập trình Web - Nhóm 01" },
  { value: "hp2", label: "Cơ sở dữ liệu - Nhóm 05" },
];

const studentOptions = [
  { value: "sv1", label: "SV. Nguyễn Minh Anh - 22110001" },
  { value: "sv2", label: "SV. Trần Quốc Bảo - 22110002" },
  { value: "sv3", label: "SV. Lê Khánh Chi - 22110003" },
];

const AdminAnnouncementPage = () => {
  const [lecturerType, setLecturerType] = useState("all");
  const [studentTargetType, setStudentTargetType] = useState("all");

  const [selectedLecturers, setSelectedLecturers] = useState([]);
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
      <div className="max-w-7xl mx-auto">
        <Tabs.Root defaultValue="lecturer">
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
                          placeholder="Tìm tên giảng viên..."
                          onChange={setSelectedLecturers}
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
                      <p>Người gửi: <span className="text-slate-700">ABCXDRFXYX</span></p>
                      <p>Quyền: <span className="text-slate-700">Quản trị viên</span></p>
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
        </Tabs.Root>
      </div>
    </div>
  );
};

export default AdminAnnouncementPage;