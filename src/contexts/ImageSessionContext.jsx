/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import AttendanceService from '@services/attendance.service';
import { toast } from 'sonner';

const ImageSessionContext = createContext(null);

export const ImageSessionProvider = ({ children }) => {
  const [imageSessions, setImageSessions] = useState([]);
  const [imageSessionsLoading, setImageSessionsLoading] = useState(false);

  const [sessionImages, setSessionImages] = useState([]);
  const [sessionImagesLoading, setSessionImagesLoading] = useState(false);
  const [activeImageSessionId, setActiveImageSessionId] = useState(null);

  const fetchImageSessionsByClassSession = useCallback(async (classSessionId, teacherId) => {
    if (!classSessionId) return;
    setImageSessionsLoading(true);
    try {
      const response = await AttendanceService.getImageSessionsByTeacher({
        classSessionId,
        teacherId,
        page: 1,
        limit: 20,
      });
      const rows = response?.data?.data ?? [];
      setImageSessions(rows);
    } catch (error) {
      toast.error(error?.message || 'Không thể tải danh sách phiên ảnh');
      setImageSessions([]);
    } finally {
      setImageSessionsLoading(false);
    }
  }, []);

  const fetchImagesBySession = useCallback(async (imageSessionId) => {
    if (!imageSessionId) return;
    setSessionImagesLoading(true);
    setActiveImageSessionId(imageSessionId);
    try {
      const response = await AttendanceService.getAttendanceImagesBySession(imageSessionId);
      const images = response?.data ?? response ?? [];
      setSessionImages(Array.isArray(images) ? images : []);
    } catch (error) {
      toast.error(error?.message || 'Không thể tải ảnh của phiên này');
      setSessionImages([]);
    } finally {
      setSessionImagesLoading(false);
    }
  }, []);

  const clearSessionImages = useCallback(() => {
    setSessionImages([]);
    setActiveImageSessionId(null);
  }, []);

  return (
    <ImageSessionContext.Provider
      value={{
        imageSessions,
        imageSessionsLoading,
        fetchImageSessionsByClassSession,
        sessionImages,
        sessionImagesLoading,
        activeImageSessionId,
        fetchImagesBySession,
        clearSessionImages,
      }}
    >
      {children}
    </ImageSessionContext.Provider>
  );
};

export const useImageSession = () => {
  const ctx = useContext(ImageSessionContext);
  if (!ctx) throw new Error('useImageSession must be used within ImageSessionProvider');
  return ctx;
};
