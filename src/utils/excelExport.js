import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Export personnel data to Excel
 * @param {Array} personnels - Array of personnel objects
 * @param {string} filename - Name of the file
 * @param {Array} selectedColumns - Array of column keys to export
 */
export const exportPersonnelToExcel = (personnels, filename = 'danh_sach_nhan_su', selectedColumns = null) => {
  try {
    // Column mapping
    const columnMapping = {
      stt: (personnel, index) => index + 1,
      teacher_code: (personnel) => personnel.teacher_code || '-',
      full_name: (personnel) => personnel.full_name || '-',
      email: (personnel) => personnel.email || '-',
      phone: (personnel) => personnel.phone || '-',
      dob: (personnel) => personnel.dob || '-',
      department: (personnel) => personnel.department || '-',
      roles: (personnel) => personnel.user?.roles?.map(r => {
        const roleMap = {
          teacher: 'Giảng viên',
          admin: 'Quản trị viên',
          attendance_staff: 'Ban chấm công'
        };
        return roleMap[r.name] || r.name;
      }).join(', ') || '-',
      status: (personnel) => personnel.user?.status === 'active' ? 'Hoạt động' : 
                              personnel.user?.status === 'inactive' ? 'Tạm ngưng' : '-',
      user_name: (personnel) => personnel.user?.user_name || '-',
    };

    // Column labels
    const columnLabels = {
      stt: 'STT',
      teacher_code: 'Mã nhân sự',
      full_name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      dob: 'Ngày sinh',
      department: 'Khoa/Viện',
      roles: 'Vai trò',
      status: 'Trạng thái',
      user_name: 'Username',
    };

    // If no columns specified, export all
    const columnsToExport = selectedColumns || Object.keys(columnMapping);

    // Transform data for Excel export
    const excelData = personnels.map((personnel, index) => {
      const row = {};
      columnsToExport.forEach(colKey => {
        if (columnMapping[colKey]) {
          row[columnLabels[colKey]] = columnMapping[colKey](personnel, index);
        }
      });
      return row;
    });
    
    exportToExcel(excelData, filename, 'Danh sách nhân sự');
    return true;
  } catch (error) {
    console.error('Error exporting personnel to Excel:', error);
    throw error;
  }
};

export default {
  exportToExcel,
  exportPersonnelToExcel
};
