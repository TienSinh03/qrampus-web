import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Loader2,
  User,
  CalendarDays,
  Tag,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import notificationService from '@services/notification.service';

const formatSentAt = (sentAt) => {
  if (!sentAt) return '--';

  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) return '--';

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const typeLabelMap = {
  class_reminder: 'Nhắc lịch học',
  class_started: 'Bắt đầu buổi học',
  attendance_success: 'Điểm danh thành công',
  class_cancelled: 'Hủy buổi học',
  schedule_change: 'Thay đổi lịch học',
  leave_request: 'Đơn xin nghỉ',
  create_session_now: 'Mở buổi học ngay',
  missing_qr: 'Thiếu điểm danh QR',
  other: 'Khác',
};

const priorityStyle = {
  normal: 'bg-blue-50 text-blue-700',
  high: 'bg-amber-50 text-amber-700',
  urgent: 'bg-red-50 text-red-700',
};

const ContentNotification = ({ notificationId: notificationIdProp }) => {
  const navigate = useNavigate();
  const params = useParams();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const notificationId = notificationIdProp || params.id || null;

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      if (!notificationId) {
        setError('Thiếu id thông báo.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response =
          await notificationService.getNotificationById(notificationId);

        if (!response?.success) {
          throw new Error(
            response?.message || 'Không thể tải nội dung thông báo.'
          );
        }

        setNotification(response?.data || null);
      } catch (err) {
        setError(err.message || 'Không thể tải nội dung thông báo.');
        setNotification(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetail();
  }, [notificationId]);

  const senderName = useMemo(() => {
    return (
      notification?.metadata?.sender_name ||
      notification?.metadata?.sender_role ||
      'Hệ thống'
    );
  }, [notification]);

  const typeLabel = useMemo(() => {
    return typeLabelMap[notification?.type] || 'Thông báo';
  }, [notification]);

  const priorityClass =
    priorityStyle[notification?.priority] || priorityStyle.normal;

  if (loading) {
    return (
      <div className="mx-auto my-10 max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang tải nội dung thông báo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto my-10 max-w-4xl bg-white border border-red-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold">Không thể tải thông báo</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-300 to-cyan-300 px-6 py-5 text-stone-900">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 hover:text-white"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>

          <div className="text-sm text-slate-700">
              <p className="text-xs text-slate-700 uppercase tracking-wide">
                Ngày gửi / Giờ gửi
              </p>
              <div className="text-sm text-slate-700 font-medium">
                {formatSentAt(notification?.sent_at)}
              </div>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold leading-snug justify-center text-center text-stone-900">
          {notification?.title || 'Không có tiêu đề'}
        </h1>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <User size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Người gửi</p>
            <p className="text-sm font-semibold text-gray-900">{senderName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Tag size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Loại thông báo</p>
            <p className="text-sm font-semibold text-gray-900">{typeLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
            <Bell size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Ưu tiên</p>
            <span
              className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${priorityClass}`}
            >
              {notification?.priority || 'normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-7">
        <div className="flex items-center gap-2 text-gray-800 mb-4">
          <CalendarDays size={18} />
          <span className="font-semibold">Nội dung chi tiết</span>
        </div>

        {notification?.message ? (
          <div
            className="prose max-w-none prose-p:my-2 prose-p:leading-7 prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-3 prose-li:my-1 text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(notification.message),
            }}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Thông báo không có nội dung chi tiết.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentNotification;