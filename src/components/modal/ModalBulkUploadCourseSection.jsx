import React, { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet, Trash2, AlertCircle, CheckCircle, Info, FileDown, XCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const ModalBulkUploadCourseSection = ({ open, onClose, onUpload }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  if (!open) return null;

  const handleChooseFile = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  /**
   * Process Excel file and parse data
   */
  const processFile = (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV");
      return;
    }

    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '' 
        });
        
        if (jsonData.length < 2) {
          toast.error("File không có dữ liệu hợp lệ");
          setFile(null);
          return;
        }
        
        // Parse data (skip header row)
        const rows = jsonData.slice(1);
        
        const courseSectionData = rows
          .filter(row => row.some(cell => cell !== '')) // Skip empty rows
          .map((row, index) => {
            // Map columns: Mã học phần, Tên học phần, Tín chỉ, Học kỳ, Năm học, Sỉ số, Số nhóm TH, Mô tả
            const code = String(row[0] || '').trim();
            const name = String(row[1] || '').trim();
            const credits = parseInt(row[2]) || 0;
            const semester = parseInt(row[3]) || 1;
            const year = parseInt(row[4]) || new Date().getFullYear();
            const maxStudents = parseInt(row[5]) || 0;
            const practiceSessions = parseInt(row[6]) || 0;
            const description = String(row[7] || '').trim();
            
            return {
              code,
              name,
              credits,
              semester: `${year}-${semester}`, // Format: 2026-1
              max_students: maxStudents,
              practice_sessions: practiceSessions,
              description,
              _originalRow: index + 2 // +2 because: +1 for 0-index, +1 for header
            };
          });
        
        // Validate data
        const validData = courseSectionData.filter(item => 
          item.code && item.name && item.credits > 0
        );
        
        if (validData.length === 0) {
          toast.error("Không có dữ liệu hợp lệ. Vui lòng kiểm tra lại file.");
          setFile(null);
          return;
        }
        
        setParsedData(validData);
        setPreview(validData.slice(0, 5)); // Show first 5 rows for preview
        toast.success(`Đã tải ${validData.length} bản ghi từ file Excel`);
        
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast.error("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.");
        setFile(null);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  /**
   * Download Excel template
   */
  const handleDownloadTemplate = () => {
    const currentYear = new Date().getFullYear();
    const templateData = [
      ['Mã học phần', 'Tên học phần', 'Tín chỉ', 'Học kỳ', 'Năm học', 'Sỉ số', 'Số nhóm TH', 'Mô tả'],
      ['INT3104', 'Lập trình tích hợp', 3, 1, currentYear, 60, 3, 'Học phần về lập trình tích hợp các hệ thống'],
      ['INT3105', 'Trí tuệ nhân tạo', 3, 1, currentYear, 50, 2, 'Giới thiệu về AI và machine learning'],
      ['INT3106', 'Cơ sở dữ liệu nâng cao', 4, 2, currentYear, 40, 4, 'Các kỹ thuật nâng cao trong quản trị CSDL']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Mã học phần
      { wch: 30 }, // Tên học phần
      { wch: 10 }, // Tín chỉ
      { wch: 10 }, // Học kỳ
      { wch: 12 }, // Năm học
      { wch: 10 }, // Sỉ số
      { wch: 12 }, // Số nhóm TH
      { wch: 50 }  // Mô tả
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    XLSX.writeFile(wb, 'Template_Import_Course_Sections.xlsx');
    toast.success("Đã tải xuống file mẫu");
  };

  /**
   * Handle file deletion
   */
  const handleDeleteFile = () => {
    setFile(null);
    setParsedData([]);
    setPreview([]);
    setUploadResult(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /**
   * Handle upload
   */
  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error("Vui lòng chọn file để upload");
      return;
    }

    setLoading(true);
    try {
      const result = await onUpload(parsedData);
      
      console.log("Upload result:", result);
      
      // Store result to display errors if any
      // result.data contains: { successCount, failCount, success: [], errors: [] }
      if (result && result.data) {
        setUploadResult(result.data);
        
        // Only clear file if all succeeded
        if (result.data.failCount === 0) {
          setTimeout(() => {
            handleDeleteFile();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Error is already handled in parent component
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download errors as Excel file
   */
  const handleDownloadErrors = () => {
    if (!uploadResult || !uploadResult.errors || uploadResult.errors.length === 0) {
      toast.error("Không có lỗi để tải xuống");
      return;
    }

    const errorData = [
      ['STT', 'Mã học phần', 'Tên học phần', 'Lỗi'],
      ...uploadResult.errors.map((error, index) => {
        return [
          index + 1,
          error.code || '',
          error.name || '',
          error.error || ''
        ];
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(errorData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // STT
      { wch: 15 }, // Mã
      { wch: 40 }, // Tên
      { wch: 60 }  // Lỗi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lỗi Upload');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `Loi_Upload_Course_Sections_${timestamp}.xlsx`);
    toast.success("Đã tải xuống file lỗi");
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    if (loading) return;
    handleDeleteFile();
    setUploadResult(null);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-xl bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-emerald-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Upload danh sách học phần
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Tải lên file Excel để thêm nhiều học phần cùng lúc
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-emerald-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="space-y-4">
          
          {/* Download template section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Lần đầu sử dụng? Tải xuống file mẫu để xem cấu trúc dữ liệu:
              </p>
              <ul className="text-sm text-blue-800 mb-4 list-disc list-inside space-y-2 leading-relaxed">
                <li>
                  <strong>Mã học phần:</strong> Mã định danh duy nhất (ví dụ: INT3104)
                </li>
                <li>
                  <strong>Học kỳ:</strong> Số học kỳ (1 hoặc 2)
                </li>
                <li>
                  <strong>Năm học:</strong> Năm học (ví dụ: 2026)
                </li>
                <li>
                  <strong>Số nhóm TH:</strong> Số nhóm thực hành (0 nếu không có)
                </li>
                <li>
                  <strong>Mô tả:</strong> Mô tả ngắn về học phần (tùy chọn)
                </li>
              </ul>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Tải xuống file mẫu Excel
              </button>
            </div>
          </div>

          {/* Upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors"
          >
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-700 mb-2">
              Kéo thả file Excel vào đây hoặc{" "}
              <button 
                onClick={handleChooseFile} 
                className="text-emerald-600 hover:text-emerald-700 underline font-medium"
              >
                chọn file từ máy
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Hỗ trợ: .xlsx, .xls (Excel 2007 trở lên)
            </p>
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
            />
          </div>

          {/* File info */}
          {file && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length} bản ghi
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteFile}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Xóa file"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Xem trước dữ liệu ({preview.length} / {parsedData.length} bản ghi)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mã</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tên học phần</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tín chỉ</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Học kỳ</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Sỉ số</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Nhóm TH</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-xs">{item.code}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-center">{item.credits}</td>
                        <td className="px-4 py-2 text-center">{item.semester}</td>
                        <td className="px-4 py-2 text-center">{item.max_students}</td>
                        <td className="px-4 py-2 text-center">{item.practice_sessions}</td>
                        <td className="px-4 py-2 text-xs truncate max-w-xs" title={item.description}>{item.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  ... và {parsedData.length - 5} bản ghi khác
                </p>
              )}
            </div>
          )}

          {/* Upload Result Section */}
          {uploadResult && (
            <div>
              <div className={`rounded-lg p-4 ${
                uploadResult.failCount === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start gap-3">
                  {uploadResult.failCount === 0 ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      uploadResult.failCount === 0 ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      Kết quả upload
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="text-green-700">
                        ✓ Thành công: <strong>{uploadResult.successCount}</strong> bản ghi
                      </p>
                      {uploadResult.failCount > 0 && (
                        <p className="text-red-700">
                          ✗ Thất bại: <strong>{uploadResult.failCount}</strong> bản ghi
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details Table */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Chi tiết lỗi ({uploadResult.errors.length})
                    </h3>
                    <button
                      onClick={handleDownloadErrors}
                      className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                      <FileDown className="w-4 h-4" />
                      Tải xuống danh sách lỗi
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto border border-red-200 rounded-lg max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-red-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700 w-12">STT</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Mã học phần</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Tên học phần</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.errors.map((error, index) => {
                          return (
                            <tr key={index} className="border-t border-red-100 hover:bg-red-50">
                              <td className="px-4 py-2 text-gray-600 text-center">{index + 1}</td>
                              <td className="px-4 py-2 font-mono text-sm">{error.code || '-'}</td>
                              <td className="px-4 py-2 text-sm">{error.name || '-'}</td>
                              <td className="px-4 py-2 text-red-700 text-sm">{error.error}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center gap-3">
            {/* Left side - Result summary if exists */}
            {uploadResult && (
              <div className="flex items-center gap-2 text-sm">
                {uploadResult.failCount === 0 ? (
                  <span className="text-green-700 font-medium">
                    ✓ Hoàn tất: {uploadResult.successCount} thành công
                  </span>
                ) : (
                  <span className="text-yellow-700 font-medium">
                    {uploadResult.successCount} thành công, {uploadResult.failCount} lỗi
                  </span>
                )}
              </div>
            )}
            
            {/* Right side - Buttons */}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadResult && uploadResult.failCount === 0 ? 'Đóng' : 'Hủy'}
              </button>
              
              {!uploadResult && (
                <button
                  onClick={handleUpload}
                  disabled={loading || parsedData.length === 0}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Tải lên ({parsedData.length} bản ghi)
                    </>
                  )}
                </button>
              )}
              
              {uploadResult && uploadResult.failCount > 0 && (
                <button
                  onClick={() => {
                    setUploadResult(null);
                    handleDeleteFile();
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalBulkUploadCourseSection;
