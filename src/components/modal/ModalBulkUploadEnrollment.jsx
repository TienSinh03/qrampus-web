import React, { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileDown,
  FileSpreadsheet,
  Info,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const ModalBulkUploadEnrollment = ({ open, onClose, onUpload }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  if (!open) return null;

  const normalizeUploadResult = (result) => {
    const payload = result?.data?.data
      ? result.data
      : result?.data
        ? result
        : result?.response?.data
          ? result.response
          : result || {};

    const summary = payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload;

    const errors = Array.isArray(payload?.errors)
      ? payload.errors
      : Array.isArray(summary?.errors)
        ? summary.errors
        : [];

    return {
      total: Number(summary?.total || 0),
      success: Number(summary?.success || summary?.successCount || 0),
      failed: Number(summary?.failed || summary?.failCount || errors.length || 0),
      created: Array.isArray(summary?.created) ? summary.created : [],
      errors,
      message: payload?.message || result?.message || "",
    };
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        if (jsonData.length < 2) {
          toast.error("File không có dữ liệu hợp lệ");
          setFile(null);
          return;
        }

        const rows = jsonData.slice(1);

        const enrollments = rows
          .filter((row) => row.some((cell) => String(cell).trim() !== ""))
          .map((row, index) => {
            const mssv = String(row[0] || "").trim();
            const course_section_code = String(row[1] || "").trim();
            const rawPracticeGroup = row[2];

            let practice_group_number = null;
            if (rawPracticeGroup !== "" && rawPracticeGroup !== null && rawPracticeGroup !== undefined) {
              const parsedPracticeGroup = Number(rawPracticeGroup);
              practice_group_number = Number.isFinite(parsedPracticeGroup)
                ? parsedPracticeGroup
                : null;
            }

            return {
              mssv,
              course_section_code,
              ma_hoc_phan: course_section_code,
              ...(practice_group_number ? { practice_group_number } : {}),
              _originalRow: index + 2,
            };
          });

        const validData = enrollments.filter((item) => item.mssv && item.course_section_code);

        if (validData.length === 0) {
          toast.error("Không có dữ liệu hợp lệ. Vui lòng kiểm tra lại file.");
          setFile(null);
          return;
        }

        setParsedData(validData);
        setPreview(validData.slice(0, 8));
        toast.success(`Đã tải ${validData.length} bản ghi từ file Excel`);
      } catch (error) {
        console.error("Error parsing enrollments excel:", error);
        toast.error("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.");
        setFile(null);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["MSSV", "Mã học phần", "Nhóm thực hành (tùy chọn)"],
      ["21210002", "12345678910", 3],
      ["21210002", "12345678910", ""],
      ["21210013", "12345678910", ""],
      ["21210008", "12345678910", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    ws["!cols"] = [{ wch: 16 }, { wch: 20 }, { wch: 28 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Import_Enrollments.xlsx");
    toast.success("Đã tải xuống file mẫu");
  };

  const handleDeleteFile = () => {
    setFile(null);
    setParsedData([]);
    setPreview([]);
    setUploadResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error("Vui lòng chọn file để upload");
      return;
    }

    setLoading(true);
    try {
      const result = await onUpload(parsedData);
      setUploadResult(normalizeUploadResult(result));
    } catch (error) {
      console.error("Bulk upload enrollments error:", error);
      setUploadResult(normalizeUploadResult(error));
      toast.error(error?.message || "Upload thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const getSummary = () => {
    const total = uploadResult?.total ?? 0;
    const success = uploadResult?.success ?? uploadResult?.successCount ?? 0;
    const failed = uploadResult?.failed ?? uploadResult?.failCount ?? 0;
    return { total, success, failed };
  };

  const handleDownloadErrors = () => {
    const errors = uploadResult?.errors;
    if (!Array.isArray(errors) || errors.length === 0) {
      toast.error("Không có lỗi để tải xuống");
      return;
    }

    const errorData = [
      ["STT", "Index", "MSSV", "Student Code", "Mã học phần", "Nhóm thực hành", "Status Code", "Message", "Details"],
      ...errors.map((error, index) => [
        index + 1,
        error?.index ?? "",
        error?.mssv || error?.student_code || "",
        error?.student_code || error?.mssv || "",
        error?.ma_hoc_phan || error?.course_section_code || "",
        error?.practice_group_number ?? "",
        error?.statusCode ?? "",
        error?.message || error?.error || "",
        error?.details ? JSON.stringify(error.details) : "",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(errorData);
    ws["!cols"] = [{ wch: 5 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 60 }, { wch: 50 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loi Upload");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    XLSX.writeFile(wb, `Loi_Upload_Enrollments_${timestamp}.xlsx`);
    toast.success("Đã tải xuống file lỗi");
  };

  const handleClose = () => {
    if (loading) return;
    handleDeleteFile();
    onClose();
  };

  const summary = getSummary();

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={handleClose} />

      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-xl bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-indigo-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Upload đăng ký học phần</h3>
            <p className="text-sm text-gray-600 mt-1">Import danh sách đăng ký từ file Excel và gọi API bulk</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-indigo-300 transition-all duration-300 p-2 hover:rotate-90 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto pb-32 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-2">Dữ liệu upload sẽ gửi theo cấu trúc:</p>
              <pre className="text-xs bg-white border border-blue-100 rounded p-2 text-blue-900 overflow-x-auto">{`{
  "enrollments": [
    {
      "mssv": "21210002",
      "ma_hoc_phan": "12345678910",
      "practice_group_number": 3
    }
  ]
}`}</pre>
              <button
                onClick={handleDownloadTemplate}
                className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Tải xuống file mẫu Excel
              </button>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors"
          >
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-700 mb-2">
              Kéo thả file Excel vào đây hoặc{" "}
              <button onClick={handleChooseFile} className="text-indigo-600 hover:text-indigo-700 underline font-medium">
                chọn file từ máy
              </button>
            </p>
            <p className="text-xs text-gray-500">Hỗ trợ: .xlsx, .xls, .csv</p>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={inputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {file && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB | {parsedData.length} bản ghi hợp lệ</p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteFile}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {preview.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">Xem trước dữ liệu (tối đa 8 dòng)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">MSSV</th>
                      <th className="px-4 py-2 text-left">Mã học phần</th>
                      <th className="px-4 py-2 text-left">Nhóm TH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2">{item.mssv}</td>
                        <td className="px-4 py-2">{item.course_section_code}</td>
                        <td className="px-4 py-2">{item.practice_group_number ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="space-y-3">
              {summary.failed > 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">Upload hoàn tất với một số lỗi</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Tổng: {summary.total} | Thành công: {summary.success} | Lỗi: {summary.failed}
                      </p>
                      <button
                        onClick={handleDownloadErrors}
                        className="mt-3 flex items-center gap-2 bg-yellow-600 text-white px-3 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm"
                      >
                        <FileDown className="w-4 h-4" />
                        Tải file lỗi
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Upload thành công</p>
                      <p className="text-sm text-green-700 mt-1">
                        Đã thêm {summary.success} bản ghi đăng ký học phần.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 inline mr-1" />
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || parsedData.length === 0}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 inline mr-1" />
            {loading ? "Đang upload..." : "Upload dữ liệu"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalBulkUploadEnrollment;
