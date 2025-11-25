import React, { useRef, useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";

const ModalUpload = ({ open, onClose }) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  if (!open) return null;

  const handleChooseFile = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    console.log("Uploading files:", files);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-1">Upload Files</h2>
        <p className="text-sm text-gray-600 mb-6">
          Easily upload files to your account with just a few clicks.
        </p>

        {/* Drag & drop area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-yellow-500 rounded-lg h-48 flex flex-col items-center justify-center text-gray-500 hover:border-yellow-200"
        >
          <Upload className="w-10 h-10 mb-2" />

          <p>Drag and Drop or{" "}
            <button onClick={handleChooseFile} className="text-blue-500 underline">
              Chọn tệp từ máy
            </button>
          </p>
          <p className="text-xs mt-1">Hệ thống cho phép tải lên: .png, .jpg, .svg,.xlsx</p>

          <input
            type="file"
            multiple
            ref={inputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* File preview */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {files.map((file, i) => (
            <div key={i} className="border rounded-lg p-3 flex items-center gap-3">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="btn-info"
          >
            Upload
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalUpload;
