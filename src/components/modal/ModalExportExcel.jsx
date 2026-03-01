import React, { useState } from "react";
import { X, Download } from "lucide-react";

const ModalExportExcel = ({ 
  isOpen, 
  onClose, 
  onExport,
  defaultColumns = []
}) => {
  const availableColumns = [
    { key: 'stt', label: 'STT', enabled: true, fixed: true },
    { key: 'teacher_code', label: 'Mã nhân sự', enabled: true },
    { key: 'full_name', label: 'Họ và tên', enabled: true },
    { key: 'email', label: 'Email', enabled: true },
    { key: 'phone', label: 'Số điện thoại', enabled: true },
    { key: 'dob', label: 'Ngày sinh', enabled: true },
    { key: 'department', label: 'Khoa/Viện', enabled: true },
    { key: 'roles', label: 'Vai trò', enabled: true },
    { key: 'status', label: 'Trạng thái', enabled: true },
    { key: 'user_name', label: 'Username', enabled: true },
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    defaultColumns.length > 0 
      ? defaultColumns 
      : availableColumns.filter(col => col.enabled).map(col => col.key)
  );
  
  const [filename, setFilename] = useState(`danh_sach_nhan_su_${new Date().toISOString().split('T')[0]}`);

  if (!isOpen) return null;

  const handleToggleColumn = (columnKey) => {
    // Không cho phép bỏ chọn STT (fixed)
    const column = availableColumns.find(col => col.key === columnKey);
    if (column?.fixed) return;

    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter(key => key !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const handleDeselectAll = () => {
    // Giữ lại các cột fixed
    setSelectedColumns(availableColumns.filter(col => col.fixed).map(col => col.key));
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      return;
    }
    onExport({ selectedColumns, filename });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-lime-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Xuất dữ liệu Excel
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Tùy chỉnh các cột và tên file xuất
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-lime-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            {/* Filename Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên file <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Nhập tên file"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="text-gray-500 font-medium">.xlsx</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tên file sẽ được tự động thêm đuôi .xlsx
              </p>
            </div>

            {/* Column Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn các cột xuất <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleDeselectAll}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {availableColumns.map((column) => (
                  <label
                    key={column.key}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedColumns.includes(column.key)
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    } ${column.fixed ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.key)}
                      onChange={() => handleToggleColumn(column.key)}
                      disabled={column.fixed}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm ${
                      selectedColumns.includes(column.key) 
                        ? 'text-emerald-900 font-medium' 
                        : 'text-gray-700'
                    }`}>
                      {column.label}
                      {column.fixed && (
                        <span className="text-xs text-gray-500 ml-1">(bắt buộc)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Đã chọn: <span className="font-medium text-emerald-600">{selectedColumns.length}</span> cột
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={selectedColumns.length === 0 || !filename.trim()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalExportExcel;
