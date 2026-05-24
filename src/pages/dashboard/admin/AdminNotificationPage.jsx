import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock, Calendar, GraduationCap, AlertCircle,
  Loader2, ChevronDown, MailOpen, Search, Hash,
  Mail, Building2,
} from "lucide-react";
import notificationService from "@services/notification.service";

// ─── date helpers ─────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${hh}:${min} - ${dd}/${mo}/${d.getFullYear()}`;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return formatDate(dateStr);
};

// ─── content helper ───────────────────────────────────────────────────────────

const decodeHtml = (text = '') =>
  text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const htmlToText = (html = '') => {
  if (!html || typeof html !== 'string') return '';
  return decodeHtml(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\s*\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
      .replace(/<\s*li\b[^>]*>/gi, '- ')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
};

const getNotificationText = (item = {}) => {
  const htmlSrc = item.message_html || item.html || item.content_html || '';
  const plain = item.message || item.content || item.body || '';
  const hasHtml = typeof plain === 'string' && /<\/?[a-z][\s\S]*>/i.test(plain);
  const src = (typeof htmlSrc === 'string' && htmlSrc.trim()) || (hasHtml ? plain : '');
  return src ? htmlToText(src) : plain;
};

const normalizeText = (t = '') =>
  String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// ─── UI helpers ───────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse flex gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <MailOpen size={48} className="mb-4 opacity-30" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-red-400">
    <AlertCircle size={40} className="mb-3 opacity-70" />
    <p className="text-sm font-medium mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition"
      >
        Thử lại
      </button>
    )}
  </div>
);

// ─── Teacher avatar ───────────────────────────────────────────────────────────

const TeacherAvatar = ({ avatarUrl, fullName }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-white">
      <GraduationCap size={14} className="text-indigo-500" />
    </div>
  );
};

// ─── Message card ─────────────────────────────────────────────────────────────

const PREVIEW_COUNT = 3;

const TeacherMessageCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const { recipients = [], recipient_count = 0 } = item;
  const isBulk = recipient_count > 1;
  const visible = expanded ? recipients : recipients.slice(0, PREVIEW_COUNT);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-1 gap-3">
        <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded ring-1 ring-emerald-100">
          Đã gửi
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={12} /> {timeAgo(item.sent_at)}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar size={12} /> {formatDate(item.sent_at)}
        </span>
      </div>

      {/* Nội dung */}
      {item.message && (
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {getNotificationText(item)}
        </p>
      )}

      {/* Danh sách giảng viên */}
      <div className="rounded-xl bg-indigo-50 px-4 py-3">
        <p className="text-indigo-700 text-xs font-semibold mb-3 flex items-center gap-1.5">
          <GraduationCap size={13} />
          {isBulk ? `Giảng viên nhận (${recipient_count} người)` : 'Giảng viên nhận'}
        </p>

        {recipients.length === 0 ? (
          <p className="text-indigo-400 text-xs">Không có dữ liệu giảng viên nhận.</p>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((teacher, i) => (
              <li key={teacher.user_id || i} className="flex items-center gap-3">
                <TeacherAvatar avatarUrl={teacher.avatar_url} fullName={teacher.full_name} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {teacher.full_name || 'Không rõ tên'}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {teacher.teacher_code && (
                      <span className="text-xs text-indigo-500 flex items-center gap-1">
                        <Hash size={10} /> {teacher.teacher_code}
                      </span>
                    )}
                    {teacher.department && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Building2 size={10} /> {teacher.department}
                      </span>
                    )}
                    {teacher.email && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={10} /> {teacher.email}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {recipients.length > PREVIEW_COUNT && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition"
          >
            {expanded
              ? 'Thu gọn'
              : `Xem thêm ${recipients.length - PREVIEW_COUNT} giảng viên`}
            <ChevronDown
              size={12}
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const AdminNotificationPage = () => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchPage = useCallback(async (offset = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getAdminTeacherMessages({ limit: PAGE_SIZE, offset });
      if (!res?.success) throw new Error(res?.message || 'Không thể tải danh sách tin nhắn');
      const data = res.data || {};
      const items = Array.isArray(data.messages) ? data.messages : [];
      setMessages((prev) => append ? [...prev, ...items] : items);
      setPagination(data.pagination || null);
      setFetched(true);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!fetched) fetchPage(0);
  }, [fetched, fetchPage]);

  const hasMore = pagination ? messages.length < pagination.total : false;

  const filtered = useMemo(() => {
    const kw = normalizeText(searchKeyword);
    if (!kw) return messages;
    return messages.filter((m) => {
      const blob = [
        m.title,
        m.message,
        ...(m.recipients || []).map(
          (r) => `${r.full_name || ''} ${r.teacher_code || ''} ${r.department || ''} ${r.email || ''}`
        ),
      ].join(' ');
      return normalizeText(blob).includes(kw);
    });
  }, [messages, searchKeyword]);

  return (
    <div className="min-h-screen bg-[#f8fafc] sm:px-6">
      <div className="mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thông báo</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách tin nhắn đã gửi đến giảng viên</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 mb-5 w-full sm:w-80">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm tiêu đề, nội dung, giảng viên..."
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
          />
        </div>

        {/* Content */}
        {loading ? (
          <Skeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchPage(0)} />
        ) : filtered.length === 0 ? (
          <EmptyState message={
            searchKeyword
              ? 'Không tìm thấy kết quả phù hợp'
              : 'Chưa có tin nhắn nào gửi đến giảng viên'
          } />
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <TeacherMessageCard key={item.id} item={item} />
            ))}

            {hasMore && !searchKeyword && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => fetchPage(messages.length, true)}
                  disabled={loadingMore}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 px-6 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {loadingMore
                    ? <Loader2 size={16} className="animate-spin" />
                    : <ChevronDown size={16} />}
                  {loadingMore ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPage;
