# Hướng dẫn sử dụng ModalExcelFormatConfig

## Component định dạng tiêu đề Excel

Component này cho phép tùy chỉnh định dạng và tiêu đề cho file Excel khi xuất.

### Cài đặt

Component đã được tạo tại: `src/components/common/ModalExcelFormatConfig.jsx`

### Tích hợp vào trang

#### 1. Import component

```javascript
import ModalExcelFormatConfig from "../../../components/common/ModalExcelFormatConfig";
```

#### 2. Thêm state cho modal

```javascript
const [modalExcelFormat, setModalExcelFormat] = useState({
  isOpen: false,
  exportData: null
});
```

#### 3. Tạo hàm mở modal

```javascript
const openExcelFormatModal = (dataToExport) => {
  setModalExcelFormat({
    isOpen: true,
    exportData: dataToExport
  });
};

const closeExcelFormatModal = () => {
  setModalExcelFormat({
    isOpen: false,
    exportData: null
  });
};
```

#### 4. Cập nhật hàm export để hiển thị modal format

```javascript
// Thay vì gọi trực tiếp exportAccountsToExcel
const handleExportExcel = ({ selectedColumns, filename }) => {
  // Lấy dữ liệu cần xuất
  const selectedUsers = users.filter(u => selectedIds.includes(u.id));
  
  // Mở modal format config
  openExcelFormatModal({
    data: selectedUsers,
    selectedColumns,
    filename
  });
};
```

#### 5. Xử lý export với format config

```javascript
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

#### 6. Thêm modal vào JSX

```jsx
<ModalExcelFormatConfig
  isOpen={modalExcelFormat.isOpen}
  onClose={closeExcelFormatModal}
  onExport={handleExportWithFormat}
  defaultConfig={{
    title: 'BÁO CÁO DANH SÁCH TÀI KHOẢN',
    subtitle: 'Học kỳ 1 - Năm học 2024-2025',
    organizationName: 'TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM',
    departmentName: 'KHOA CÔNG NGHỆ THÔNG TIN'
  }}
/>
```

### Các tùy chọn cấu hình

#### defaultConfig object:

```javascript
{
  title: 'BÁO CÁO DANH SÁCH',           // Tiêu đề chính (bắt buộc)
  subtitle: '',                          // Tiêu đề phụ
  organizationName: '',                  // Tên trường/đơn vị
  departmentName: '',                    // Tên khoa/phòng ban
  exportDate: new Date().toLocaleDateString('vi-VN'),  // Ngày xuất
  exportBy: '',                          // Người xuất
  note: '',                              // Ghi chú
  showDate: true,                        // Hiển thị ngày xuất
  showPageNumber: true,                  // Hiển thị số trang
  headerColor: '#4CAF50',                // Màu header (5 màu: xanh lá, xanh dương, cam, tím, đỏ)
  fontSize: 'medium'                     // Cỡ chữ: small, medium, large
}
```

### Kết quả file Excel

File Excel xuất ra sẽ có cấu trúc:
1. **Header block** (nếu có formatConfig):
   - Tên trường/đơn vị
   - Tên khoa/phòng ban
   - Tiêu đề chính (in đậm, cỡ lớn)
   - Tiêu đề phụ
   - Ngày xuất và người xuất
   - Ghi chú
   - Dòng trống phân cách

2. **Data table**:
   - Header row với các cột đã chọn
   - Dữ liệu các hàng
   - Auto-adjust column width

### Ví dụ đầy đủ

Xem file tích hợp mẫu tại: `MODAL_EXCEL_FORMAT_EXAMPLE.md`

### Lưu ý

- Modal này độc lập, có thể sử dụng cho bất kỳ trang nào cần xuất Excel
- Component đã responsive, hoạt động tốt trên mobile
- Preview realtime giúp user thấy trước định dạng
- Validation đảm bảo title luôn có giá trị trước khi xuất
