import React, { useState, useMemo } from "react";
import {
  CalendarDaysIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const SchedulePage = () => {
  const navigate = useNavigate();
  /* ================= STATE ================= */
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [monthCursor, setMonthCursor] = useState(new Date());

  /* ================= WEEK ================= */
  const weekDates = useMemo(() => {
    const days = eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
    });

    return days.map((date) => ({
      raw: date,
      dayName: format(date, "EEEE", { locale: vi }),
      date: format(date, "dd/MM/yyyy"),
    }));
  }, [currentWeekStart]);

  /* ================= MONTH ================= */
  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(monthCursor), {
          weekStartsOn: 1,
        }),
        end: endOfWeek(endOfMonth(monthCursor), {
          weekStartsOn: 1,
        }),
      }),
    [monthCursor]
  );

  /* ================= ACTION ================= */
  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToNextWeek = () =>
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const goToCurrentWeek = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  /* ================= MOCK EVENT ================= */
  const examEvent = [
    {
      date: "18/12/2025",
      title: "Lập trình WWW (Java)",
      mahocphan: "420300362101",
      tiet: "13-16",
      phong: "H3.1.1",
      nhom: "1",
      giaovien: [
        { magiangvien: "10000001", name: "Đặng Thị Thu Hà" },
        { magiangvien: "10000002", name: "Hà Thị Kim Thoa" }
      ],
      loaihoc: "3", // 1: lý thuyết (lịch học), 2: trực tuyến, 3: thi, 4: tạm ngưng
      hinhthuchoc: "Thực hành"
    },
    {
      date: "17/12/2025",
      title: "Lập trình web",
      mahocphan: "420300362123",
      tiet: "4-6",
      phong: "H3.1.1",
      nhom: "0",
      giaovien: [
        { magiangvien: "10000001", name: "Đặng Thị Thu Hà" }
      ],
      loaihoc: "1",
      hinhthuchoc: "Lý thuyết"
    },
    {
      date: "24/12/2025",
      title: "Lập trình web",
      mahocphan: "420300362123",
      tiet: "4-6",
      phong: "H3.1.1",
      nhom: "1",
      giaovien: [
        { magiangvien: "10000001", name: "Đặng Thị Thu Hà" }
      ],
      loaihoc: "1",
      hinhthuchoc: "Thực hành"
    }, {
      "date": "20/12/2025",
      "title": "Cấu trúc dữ liệu và Giải thuật",
      "mahocphan": "420300365002",
      "tiet": "1-3",
      "phong": "A1.2",
      "nhom": "2",
      "giaovien": [
        {
          "magiangvien": "10000001",
          "name": "Đặng Thị Thu Hà"
        }
      ],
      "loaihoc": "1",
      "hinhthuchoc": "Lý thuyết"
    },
    {
      "date": "22/12/2025",
      "title": "Cơ sở dữ liệu",
      "mahocphan": "420300368005",
      "tiet": "7-9",
      "phong": "V5.2",
      "nhom": "1",
      "giaovien": [
        {
          "magiangvien": "10000001",
          "name": "Đặng Thị Thu Hà"
        }
      ],
      "loaihoc": "1",
      "hinhthuchoc": "Lý thuyết"
    }
  ];

  /* ================= UTILS ================= */
  const getStartTiet = (tiet) => {
    if (!tiet) return null;
    return parseInt(tiet.split("-")[0], 10);
  };

  const getShiftFromTiet = (tiet) => {
    const start = getStartTiet(tiet);
    if (!start) return null;

    if (start <= 6) return "Sáng";
    if (start <= 12) return "Chiều";
    return "Tối";
  };

  const isSameDate = (d1, d2) => d1 === d2;


  const LOAI_HOC_STYLE = {
    "1": {
      bg: "bg-gray-200",
      border: "border-gray-400"
    },
    "2": {
      bg: "bg-blue-400",
      border: "border-blue-600"
    },
    "3": {
      bg: "bg-yellow-300",
      border: "border-yellow-600"
    },
    "4": {
      bg: "bg-red-500",
      border: "border-red-700"
    }
  };
  /* ================= JSX ================= */
  return (
    <div className="min-h-screen p-2">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 p-4 flex flex-wrap justify-between gap-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Lịch học, lịch thi theo tuần
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-gray">Tất cả</button>
            <button className="btn-blue">Lịch học</button>
            <button className="btn-blue">Lịch thi</button>

            {/* MONTH PICKER */}
            <div className="relative">
              <div
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer hover:shadow"
              >
                <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg">
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
                <input
                  readOnly
                  value={`${weekDates[0]?.date} - ${weekDates[6]?.date}`}
                  className="w-44 text-sm font-medium text-center bg-transparent outline-none"
                />
              </div>

              {showMonthPicker && (
                <div className="absolute z-50 top-full mt-2 bg-white border rounded-xl shadow-xl p-4 w-72">
                  <div className="flex justify-between mb-3">
                    <button onClick={() => setMonthCursor(subWeeks(monthCursor, 4))}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold">
                      {format(monthCursor, "MMMM yyyy", { locale: vi })}
                    </span>
                    <button onClick={() => setMonthCursor(addWeeks(monthCursor, 4))}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-xs text-center">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <div key={d} className="font-medium text-gray-500">
                        {d}
                      </div>
                    ))}

                    {monthDays.map((day) => (
                      <button
                        key={day.toString()}
                        onClick={() => {
                          setCurrentWeekStart(
                            startOfWeek(day, { weekStartsOn: 1 })
                          );
                          setShowMonthPicker(false);
                        }}
                        className={`py-2 rounded hover:bg-blue-100 ${format(day, "MM") !== format(monthCursor, "MM")
                          ? "text-gray-300"
                          : ""
                          }`}
                      >
                        {format(day, "d")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION */}
            <button className="btn-gray">
              <Printer className="w-4 h-4 inline mr-1" />
              In lịch
            </button>
            <button onClick={goToCurrentWeek} className="btn-blue">
              <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
              Hiện tại
            </button>
            <button onClick={goToPreviousWeek} className="icon-btn">
              <ChevronLeft />
            </button>
            <button onClick={goToNextWeek} className="icon-btn">
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-4 w-32">Ca học</th>
                {weekDates.map((d) => (
                  <th key={d.date} className="py-4">
                    <div>{d.dayName}</div>
                    <div className="text-lg font-bold">{d.date}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {["Sáng", "Chiều", "Tối"].map((shift) => (
                <tr key={shift} className="border-t">
                  <td className="py-6 px-4 font-medium">{shift}</td>

                  {weekDates.map((d, idx) => {
                    const matchedEvents = examEvent.filter((ev) => {
                      return (
                        isSameDate(ev.date, d.date) &&
                        getShiftFromTiet(ev.tiet) === shift
                      );
                    });

                    return (
                      <td key={idx} className="h-36 p-2 border-l">
                        {matchedEvents.map((ev, i) => (
                          <button key={i} className="cursor-pointer w-full flex flex-col space-y-2">

                            <div
                              className={`border-2 rounded-lg p-3 w-full ${LOAI_HOC_STYLE[ev.loaihoc]?.bg} ${LOAI_HOC_STYLE[ev.loaihoc]?.border}`}
                            >
                              <div className="flex flex-col space-y-1">
                                <div className="font-bold">
                                  <button
                                    className="text-blue-600 hover:underline"
                                    // onClick={() => handleCourseClick(ev.title)}
                                    onClick={() => navigate('/dashboard/study-session')}


                                  >
                                    {ev.title}
                                  </button>
                                  <button
                                    className="text-blue-600 hover:underline ml-2"
                                    onClick={() => navigate('/dashboard/study-session')}

                                  >
                                    {ev.mahocphan}
                                  </button>
                                </div>

                                {/* Event Details */}
                                <div className="text-sm">
                                  <div>Tiết: {ev.tiet}</div>
                                  <div>Phòng: {ev.phong}</div>
                                  <div>Nhóm: {ev.nhom}</div>
                                  <div>
                                    Giảng viên:{" "}
                                    {ev.giaovien.map((gv, index) => (
                                      <span key={gv.magiangvien}>
                                        {gv.name}{index < ev.giaovien.length - 1 ? ", " : ""}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </td>

                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm p-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-gray-200 border rounded-sm" />
            <span className="text-gray-700">Lịch học</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-blue-400 border rounded-sm" />
            <span className="text-gray-700">Lịch học trực tuyến</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-yellow-300 border rounded-sm" />
            <span className="text-gray-700">Lịch thi</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-red-500 border rounded-sm" />
            <span className="text-gray-700">Lịch tạm ngưng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
