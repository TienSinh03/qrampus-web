# Hệ thống định dạng tiêu đề Excel

## Tổng quan

Đã tạo một hệ thống hoàn chỉnh để định dạng và tùy chỉnh tiêu đề cho file Excel khi xuất.

## Files đã tạo

### 1. Component Modal
📁 `src/components/common/ModalExcelFormatConfig.jsx`
- Modal cho phép user cấu hình tiêu đề và định dạng Excel
- Giao diện đẹp, responsive
- Preview realtime
- Validation input

### 2. Hàm Export được cập nhật
📁 `src/utils/excelExport.js`
- Cập nhật `exportToExcel()` để hỗ trợ formatConfig
- Cập nhật `exportPersonnelToExcel()` với parameter formatConfig
- Cập nhật `exportRoomsToExcel()` với parameter formatConfig  
- Cập nhật `exportAccountsToExcel()` với parameter formatConfig

### 3. Tài liệu hướng dẫn
📁 `MODAL_EXCEL_FORMAT_GUIDE.md` - Hướng dẫn sử dụng component
📁 `MODAL_EXCEL_FORMAT_EXAMPLE.md` - Ví dụ tích hợp đầy đủ

## Tính năng

### ✨ Cấu hình tiêu đề
- Tên trường/đơn vị
- Tên khoa/phòng ban
- Tiêu đề chính (bắt buộc)
- Tiêu đề phụ
- Ngày xuất
- Người xuất
- Ghi chú

### 🎨 Tùy chọn hiển thị
- Chọn hiển thị/ẩn ngày xuất
- Chọn hiển thị/ẩn số trang
- Chọn màu header (5 màu: xanh lá, xanh dương, cam, tím, đỏ)
- Chọn cỡ chữ (nhỏ, trung bình, lớn)

### 👁️ Preview
- Xem trước định dạng realtime
- Cập nhật ngay khi thay đổi

## Cách sử dụng

### Bước 1: Import component
```javascript
import ModalExcelFormatConfig from "../../../components/common/ModalExcelFormatConfig";
```

### Bước 2: Thêm state
```javascript
const [modalExcelFormat, setModalExcelFormat] = useState({
  isOpen: false,
  exportData: null
});
```

### Bước 3: Thêm handlers
```javascript
const openExcelFormatModal = (exportData) => {
  setModalExcelFormat({ isOpen: true, exportData });
};

const handleExportWithFormat = (formatConfig) => {
  const { data, selectedColumns, filename } = modalExcelFormat.exportData;
  exportAccountsToExcel(data, filename, selectedColumns, formatConfig);
  toast.success("Xuất Excel thành công!");
};
```

### Bước 4: Thêm modal vào JSX
```jsx
<ModalExcelFormatConfig
  isOpen={modalExcelFormat.isOpen}
  onClose={() => setModalExcelFormat({ isOpen: false, exportData: null })}
  onExport={handleExportWithFormat}
  defaultConfig={{
    title: 'BÁO CÁO DANH SÁCH',
    organizationName: 'TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM',
    departmentName: 'KHOA CÔNG NGHỆ THÔNG TIN'
  }}
/>
```

## Kết quả

File Excel xuất ra sẽ có cấu trúc:

```
┌────────────────────────────────────────┐
│  TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM     │
│  KHOA CÔNG NGHỆ THÔNG TIN              │
│                                         │
│    BÁO CÁO DANH SÁCH TÀI KHOẢN         │
│    Học kỳ 1 - Năm học 2024-2025        │
│                                         │
│  Ngày xuất: 03/03/2026                 │
│  Người xuất: Admin                     │
│                                         │
├─────┬────────┬──────────┬──────────────┤
│ STT │ Mã GV  │ Họ tên   │ Email        │
├─────┼────────┼──────────┼──────────────┤
│  1  │ 200012 │ Nguyễn A │ a@iuh.edu.vn │
│  2  │ 200013 │ Trần B   │ b@iuh.edu.vn │
└─────┴────────┴──────────┴──────────────┘
```

## Tích hợp vào các trang hiện có

Component này có thể tích hợp vào:
- ✅ AdminAccountPage (Tài khoản)
- ✅ AdminRoomPage (Phòng học)
- ✅ AdminTeacherPage (Giảng viên)
- ✅ Bất kỳ trang nào cần xuất Excel

## Luồng hoạt động

```
User click Export 
    ↓
Mở Modal chọn cột (ModalExportAccountExcel)
    ↓
User chọn cột → Click "Xuất Excel"
    ↓
Mở Modal cấu hình format (ModalExcelFormatConfig)
    ↓
User cấu hình tiêu đề, định dạng → Click "Xuất Excel"
    ↓
File Excel được tạo với format đẹp → Download
```

## Auto-features

- ✅ Auto-adjust column width
- ✅ Validation input (title bắt buộc)
- ✅ Default config có thể tùy chỉnh
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Preview realtime

## Customization

### Thay đổi màu mặc định
Edit trong `defaultConfig`:
```javascript
headerColor: '#2196F3'  // Xanh dương
```

### Thêm màu mới
Edit trong `ModalExcelFormatConfig.jsx`:
```jsx
{['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'].map(color => (
  // ... color picker buttons
))}
```

### Thay đổi cỡ chữ
Edit options trong select:
```jsx
<option value="small">Nhỏ (10pt)</option>
<option value="medium">Trung bình (12pt)</option>
<option value="large">Lớn (14pt)</option>
<option value="xlarge">Rất lớn (16pt)</option>
```

## Best Practices

1. **Sử dụng defaultConfig hợp lý**: Điền sẵn thông tin phổ biến để user không phải nhập lại
2. **Tự động điền user**: Lấy thông tin người xuất từ session/auth
3. **Dynamic title**: Tạo title dựa trên filters đang active
4. **Save config**: Lưu config vào localStorage cho lần sau

## Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## Dependencies

- `lucide-react` - Icons
- `xlsx` (SheetJS) - Excel generation
- React 18+
- TailwindCSS

## Next Steps

Để sử dụng trong project:
1. Đọc `MODAL_EXCEL_FORMAT_GUIDE.md` để hiểu cách hoạt động
2. Xem `MODAL_EXCEL_FORMAT_EXAMPLE.md` để có code mẫu đầy đủ
3. Copy code example và tích hợp vào trang cần xuất Excel
4. Customize defaultConfig cho phù hợp với từng trang

## Support

Nếu gặp vấn đề:
1. Check console log
2. Verify formatConfig được truyền đúng
3. Đảm bảo modal z-index không bị conflict
4. Test với data nhỏ trước

---

**Tạo ngày:** 03/03/2026  
**Version:** 1.0.0  
**Status:** ✅ Ready to use
