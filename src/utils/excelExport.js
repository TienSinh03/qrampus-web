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

/**
 * Export attendance workload (công dạy) sessions to Excel.
 * mode = 'single' → one sheet, sorted by course code, with header rows per group.
 * mode = 'multi'  → one sheet per course, sheet name = course name (max 31 chars).
 */
export const exportAttendanceWorkload = (sessions = [], filename = 'cong_day', mode = 'single') => {
  const fmtDate = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const fmtTime = (t) => (t ? String(t).substring(0, 5) : '-');
  const fmtSemester = (s) => {
    if (!s) return '-';
    const [year, sem] = s.split('-');
    return `HK${sem || '?'}/${year || '?'}`;
  };
  const fmtScheduleType = (t) =>
    t === 'theory' ? 'Lý thuyết' : t === 'practice' ? 'Thực hành' : t || '-';
  const fmtLecturerStatus = (s) => {
    const map = {
      on_time: 'Đúng giờ',
      late: 'Trễ',
      absent: 'Vắng',
      manual_override: 'Điều chỉnh thủ công',
    };
    return map[s] || s || '-';
  };

  // Sort: course_code ASC → class_date ASC → start_hour ASC
  const sorted = [...sessions].sort((a, b) => {
    const cA = a?.course_section?.code || '';
    const cB = b?.course_section?.code || '';
    if (cA !== cB) return cA.localeCompare(cB);
    const dA = a?.class_date || a?.class_session?.class_date || '';
    const dB = b?.class_date || b?.class_session?.class_date || '';
    if (dA !== dB) return dA.localeCompare(dB);
    const tA = a?.start_hour || a?.class_session?.start_hour || '';
    const tB = b?.start_hour || b?.class_session?.start_hour || '';
    return tA.localeCompare(tB);
  });

  const fmtDatetime = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const toRow = (session, idx) => {
    const cs = session?.class_session || {};
    const course = session?.course_section || {};
    const room = session?.room || {};
    const latestAtt = session?.latest_attendance_session || cs?.latest_attendance_session || null;
    return {
      'STT': idx,
      'Mã môn học': course.code || '-',
      'Tên môn học': course.name || '-',
      'Học kỳ': fmtSemester(course.semester),
      'Ngày dạy': fmtDate(session.class_date || cs.class_date),
      'Giờ bắt đầu': fmtTime(session.start_hour || cs.start_hour),
      'Giờ kết thúc': fmtTime(session.end_hour || cs.end_hour),
      'Loại buổi': fmtScheduleType(session.schedule_type || cs.schedule_type),
      'Phòng học': room.room_code ? `${room.room_code}${room.room_name ? ' - ' + room.room_name : ''}` : '-',
      'Số nhóm TH': cs.number_group ?? '-',
      'Ghi nhận chấm công': (session.has_attendance_session || cs.has_attendance_session) ? 'Đã ghi nhận' : 'Chưa ghi nhận',
      'Tạo phiên lúc': fmtDatetime(latestAtt?.created_at),
      'Hết hạn lúc': fmtDatetime(latestAtt?.expires_at),
      'Trạng thái buổi học': session.status || cs.status || '-',
      'Chấm công GV': fmtLecturerStatus(cs.lecturer_attendance_status),
    };
  };

  // Group sessions by course code (maintaining sort order)
  const groups = new Map();
  sorted.forEach((s) => {
    const code = s?.course_section?.code || 'Không xác định';
    if (!groups.has(code)) {
      groups.set(code, { name: s?.course_section?.name || code, sessions: [] });
    }
    groups.get(code).sessions.push(s);
  });

  const wb = XLSX.utils.book_new();
  const COL_WIDTHS = [
    { wch: 5 },  // STT
    { wch: 14 }, // Mã môn học
    { wch: 32 }, // Tên môn học
    { wch: 10 }, // Học kỳ
    { wch: 12 }, // Ngày dạy
    { wch: 10 }, // Giờ bắt đầu
    { wch: 10 }, // Giờ kết thúc
    { wch: 12 }, // Loại buổi
    { wch: 18 }, // Phòng học
    { wch: 10 }, // Số nhóm TH
    { wch: 18 }, // Ghi nhận chấm công
    { wch: 20 }, // Tạo phiên lúc
    { wch: 20 }, // Hết hạn lúc
    { wch: 18 }, // Trạng thái buổi học
    { wch: 20 }, // Chấm công GV
  ];

  if (mode === 'multi') {
    const usedNames = new Set();
    groups.forEach(({ name, sessions: groupSessions }) => {
      const data = groupSessions.map((s, i) => toRow(s, i + 1));
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = COL_WIDTHS;

      // Sheet name: use course name, max 31 chars (Excel limit), deduplicate
      let sheetName = String(name).substring(0, 31).trim();
      if (usedNames.has(sheetName)) {
        let counter = 2;
        while (usedNames.has(`${sheetName.substring(0, 28)} ${counter}`)) counter++;
        sheetName = `${sheetName.substring(0, 28)} ${counter}`;
      }
      usedNames.add(sheetName);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  } else {
    // Single sheet: header row per course group + data rows + empty separator
    const allRows = [];
    const EMPTY_ROW = {
      'STT': '', 'Mã môn học': '', 'Tên môn học': '', 'Học kỳ': '',
      'Ngày dạy': '', 'Giờ bắt đầu': '', 'Giờ kết thúc': '', 'Loại buổi': '',
      'Phòng học': '', 'Số nhóm TH': '', 'Ghi nhận chấm công': '',
      'Tạo phiên lúc': '', 'Hết hạn lúc': '',
      'Trạng thái buổi học': '', 'Chấm công GV': '',
    };

    groups.forEach(({ name, sessions: groupSessions }, code) => {
      // Group header row (spans first column visually)
      allRows.push({
        ...EMPTY_ROW,
        'STT': `▶ ${code}  –  ${name}`,
      });
      groupSessions.forEach((s, i) => allRows.push(toRow(s, i + 1)));
      allRows.push({ ...EMPTY_ROW }); // separator
    });

    const ws = XLSX.utils.json_to_sheet(allRows);
    ws['!cols'] = COL_WIDTHS;
    XLSX.utils.book_append_sheet(wb, ws, 'Công dạy');
  }

  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export workload for ALL teachers (department-wide).
 * sessionsByTeacher = [{ teacher: {...}, sessions: [...] }, ...]
 * mode = 'single' → one sheet sorted by teacher → course → date
 * mode = 'multi'  → one sheet per teacher
 */
export const exportWorkloadAllTeachers = (
  sessionsByTeacher = [],
  filename = 'cong_day_toan_truong',
  mode = 'single',
) => {
  const fmtDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const fmtTime = (t) => (t ? String(t).substring(0, 5) : '-');
  const fmtSemester = (s) => {
    if (!s) return '-';
    const [yr, sem] = s.split('-');
    return `HK${sem || '?'}/${yr || '?'}`;
  };
  const fmtScheduleType = (t) =>
    t === 'theory' ? 'Lý thuyết' : t === 'practice' ? 'Thực hành' : t || '-';
  const fmtLecturerStatus = (s) => {
    const map = { on_time: 'Đúng giờ', late: 'Trễ', absent: 'Vắng', manual_override: 'Điều chỉnh thủ công' };
    return map[s] || s || '-';
  };
  const fmtDatetime = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };
  const typeOrder = (t) => (t === 'theory' ? 0 : t === 'practice' ? 1 : 2);

  const toRow = (session, idx, teacher) => {
    const cs      = session?.class_session || {};
    const course  = session?.course_section || {};
    const room    = session?.room || {};
    const att     = session?.latest_attendance_session || cs?.latest_attendance_session || null;
    return {
      'STT':                   idx,
      'Mã GV':                 teacher?.teacher_code || teacher?.code || '-',
      'Họ tên GV':             teacher?.full_name || '-',
      'Khoa/Viện':             teacher?.department || '-',
      'Mã môn học':            course.code || '-',
      'Tên môn học':           course.name || '-',
      'Học kỳ':                fmtSemester(course.semester),
      'Ngày dạy':              fmtDate(session.class_date || cs.class_date),
      'Giờ bắt đầu':          fmtTime(session.start_hour || cs.start_hour),
      'Giờ kết thúc':         fmtTime(session.end_hour   || cs.end_hour),
      'Loại buổi':             fmtScheduleType(session.schedule_type || cs.schedule_type),
      'Phòng học':             room.room_code
        ? `${room.room_code}${room.room_name ? ' - ' + room.room_name : ''}` : '-',
      'Số nhóm TH':            cs.number_group ?? '-',
      'Ghi nhận chấm công':    (session.has_attendance_session || cs.has_attendance_session)
        ? 'Đã ghi nhận' : 'Chưa ghi nhận',
      'Tạo phiên lúc':         fmtDatetime(att?.created_at),
      'Hết hạn lúc':           fmtDatetime(att?.expires_at),
      'Trạng thái buổi học':   session.status || cs.status || '-',
      'Chấm công GV':          fmtLecturerStatus(cs.lecturer_attendance_status),
    };
  };

  const sortSessions = (sessions) =>
    [...sessions].sort((a, b) => {
      const cA = a?.course_section?.code || '';
      const cB = b?.course_section?.code || '';
      if (cA !== cB) return cA.localeCompare(cB);
      const tA = typeOrder(a?.class_session?.schedule_type || a?.schedule_type);
      const tB = typeOrder(b?.class_session?.schedule_type || b?.schedule_type);
      if (tA !== tB) return tA - tB;
      const dA = a?.class_date || a?.class_session?.class_date || '';
      const dB = b?.class_date || b?.class_session?.class_date || '';
      if (dA !== dB) return dA.localeCompare(dB);
      return (a?.start_hour || a?.class_session?.start_hour || '')
        .localeCompare(b?.start_hour || b?.class_session?.start_hour || '');
    });

  const COL_WIDTHS = [
    { wch: 5 },  // STT
    { wch: 12 }, // Mã GV
    { wch: 24 }, // Họ tên GV
    { wch: 22 }, // Khoa/Viện
    { wch: 14 }, // Mã môn học
    { wch: 32 }, // Tên môn học
    { wch: 10 }, // Học kỳ
    { wch: 12 }, // Ngày dạy
    { wch: 10 }, // Giờ bắt đầu
    { wch: 10 }, // Giờ kết thúc
    { wch: 12 }, // Loại buổi
    { wch: 18 }, // Phòng học
    { wch: 10 }, // Số nhóm TH
    { wch: 18 }, // Ghi nhận chấm công
    { wch: 20 }, // Tạo phiên lúc
    { wch: 20 }, // Hết hạn lúc
    { wch: 18 }, // Trạng thái buổi học
    { wch: 20 }, // Chấm công GV
  ];

  const EMPTY = {
    'STT': '', 'Mã GV': '', 'Họ tên GV': '', 'Khoa/Viện': '',
    'Mã môn học': '', 'Tên môn học': '', 'Học kỳ': '',
    'Ngày dạy': '', 'Giờ bắt đầu': '', 'Giờ kết thúc': '',
    'Loại buổi': '', 'Phòng học': '', 'Số nhóm TH': '',
    'Ghi nhận chấm công': '', 'Tạo phiên lúc': '', 'Hết hạn lúc': '',
    'Trạng thái buổi học': '', 'Chấm công GV': '',
  };

  const wb = XLSX.utils.book_new();

  if (mode === 'multi') {
    const usedNames = new Set();
    sessionsByTeacher.forEach(({ teacher, sessions }) => {
      const sorted = sortSessions(sessions);
      const data   = sorted.map((s, i) => toRow(s, i + 1, teacher));
      const ws     = XLSX.utils.json_to_sheet(data);
      ws['!cols']  = COL_WIDTHS;

      const tc = teacher?.teacher_code || teacher?.code || '?';
      const fn = teacher?.full_name || '?';
      let sheetName = `${tc}_${fn}`.substring(0, 31).trim();
      if (usedNames.has(sheetName)) {
        let n = 2;
        while (usedNames.has(`${sheetName.substring(0, 28)} ${n}`)) n++;
        sheetName = `${sheetName.substring(0, 28)} ${n}`;
      }
      usedNames.add(sheetName);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  } else {
    // Single sheet: teacher group header → course sub-header → rows → separator
    const allRows  = [];
    const byTeacher = [...sessionsByTeacher].sort((a, b) =>
      (a.teacher?.teacher_code || '').localeCompare(b.teacher?.teacher_code || '')
    );
    let globalIdx = 1;
    byTeacher.forEach(({ teacher, sessions }) => {
      const tc = teacher?.teacher_code || teacher?.code || '?';
      const fn = teacher?.full_name || '?';
      allRows.push({ ...EMPTY, 'STT': `▶ ${tc}  –  ${fn}` });

      const sorted      = sortSessions(sessions);
      const courseGroups = new Map();
      sorted.forEach((s) => {
        const code = s?.course_section?.code || 'Không xác định';
        if (!courseGroups.has(code))
          courseGroups.set(code, { name: s?.course_section?.name || code, list: [] });
        courseGroups.get(code).list.push(s);
      });

      courseGroups.forEach(({ name, list }, code) => {
        allRows.push({ ...EMPTY, 'STT': `   ▸ ${code}  –  ${name}` });
        list.forEach((s) => allRows.push(toRow(s, globalIdx++, teacher)));
      });
      allRows.push({ ...EMPTY });
    });

    const ws    = XLSX.utils.json_to_sheet(allRows);
    ws['!cols'] = COL_WIDTHS;
    XLSX.utils.book_append_sheet(wb, ws, 'Công dạy toàn trường');
  }

  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export workload per-teacher into a user-selected folder.
 * dirHandle = FileSystemDirectoryHandle from showDirectoryPicker().
 * Each teacher → subfolder `<teacher_code>_<full_name>`:
 *   - `<teacher_code>_tong_cong.xlsx`  (all sessions, grouped by course)
 *   - `<course_code>.xlsx`             (sessions for that course only)
 */
export const exportWorkloadToFolder = async (sessionsByTeacher, dirHandle) => {
  const fmtDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const fmtTime = (t) => (t ? String(t).substring(0, 5) : '-');
  const fmtSemester = (s) => {
    if (!s) return '-';
    const [yr, sem] = s.split('-');
    return `HK${sem || '?'}/${yr || '?'}`;
  };
  const fmtScheduleType = (t) =>
    t === 'theory' ? 'Lý thuyết' : t === 'practice' ? 'Thực hành' : t || '-';
  const fmtLecturerStatus = (s) => {
    const map = { on_time: 'Đúng giờ', late: 'Trễ', absent: 'Vắng', manual_override: 'Điều chỉnh thủ công' };
    return map[s] || s || '-';
  };
  const fmtDatetime = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };
  const typeOrder = (t) => (t === 'theory' ? 0 : t === 'practice' ? 1 : 2);

  const toRow = (session, idx) => {
    const cs    = session?.class_session || {};
    const course = session?.course_section || {};
    const room  = session?.room || {};
    const att   = session?.latest_attendance_session || cs?.latest_attendance_session || null;
    return {
      'STT':                 idx,
      'Mã môn học':          course.code || '-',
      'Tên môn học':         course.name || '-',
      'Học kỳ':              fmtSemester(course.semester),
      'Ngày dạy':            fmtDate(session.class_date || cs.class_date),
      'Giờ bắt đầu':        fmtTime(session.start_hour || cs.start_hour),
      'Giờ kết thúc':       fmtTime(session.end_hour   || cs.end_hour),
      'Loại buổi':           fmtScheduleType(session.schedule_type || cs.schedule_type),
      'Phòng học':           room.room_code
        ? `${room.room_code}${room.room_name ? ' - ' + room.room_name : ''}` : '-',
      'Số nhóm TH':          cs.number_group ?? '-',
      'Ghi nhận chấm công':  (session.has_attendance_session || cs.has_attendance_session)
        ? 'Đã ghi nhận' : 'Chưa ghi nhận',
      'Tạo phiên lúc':       fmtDatetime(att?.created_at),
      'Hết hạn lúc':         fmtDatetime(att?.expires_at),
      'Trạng thái buổi học': session.status || cs.status || '-',
      'Chấm công GV':        fmtLecturerStatus(cs.lecturer_attendance_status),
    };
  };

  const COL_WIDTHS = [
    { wch: 5 }, { wch: 14 }, { wch: 32 }, { wch: 10 },
    { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    { wch: 18 }, { wch: 10 }, { wch: 18 }, { wch: 20 },
    { wch: 20 }, { wch: 18 }, { wch: 20 },
  ];

  const EMPTY = {
    'STT': '', 'Mã môn học': '', 'Tên môn học': '', 'Học kỳ': '',
    'Ngày dạy': '', 'Giờ bắt đầu': '', 'Giờ kết thúc': '', 'Loại buổi': '',
    'Phòng học': '', 'Số nhóm TH': '', 'Ghi nhận chấm công': '',
    'Tạo phiên lúc': '', 'Hết hạn lúc': '',
    'Trạng thái buổi học': '', 'Chấm công GV': '',
  };

  const sortSessions = (sessions) =>
    [...sessions].sort((a, b) => {
      const cA = a?.course_section?.code || '';
      const cB = b?.course_section?.code || '';
      if (cA !== cB) return cA.localeCompare(cB);
      const tA = typeOrder(a?.class_session?.schedule_type || a?.schedule_type);
      const tB = typeOrder(b?.class_session?.schedule_type || b?.schedule_type);
      if (tA !== tB) return tA - tB;
      const dA = a?.class_date || a?.class_session?.class_date || '';
      const dB = b?.class_date || b?.class_session?.class_date || '';
      if (dA !== dB) return dA.localeCompare(dB);
      return (a?.start_hour || a?.class_session?.start_hour || '')
        .localeCompare(b?.start_hour || b?.class_session?.start_hour || '');
    });

  // Build a workbook from sessions (grouped by course, with header rows)
  const buildWb = (sessions, sheetName) => {
    const sorted = sortSessions(sessions);
    const groups = new Map();
    sorted.forEach((s) => {
      const code = s?.course_section?.code || 'Không xác định';
      if (!groups.has(code))
        groups.set(code, { name: s?.course_section?.name || code, list: [] });
      groups.get(code).list.push(s);
    });
    const rows = [];
    groups.forEach(({ name, list }, code) => {
      rows.push({ ...EMPTY, 'STT': `▶ ${code}  –  ${name}` });
      list.forEach((s, i) => rows.push(toRow(s, i + 1)));
      rows.push({ ...EMPTY });
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = COL_WIDTHS;
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    return wb;
  };

  const writeWb = async (folderHandle, fname, wb) => {
    const buf      = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob     = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fh       = await folderHandle.getFileHandle(fname, { create: true });
    const writable = await fh.createWritable();
    await writable.write(blob);
    await writable.close();
  };

  const sanitize = (name) => String(name).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');

  for (const { teacher, sessions } of sessionsByTeacher) {
    const tc         = teacher?.teacher_code || teacher?.code || 'UNKNOWN';
    const fn         = teacher?.full_name || 'GV';
    const folderName = sanitize(`${tc}_${fn}`);
    const teacherDir = await dirHandle.getDirectoryHandle(folderName, { create: true });

    // Summary: all sessions for this teacher
    await writeWb(teacherDir, `${sanitize(tc)}_tong_cong.xlsx`, buildWb(sessions, 'Công dạy'));

    // Per-course files
    const byCourse = new Map();
    sessions.forEach((s) => {
      const code = s?.course_section?.code || 'unknown';
      if (!byCourse.has(code)) byCourse.set(code, []);
      byCourse.get(code).push(s);
    });
    for (const [code, courseSessions] of byCourse) {
      await writeWb(teacherDir, `${sanitize(code)}.xlsx`, buildWb(courseSessions, code));
    }
  }
};

export default exportToExcel;
