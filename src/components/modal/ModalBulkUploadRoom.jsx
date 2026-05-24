import React, { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet, Trash2, AlertCircle, CheckCircle, Info, FileDown, XCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const ModalBulkUploadRoom = ({ open, onClose, onUpload }) => {
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
        
        const roomData = rows
          .filter(row => row.some(cell => cell !== '')) // Skip empty rows
          .map((row, index) => {
            // Map columns: Mã phòng, Tên phòng, Mô tả, Vị trí 1 x, Vị trí 1 y, Vị trí 2 x, Vị trí 2 y, Vị trí 3 x, Vị trí 3 y, Vị trí 4 x, Vị trí 4 y
            const room_code = String(row[0] || '').trim();
            const room_name = String(row[1] || '').trim();
            const description = String(row[2] || '').trim();
            
            // Parse coordinates
            const coordinates = [
              { x: parseFloat(row[3]) || 0, y: parseFloat(row[4]) || 0 }, // Vị trí 1
              { x: parseFloat(row[5]) || 0, y: parseFloat(row[6]) || 0 }, // Vị trí 2
              { x: parseFloat(row[7]) || 0, y: parseFloat(row[8]) || 0 }, // Vị trí 3
              { x: parseFloat(row[9]) || 0, y: parseFloat(row[10]) || 0 }  // Vị trí 4
            ];
            
            return {
              room_code,
              room_name,
              description: description || null,
              coordinates,
              _originalRow: index + 2 // +2 because: +1 for 0-index, +1 for header
            };
          });
        
        // Validate data - must have room_code and room_name
        const validData = roomData.filter(item => 
          item.room_code && item.room_name
        );
        
        if (validData.length === 0) {
          toast.error("Không có dữ liệu hợp lệ. Vui lòng kiểm tra lại file.");
          setFile(null);
          return;
        }
        
        setParsedData(validData);
        setPreview(validData.slice(0, 5)); // Show first 5 rows for preview
        toast.success(`Đã tải ${validData.length} phòng từ file Excel`);
        
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
    const templateData = [
      ['Mã phòng (Vd: X101), không trùng', 'Tên phòng (Vd X101)', 'Mô tả', 'Vị trí 1 x', 'Vị trí 1 y', 'Vị trí 2 x', 'Vị trí 2 y', 'Vị trí 3 x', 'Vị trí 3 y', 'Vị trí 4 x', 'Vị trí 4 y'],
      ['T1002', 'T1002', 'Phòng lý thuyết', 10, 10, 12, 12, 13, 13, 14, 14],
      ['T1003', 'T1003', 'Phòng lý thuyết', 10, 10, 12, 12, 13, 13, 14, 14],
      ['B3.5', 'Phòng B3.5', 'Phòng giảng dạy', 10.5, 20.3, 20.5, 20.3, 20.5, 30.8, 10.5, 30.8],
      ['A103', 'Phòng A103', 'Phòng thực hành', 30.0, 40.0, 40.0, 40.0, 40.0, 50.0, 30.0, 50.0]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Mã phòng
      { wch: 20 }, // Tên phòng
      { wch: 25 }, // Mô tả
      { wch: 10 }, // Vị trí 1 x
      { wch: 10 }, // Vị trí 1 y
      { wch: 10 }, // Vị trí 2 x
      { wch: 10 }, // Vị trí 2 y
      { wch: 10 }, // Vị trí 3 x
      { wch: 10 }, // Vị trí 3 y
      { wch: 10 }, // Vị trí 4 x
      { wch: 10 }  // Vị trí 4 y
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    XLSX.writeFile(wb, 'Template_Import_Rooms.xlsx');
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
      ['STT', 'Mã phòng', 'Tên phòng', 'Lỗi'],
      ...uploadResult.errors.map((error, index) => [
        index + 1,
        error.room_code || '',
        error.room_name || '',
        error.error || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(errorData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // STT
      { wch: 15 }, // Mã phòng
      { wch: 25 }, // Tên phòng
      { wch: 50 }  // Lỗi
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lỗi Upload');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `Loi_Upload_Rooms_${timestamp}.xlsx`);
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
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-lime-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Upload danh sách phòng học
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Tải lên file Excel để thêm nhiều phòng học cùng lúc
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-lime-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <strong>Mã phòng:</strong> Bắt buộc, không trùng (Vd: T1002, B3.5)
                </li>
                <li>
                  <strong>Tên phòng:</strong> Bắt buộc (Vd: Phòng lý thuyết)
                </li>
                <li>
                  <strong>Tọa độ:</strong> 4 vị trí, mỗi vị trí có x và y<br />
                  - X (longitude): từ -180 đến 180<br />
                  - Y (latitude): từ -90 đến 90
                </li>
                <li>
                  <strong>Mô tả:</strong> Tùy chọn
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
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length} phòng
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
                Xem trước dữ liệu ({preview.length} / {parsedData.length} phòng)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mã phòng</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tên phòng</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Mô tả</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Tọa độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{item.room_code}</td>
                        <td className="px-4 py-2">{item.room_name}</td>
                        <td className="px-4 py-2 text-xs">{item.description || '-'}</td>
                        <td className="px-4 py-2 text-xs">
                          <div className="flex flex-wrap gap-1">
                            {item.coordinates.map((coord, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                                {idx + 1}: ({coord.x}, {coord.y})
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
                  ... và {parsedData.length - 5} phòng khác
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
                        ✓ Thành công: <strong>{uploadResult.successCount}</strong> phòng
                      </p>
                      {uploadResult.failCount > 0 && (
                        <p className="text-red-700">
                          ✗ Thất bại: <strong>{uploadResult.failCount}</strong> phòng
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
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Mã phòng</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Tên phòng</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.errors.map((error, index) => (
                          <tr key={index} className="border-t border-red-100 hover:bg-red-50">
                            <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-2 font-mono text-xs">{error.room_code || '-'}</td>
                            <td className="px-4 py-2 text-xs">{error.room_name || '-'}</td>
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
                      Tải lên ({parsedData.length} phòng)
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
    </>
  );
};

export default ModalBulkUploadRoom;
