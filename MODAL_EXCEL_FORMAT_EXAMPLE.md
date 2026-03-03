# Ví dụ tích hợp ModalExcelFormatConfig vào AdminAccountPage

## Code hoàn chỉnh

### 1. Import statements (thêm vào đầu file)

```javascript
import ModalExcelFormatConfig from "../../../components/common/ModalExcelFormatConfig";
```

### 2. Thêm state (trong component)

```javascript
// Thêm vào phần Modal states
const [modalExportExcel, setModalExportExcel] = useState({ 
  isOpen: false, 
  data: [] 
});
const [modalExcelFormat, setModalExcelFormat] = useState({
  isOpen: false,
  exportData: null
});
```

### 3. Thêm các handler functions

```javascript
// Modal Excel Format handlers
const openExcelFormatModal = (exportData) => {
  setModalExcelFormat({
    isOpen: true,
    exportData
  });
};

const closeExcelFormatModal = () => {
  setModalExcelFormat({
    isOpen: false,
    exportData: null
  });
};

// Cập nhật handleExportExcel để mở modal format
const handleExportExcel = ({ selectedColumns, filename }) => {
  try {
    // Lưu thông tin để xuất sau khi user cấu hình format
    openExcelFormatModal({
      data: modalExportExcel.data,
      selectedColumns,
      filename
    });
    
    // Đóng modal chọn cột
    closeExportExcelModal();
  } catch (error) {
    console.error("Error preparing export:", error);
    toast.error("Không thể chuẩn bị xuất file Excel!");
  }
};

// Handler để xuất với format config
const handleExportWithFormat = (formatConfig) => {
  try {
    const { data, selectedColumns, filename } = modalExcelFormat.exportData;
    
    // Gọi hàm export với formatConfig
    exportAccountsToExcel(data, filename, selectedColumns, formatConfig);
    
    toast.success(`Đã xuất ${data.length} tài khoản ra file Excel thành công`);
    closeExcelFormatModal();
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Không thể xuất file Excel. Vui lòng thử lại!");
  }
};
```

### 4. Thêm modal vào JSX (trước closing tag của component)

```jsx
{/* Modal Export Excel - Chọn cột */}
<ModalExportAccountExcel
  isOpen={modalExportExcel.isOpen}
  onClose={closeExportExcelModal}
  onExport={handleExportExcel}
/>

{/* Modal Excel Format Config - Cấu hình định dạng */}
<ModalExcelFormatConfig
  isOpen={modalExcelFormat.isOpen}
  onClose={closeExcelFormatModal}
  onExport={handleExportWithFormat}
  defaultConfig={{
    title: 'BÁO CÁO DANH SÁCH TÀI KHOẢN',
    subtitle: `Học kỳ 1 - Năm học ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    organizationName: 'TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM',
    departmentName: 'KHOA CÔNG NGHỆ THÔNG TIN',
    exportDate: new Date().toLocaleDateString('vi-VN'),
    exportBy: '', // Có thể lấy từ user đang đăng nhập
    note: '',
    showDate: true,
    showPageNumber: true,
    headerColor: '#4CAF50',
    fontSize: 'medium'
  }}
/>
```

## Luồng hoạt động

1. User click button Excel → Mở `ModalExportAccountExcel` (chọn cột)
2. User chọn các cột muốn xuất, nhập tên file → Click "Xuất Excel"
3. Đóng `ModalExportAccountExcel` → Mở `ModalExcelFormatConfig`
4. User cấu hình tiêu đề, định dạng → Click "Xuất Excel"
5. File Excel được tạo với định dạng đẹp và download về máy

## Kết quả file Excel

```
┌─────────────────────────────────────────────────┐
│  TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM              │
│  KHOA CÔNG NGHỆ THÔNG TIN                       │
│                                                  │
│       BÁO CÁO DANH SÁCH TÀI KHOẢN               │
│       Học kỳ 1 - Năm học 2024-2025              │
│                                                  │
│  Ngày xuất: 03/03/2026   Người xuất: Admin      │
│  Ghi chú: Danh sách tài khoản tính đến 03/2026  │
│                                                  │
├─────┬──────────┬────────────┬─────────────┬─────┤
│ STT │ Mã GV/SV │ Họ và tên  │ Email       │ ... │
├─────┼──────────┼────────────┼─────────────┼─────┤
│  1  │ 20001234 │ Nguyễn VĂA │ a@iuh.edu.vn│ ... │
│  2  │ 20001235 │ Trần Văn B │ b@iuh.edu.vn│ ... │
│ ... │   ...    │    ...     │     ...     │ ... │
└─────┴──────────┴────────────┴─────────────┴─────┘
```

## Tùy chỉnh cho các trang khác

### AdminRoomPage

```javascript
defaultConfig={{
  title: 'BÁO CÁO DANH SÁCH PHÒNG HỌC',
  subtitle: `Niên học ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  organizationName: 'TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM',
  departmentName: 'PHÒNG QUẢN LÝ CƠ SỞ VẬT CHẤT',
}}
```

### AdminTeacherPage

```javascript
defaultConfig={{
  title: 'BÁO CÁO DANH SÁCH GIẢNG VIÊN',
  subtitle: 'Khoa Công Nghệ Thông Tin',
  organizationName: 'TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM',
  departmentName: 'PHÒNG TỔ CHỨC - HÀNH CHÍNH',
}}
```

## Tips

1. **Lưu config mặc định**: Có thể lưu config vào localStorage để lần sau không phải nhập lại
2. **Dynamic title**: Tạo title tự động dựa trên filters đang áp dụng
3. **User info**: Tự động điền "Người xuất" từ thông tin user đang đăng nhập
4. **Validation**: Component đã có validation sẵn, đảm bảo title không trống

## Troubleshooting

### Modal không hiển thị
- Kiểm tra z-index (modal dùng z-999 và z-1000)
- Đảm bảo isOpen được set đúng

### Export không có format
- Đảm bảo formatConfig được truyền vào hàm exportAccountsToExcel
- Check console log xem có error không

### Cột bị lỗi width
- Điều chỉnh maxWidth trong logic auto-width (hiện tại là 50)
- Hoặc set fixed width cho từng cột cụ thể
