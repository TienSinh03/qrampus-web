/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from "react";
import attendanceService from "@services/attendance.service";

const FaceVerifyContext = createContext(null);

export const FaceVerifyProvider = ({ children }) => {
  const cacheRef = useRef(new Map());

  const [classSessionData, setClassSessionData] = useState(null);
  const [classSessionLoading, setClassSessionLoading] = useState(false);
  const [classSessionError, setClassSessionError] = useState(null);

  const fetchByAttendance = useCallback(async (attendanceId) => {
    if (cacheRef.current.has(attendanceId)) {
      return { data: cacheRef.current.get(attendanceId), error: null };
    }
    try {
      const res = await attendanceService.getFaceVerificationByAttendance(attendanceId);
      const data = res?.data ?? null;
      cacheRef.current.set(attendanceId, data);
      return { data, error: null };
    } catch {
      return { data: null, error: "Không thể tải dữ liệu nhận diện khuôn mặt." };
    }
  }, []);

  const invalidateAttendance = useCallback((attendanceId) => {
    cacheRef.current.delete(attendanceId);
  }, []);

  /** Fetch all face verifications for a class session. */
  const fetchByClassSession = useCallback(async (classSessionId, teacherId = null) => {
    setClassSessionLoading(true);
    setClassSessionError(null);
    setClassSessionData(null);
    try {
      const res = await attendanceService.getFaceVerificationsByClassSession(classSessionId, teacherId);
      const data = res?.data ?? null;
      setClassSessionData(data);
      return data;
    } catch {
      setClassSessionError("Không thể tải dữ liệu nhận diện khuôn mặt.");
      return null;
    } finally {
      setClassSessionLoading(false);
    }
  }, []);

  return (
    <FaceVerifyContext.Provider
      value={{
        fetchByAttendance,
        invalidateAttendance,
        fetchByClassSession,
        classSessionData,
        classSessionLoading,
        classSessionError,
      }}
    >
      {children}
    </FaceVerifyContext.Provider>
  );
};

export const useFaceVerify = () => {
  const ctx = useContext(FaceVerifyContext);
  if (!ctx) throw new Error("useFaceVerify phải được dùng trong FaceVerifyProvider");
  return ctx;
};
