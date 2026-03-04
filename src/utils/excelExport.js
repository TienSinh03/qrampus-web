import * as XLSX from 'xlsx';

/**
 * Core function to export data to Excel
 */
const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-width columns
    const columnWidths = [];
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key, index) => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => {
            const cellValue = row[key];
            return cellValue ? String(cellValue).length : 0;
          })
        );
        columnWidths[index] = { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = columnWidths;
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Generate Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Export personnel/teachers to Excel
 */
export const exportPersonnelToExcel = (personnels, filename = 'danh_sach_nhan_su', selectedColumns = []) => {
  const columnMapping = {
    stt: 'STT',
    teacher_code: 'Mã nhân sự',
    full_name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    dob: 'Ngày sinh',
    department: 'Khoa/Viện',
    roles: 'Vai trò',
    status: 'Trạng thái',
    user_name: 'Username'
  };

  // Build data with selected columns
  const data = personnels.map((person, index) => {
    const row = {};
    
    selectedColumns.forEach(columnKey => {
      const label = columnMapping[columnKey];
      
      if (columnKey === 'stt') {
        row[label] = index + 1;
      } else if (columnKey === 'roles') {
        // Roles are nested in person.user.roles
        if (person.user?.roles && Array.isArray(person.user.roles)) {
          const roleMapping = {
            teacher: 'Giảng viên',
            admin: 'Quản trị viên',
            attendance_staff: 'Ban chấm công'
          };
          row[label] = person.user.roles.map(role => roleMapping[role.name] || role.name).join(', ');
        } else {
          row[label] = '-';
        }
      } else if (columnKey === 'status') {
        // Status is nested in person.user.status
        const statusMap = {
          'active': 'Hoạt động',
          'inactive': 'Tạm ngưng',
          'pending': 'Chờ duyệt'
        };
        const status = person.user?.status || person.status;
        row[label] = statusMap[status] || status || '-';
      } else if (columnKey === 'user_name') {
        // Username is nested in person.user.user_name
        row[label] = person.user?.user_name || '-';
      } else if (columnKey === 'dob') {
        row[label] = person.dob ? new Date(person.dob).toLocaleDateString('vi-VN') : '-';
      } else if (columnKey === 'department') {
        // Students have 'major' field instead of 'department'
        row[label] = person.major || person.department || '-';
      } else if (columnKey === 'student_code') {
        // Use student_code if available, fallback to teacher_code
        row[label] = person.student_code || person.teacher_code || '-';
      } else if (columnKey === 'teacher_code') {
        // Use teacher_code if available, fallback to student_code  
        row[label] = person.teacher_code || person.student_code || '-';
      } else {
        row[label] = person[columnKey] || '-';
      }
    });
    
    return row;
  });

  return exportToExcel(data, filename, 'Danh sách nhân sự');
};

/**
 * Export rooms to Excel
 */
export const exportRoomsToExcel = (rooms, filename = 'danh_sach_phong_hoc', selectedColumns = []) => {
  const columnMapping = {
    stt: 'STT',
    room_code: 'Mã phòng',
    room_name: 'Tên phòng',
    description: 'Mô tả',
    coordinate_1: 'Vị trí 1',
    coordinate_2: 'Vị trí 2',
    coordinate_3: 'Vị trí 3',
    coordinate_4: 'Vị trí 4',
    status: 'Trạng thái'
  };

  // Build data with selected columns
  const data = rooms.map((room, index) => {
    const row = {};
    
    selectedColumns.forEach(columnKey => {
      const label = columnMapping[columnKey];
      
      if (columnKey === 'stt') {
        row[label] = index + 1;
      } else if (columnKey === 'status') {
        const statusMap = {
          'active': 'Hoạt động',
          'inactive': 'Không hoạt động',
          'maintenance': 'Bảo trì'
        };
        row[label] = statusMap[room.status] || room.status || '-';
      } else if (columnKey.startsWith('coordinate_')) {
        const coordIndex = parseInt(columnKey.split('_')[1]) - 1;
        if (room.coordinates && room.coordinates[coordIndex]) {
          const coord = room.coordinates[coordIndex];
          row[label] = `x: ${coord.x || 0}, y: ${coord.y || 0}`;
        } else {
          row[label] = '-';
        }
      } else {
        row[label] = room[columnKey] || '-';
      }
    });
    
    return row;
  });

  return exportToExcel(data, filename, 'Danh sách phòng học');
};

/**
 * Export accounts to Excel
 */
export const exportAccountsToExcel = (accounts, filename = 'danh_sach_tai_khoan', selectedColumns = []) => {
  const columnMapping = {
    stt: 'STT',
    code: 'Mã GV/SV',
    full_name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    dob: 'Ngày sinh',
    department: 'Khoa/Viện',
    roles: 'Vai trò',
    status: 'Trạng thái'
  };

  // Build data with selected columns
  const data = accounts.map((account, index) => {
    const row = {};
    
    selectedColumns.forEach(columnKey => {
      const label = columnMapping[columnKey];
      
      if (columnKey === 'stt') {
        row[label] = index + 1;
      } else if (columnKey === 'roles') {
        if (Array.isArray(account.roles)) {
          const roleMapping = {
            teacher: 'Giảng viên',
            admin: 'Quản trị viên',
            attendance_staff: 'Ban chấm công',
            student: 'Sinh viên'
          };
          row[label] = account.roles.map(role => roleMapping[role] || role).join(', ');
        } else {
          row[label] = account.roles || '-';
        }
      } else if (columnKey === 'status') {
        const statusMap = {
          'active': 'Hoạt động',
          'inactive': 'Tạm ngưng',
          'pending': 'Chờ duyệt'
        };
        row[label] = statusMap[account.status] || account.status || '-';
      } else if (columnKey === 'dob') {
        row[label] = account.dob ? new Date(account.dob).toLocaleDateString('vi-VN') : '-';
      } else if (columnKey === 'department') {
        row[label] = account.department_or_major || account.department || '-';
      } else {
        row[label] = account[columnKey] || '-';
      }
    });
    
    return row;
  });

  return exportToExcel(data, filename, 'Danh sách tài khoản');
};

/**
 * Export course sections to Excel
 */
export const exportCourseToExcel = (courses, filename = 'danh_sach_hoc_phan', selectedColumns = []) => {
  const columnMapping = {
    stt: 'STT',
    code: 'Mã học phần',
    name: 'Tên học phần',
    credits: 'Tín chỉ',
    semester: 'Học kỳ',
    max_students: 'Số lượng tối đa',
    practice_sessions: 'Số buổi thực hành',
    description: 'Mô tả'
  };

  // Build data with selected columns
  const data = courses.map((course, index) => {
    const row = {};
    
    selectedColumns.forEach(columnKey => {
      const label = columnMapping[columnKey];
      
      if (columnKey === 'stt') {
        row[label] = index + 1;
      } else if (columnKey === 'semester') {
        // Parse semester from format "2026-1" to "Học kỳ 1 năm 2026"
        if (course.semester) {
          const [year, sem] = course.semester.split('-');
          row[label] = `Học kỳ ${sem} năm ${year}`;
        } else {
          row[label] = '-';
        }
      } else {
        row[label] = course[columnKey] || '-';
      }
    });
    
    return row;
  });

  return exportToExcel(data, filename, 'Danh sách học phần');
};

export default exportToExcel;
