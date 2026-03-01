import React, { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet, Trash2, AlertCircle, CheckCircle, Info, FileDown, XCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const ModalBulkUploadPersonnel = ({ open, onClose, onUpload }) => {
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
        
        const personnelData = rows
          .filter(row => row.some(cell => cell !== '')) // Skip empty rows
          .map((row, index) => {
            // Map columns: Mã giảng viên, Họ và tên, Ngày sinh, Khoa/Viện, Email, Số điện thoại, Phân quyền
            const code = String(row[0] || '').trim();
            const fullName = String(row[1] || '').trim();
            const dob = row[2] ? formatDate(row[2]) : '';
            const department = String(row[3] || '').trim();
            const email = String(row[4] || '').trim();
            const phone = String(row[5] || '').trim();
            const roles = String(row[6] || '').trim();
            
            const parsedRoles = parseRoles(roles);
            return {
              code,
              full_name: fullName,
              dob,
              department,
              email,
              phone,
              // Send roles as array if multiple, or role as string if single
              ...(parsedRoles.length > 1 ? { roles: parsedRoles } : { role: parsedRoles[0] }),
              _originalRow: index + 2 // +2 because: +1 for 0-index, +1 for header
            };
          });
        
        // Validate data
        const validData = personnelData.filter(item => 
          item.code && item.full_name && item.email
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
   * Format date from Excel serial or string to YYYY-MM-DD
   * Supports: dd-MM-yyyy, dd/MM/yyyy, Excel serial, YYYY-MM-DD
   */
  const formatDate = (value) => {
    if (!value) return '';
    
    // If it's an Excel serial date (number)
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        const year = date.y;
        const month = String(date.m).padStart(2, '0');
        const day = String(date.d).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    
    // If it's a string date
    const strValue = String(value).trim();
    
    // Pattern 1: dd/MM/yyyy or dd-MM-yyyy (e.g., 04/11/1993, 4-11-1993)
    // eslint-disable-next-line no-useless-escape
    const datePattern1 = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
    
    // Pattern 2: yyyy/MM/dd or yyyy-MM-dd (e.g., 1993/11/04, 1993-11-04)
    // eslint-disable-next-line no-useless-escape
    const datePattern2 = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
    
    // Try pattern 1: dd/MM/yyyy or dd-MM-yyyy
    let match = strValue.match(datePattern1);
    if (match) {
      const [, day, month, year] = match;
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      
      // Validate day and month ranges
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
        return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    }
    
    // Try pattern 2: yyyy/MM/dd or yyyy-MM-dd
    match = strValue.match(datePattern2);
    if (match) {
      const [, year, month, day] = match;
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      
      // Validate day and month ranges
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
        return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    }
    
    // If no pattern matches, return as is
    return strValue;
  };

  /**
   * Parse roles from string (can be comma-separated for multiple roles)
   */
  const parseRoles = (rolesStr) => {
    if (!rolesStr) return ['teacher']; // Default role as array
    
    const roleMap = {
      'teacher': 'teacher',
      'giảng viên': 'teacher',
      'giang vien': 'teacher',
      'admin': 'admin',
      'quản trị viên': 'admin',
      'quan tri vien': 'admin',
      'attendance_staff': 'attendance_staff',
      'nhân viên chấm công': 'attendance_staff',
      'nhan vien cham cong': 'attendance_staff',
      'ban chấm công': 'attendance_staff',
      'ban cham cong': 'attendance_staff'
    };
    
    // Split by comma for multiple roles
    const roles = rolesStr.toLowerCase().split(',').map(r => r.trim());
    const mappedRoles = roles
      .map(r => roleMap[r])
      .filter(r => r);
    
    // Return array of roles or default to teacher
    return mappedRoles.length > 0 ? mappedRoles : ['teacher'];
  };

  /**
   * Download Excel template
   */
  const handleDownloadTemplate = () => {
    const templateData = [
      ['Mã giảng viên', 'Họ và tên', 'Ngày sinh', 'Khoa/Viện', 'Email', 'Số điện thoại', 'Phân quyền'],
      ['12312345', 'Nguyễn Văn Dũng', '1993-11-04', 'Khoa Công nghệ thông tin', 'nguyenvandung@iuh.edu.vn', '0123456789', 'teacher'],
      ['12312346', 'Trần Quang Hà', '1993-11-04', 'Khoa Khoa học Cơ bản', 'tranquangha@iuh.edu.vn', '0123456790', 'teacher'],
      ['12312347', 'IUH Admin', '1993-11-05', 'Khoa Khoa học Cơ bản', 'iuhadmin@iuh.edu.vn', '0123456791', 'attendance_staff, admin']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Mã giảng viên
      { wch: 25 }, // Họ và tên
      { wch: 12 }, // Ngày sinh
      { wch: 30 }, // Khoa/Viện
      { wch: 30 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 20 }  // Phân quyền
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    XLSX.writeFile(wb, 'Template_Import_Personnel.xlsx');
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
      // Store result to display errors if any
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
      ['STT', 'Mã giảng viên', 'Email', 'Lỗi'],
      ...uploadResult.errors.map((error, index) => [
        index + 1,
        error.code || '',
        error.email || '',
        error.error || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(errorData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // STT
      { wch: 15 }, // Mã
      { wch: 30 }, // Email
      { wch: 50 }  // Lỗi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lỗi Upload');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `Loi_Upload_Personnel_${timestamp}.xlsx`);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload danh sách nhân sự</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tải lên file Excel để thêm nhiều giảng viên cùng lúc
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out p-2 hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Download template section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Lần đầu sử dụng? Tải xuống file mẫu để xem cấu trúc dữ liệu:
              </p>
              <ul className="text-xs text-blue-700 mb-3 list-disc list-inside space-y-1">
                <li><strong>Ngày sinh:</strong> Hỗ trợ nhiều định dạng: dd-MM-yyyy, dd/MM/yyyy, hoặc yyyy-MM-dd (ví dụ: 04-11-1993, 04/11/1993, 1993-11-04)</li>
                <li><strong>Phân quyền:</strong> Có thể có nhiều quyền cách nhau bởi dấu phẩy (ví dụ: attendance_staff, admin)</li>
                <li><strong>Các quyền hợp lệ:</strong> teacher, admin, attendance_staff</li>
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
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          >
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-700 mb-2">
              Kéo thả file Excel vào đây hoặc{" "}
              <button 
                onClick={handleChooseFile} 
                className="text-blue-600 hover:text-blue-700 underline font-medium"
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
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
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
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Xem trước dữ liệu ({preview.length} / {parsedData.length} bản ghi)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mã</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Họ tên</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Ngày sinh</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Khoa/Viện</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">SĐT</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2">{item.code}</td>
                        <td className="px-4 py-2">{item.full_name}</td>
                        <td className="px-4 py-2">{item.dob}</td>
                        <td className="px-4 py-2 text-xs">{item.department}</td>
                        <td className="px-4 py-2 text-xs">{item.email}</td>
                        <td className="px-4 py-2">{item.phone}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {(item.roles || [item.role]).map((role, idx) => (
                              <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${
                                role === 'admin' ? 'bg-red-100 text-red-700' :
                                role === 'attendance_staff' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
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
            <div className="mt-6">
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
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Mã</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.errors.map((error, index) => (
                          <tr key={index} className="border-t border-red-100 hover:bg-red-50">
                            <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-2 font-mono text-xs">{error.code || '-'}</td>
                            <td className="px-4 py-2 text-xs">{error.email || '-'}</td>
                            <td className="px-4 py-2 text-red-700 text-xs">{error.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 px-6 py-4 border-t bg-gray-50">
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
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadResult && uploadResult.failCount === 0 ? 'Đóng' : 'Hủy'}
            </button>
            
            {!uploadResult && (
              <button
                onClick={handleUpload}
                disabled={loading || parsedData.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBulkUploadPersonnel;
