import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Bell, Send, Clock, Users, Inbox, User,
  Calendar, BookOpen, CheckCheck, AlertCircle,
  Loader2, ChevronDown, MailOpen, Search, Hash,
} from "lucide-react";
import { useNotification } from "@contexts/NotificationContext";
import notificationService from "@services/notification.service";
import teacherService from "@services/teacher.service";

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

// ─── content helpers ──────────────────────────────────────────────────────────

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

// ─── subject label helper ─────────────────────────────────────────────────────

const extractSubjectLabels = (metadata = {}) => {
  if (Array.isArray(metadata?.subjects)) {
    return metadata.subjects
      .map((s) => {
        if (!s) return '';
        if (typeof s === 'string') return s;
        const modeText = s.modeLabel || s.mode || s.studyMode || '';
        const groupNum = s.groupNumber || s.numberGroup || '';
        const groupText = groupNum ? `Nhóm ${groupNum}` : '';
        const main = s.courseCode || s.code || s.courseName || s.name || '';
        return [main, modeText, groupText].filter(Boolean).join(' - ');
      })
      .filter(Boolean);
  }
  if (Array.isArray(metadata?.subject_labels)) return metadata.subject_labels.filter(Boolean);
  if (metadata?.subject_label) return [String(metadata.subject_label)];
  return [];
};

// ─── grouping ─────────────────────────────────────────────────────────────────

const TARGET_SUBJECTS = 'subjects';
const TARGET_STUDENTS = 'students';

const buildGroupedData = (notifications, studentByUserId) => {
  const map = new Map();

  notifications.forEach((item) => {
    const meta = item.metadata || {};
    const mode = meta.target_mode === TARGET_SUBJECTS ? TARGET_SUBJECTS : TARGET_STUDENTS;
    const message = getNotificationText(item);
    const sentAt = item.sent_at || item.created_at || '';
    const groupKey = `${mode}|${item.title || ''}|${sentAt}|${message}`;

    if (!map.has(groupKey)) {
      map.set(groupKey, {
        id: groupKey,
        mode,
        title: item.title || 'Thông báo',
        message,
        sentAt,
        recipients: new Set(),
        subjectLabels: new Set(),
      });
    }

    const group = map.get(groupKey);
    const student = studentByUserId.get(String(item.target_user_id || ''));
    const recipientLabel = student
      ? `${student.studentCode || '--'} - ${student.fullName || 'Không rõ tên'}`
      : null;
    if (recipientLabel) group.recipients.add(recipientLabel);
    extractSubjectLabels(meta).forEach((l) => group.subjectLabels.add(l));
  });

  return Array.from(map.values())
    .map((g) => ({
      ...g,
      recipientList: Array.from(g.recipients),
      subjects: Array.from(g.subjectLabels),
      searchBlob: `${g.title} ${g.message} ${Array.from(g.recipients).join(' ')} ${Array.from(g.subjectLabels).join(' ')}`,
    }))
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
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

const TARGET_MODE_LABEL = {
  individual: 'Cá nhân',
  course: 'Lớp học',
  class: 'Lớp học',
  subjects: 'Học phần',
  subject: 'Học phần',
  students: 'Sinh viên',
  student: 'Sinh viên',
};

// ─── Main page ────────────────────────────────────────────────────────────────

const TeacherNotificationPage = () => {
  const {
    notifications,
    pagination,
    unreadCount,
    loading,
    loadingMore,
    error,
    loadMoreNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotification();

  const [tab, setTab] = useState('received');
  const [sentSubTab, setSentSubTab] = useState(TARGET_SUBJECTS);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [allSentRaw, setAllSentRaw] = useState([]);
  const [studentByUserId, setStudentByUserId] = useState(new Map());
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState(null);
  const [sentFetched, setSentFetched] = useState(false);

  const fetchAllSent = useCallback(async () => {
    const limit = 100;
    let offset = 0;
    let all = [];

    const res = await notificationService.getMyCreatedNotifications({ limit, offset });
    if (!res?.success) throw new Error(res?.message || 'Không thể tải thông báo đã gửi');

    const firstData = res.data || {};
    const firstPage = Array.isArray(firstData.notifications) ? firstData.notifications : [];
    const total = Number(firstData.pagination?.total) || firstPage.length;
    all = [...firstPage];
    offset += limit;

    while (all.length < total) {
      const pageRes = await notificationService.getMyCreatedNotifications({ limit, offset });
      if (!pageRes?.success) break;
      const pageItems = Array.isArray(pageRes.data?.notifications) ? pageRes.data.notifications : [];
      if (pageItems.length === 0) break;
      all = [...all, ...pageItems];
      offset += limit;
    }

    return all;
  }, []);

  const fetchSentData = useCallback(async () => {
    setSentLoading(true);
    setSentError(null);
    try {
      const [rawNotifications, studentsRes] = await Promise.all([
        fetchAllSent(),
        teacherService.getMyStudents(),
      ]);

      const studentsArr = Array.isArray(studentsRes?.data?.students)
        ? studentsRes.data.students
        : [];
      const sMap = new Map();
      studentsArr.forEach((s) => {
        const uid = s?.user?.userId;
        if (uid) sMap.set(String(uid), s);
      });

      setAllSentRaw(Array.isArray(rawNotifications) ? rawNotifications : []);
      setStudentByUserId(sMap);
      setSentFetched(true);
    } catch (err) {
      setSentError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setSentLoading(false);
    }
  }, [fetchAllSent]);

  useEffect(() => {
    if (tab === 'sent' && !sentFetched && !sentLoading) {
      fetchSentData();
    }
  }, [tab, sentFetched, sentLoading, fetchSentData]);

  useEffect(() => { setSearchKeyword(''); }, [sentSubTab]);

  const groupedNotifications = useMemo(
    () => buildGroupedData(allSentRaw, studentByUserId),
    [allSentRaw, studentByUserId]
  );

  const filteredGroups = useMemo(() => {
    const kw = normalizeText(searchKeyword);
    return groupedNotifications
      .filter((g) => g.mode === sentSubTab)
      .filter((g) => !kw || normalizeText(g.searchBlob).includes(kw));
  }, [groupedNotifications, sentSubTab, searchKeyword]);

  const hasMoreReceived = notifications.length < (pagination?.total ?? 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] sm:px-6">
      <div className="mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Thông báo</h1>
          {tab === 'received' && unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
            >
              <CheckCheck size={16} /> Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <Tabs.Root value={tab} onValueChange={setTab} className="w-full">
          <Tabs.List className="flex p-1 bg-slate-200/60 rounded-xl mb-6 w-fit">
            <Tabs.Trigger
              value="received"
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow text-slate-600"
            >
              <Inbox size={18} />
              Đã nhận
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="sent"
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow text-slate-600"
            >
              <Send size={18} /> Đã gửi
            </Tabs.Trigger>
          </Tabs.List>

          {/* ── Tab Đã nhận ── */}
          <Tabs.Content value="received" className="outline-none">
            {loading ? (
              <Skeleton />
            ) : error ? (
              <ErrorState message={error} />
            ) : notifications.length === 0 ? (
              <EmptyState message="Bạn chưa có thông báo nào" />
            ) : (
              <div className="space-y-4">
                {notifications.map((item) => {
                  const meta = item.metadata ?? {};
                  const senderName = meta.sender_name ?? item.sender_name;
                  const senderRole = meta.sender_role ?? item.sender_role;
                  const targetModeLabel = TARGET_MODE_LABEL[meta.target_mode];
                  return (
                    <div
                      key={item.id}
                      onClick={() => !item.is_read && markNotificationAsRead(item.id)}
                      className={`bg-white p-5 rounded-2xl border shadow-sm transition-all flex gap-4 ${
                        !item.is_read
                          ? 'border-blue-100 hover:shadow-md cursor-pointer'
                          : 'border-slate-100'
                      }`}
                    >
                      <div className={`mt-1 h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${
                        !item.is_read ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <Bell size={22} fill={!item.is_read ? 'currentColor' : 'none'} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className={`text-base font-bold truncate ${!item.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {item.title}
                            </h3>
                            {!item.is_read && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                          <span className="shrink-0 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded flex items-center gap-1">
                            <Clock size={12} /> {timeAgo(item.created_at)}
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm mb-3 leading-relaxed line-clamp-2">
                          {getNotificationText(item) || (item.content ?? item.body)}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 border-t border-slate-50">
                          {senderName && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                              <User size={13} />
                              {senderName}
                              {senderRole && <span className="text-slate-400 font-normal">· {senderRole}</span>}
                            </div>
                          )}
                          {targetModeLabel && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Send size={12} /> {targetModeLabel}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
                            <Calendar size={13} /> {formatDate(item.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {hasMoreReceived && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={loadMoreNotifications}
                      disabled={loadingMore}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-blue-100 hover:bg-blue-50 px-6 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      {loadingMore ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                      {loadingMore ? 'Đang tải...' : 'Tải thêm'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </Tabs.Content>

          {/* ── Tab Đã gửi ── */}
          <Tabs.Content value="sent" className="outline-none">
            {sentLoading ? (
              <Skeleton />
            ) : sentError ? (
              <ErrorState message={sentError} onRetry={fetchSentData} />
            ) : (
              <>
                {/* Sub-tab + search */}
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div className="flex p-1 bg-slate-100 rounded-lg gap-1">
                    <button
                      onClick={() => setSentSubTab(TARGET_SUBJECTS)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                        sentSubTab === TARGET_SUBJECTS
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <BookOpen size={15} /> Học phần
                    </button>
                    <button
                      onClick={() => setSentSubTab(TARGET_STUDENTS)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                        sentSubTab === TARGET_STUDENTS
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Users size={15} /> Sinh viên
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
                    <Search size={15} className="text-slate-400 shrink-0" />
                    <input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder={
                        sentSubTab === TARGET_SUBJECTS
                          ? 'Tìm mã, tên, nhóm, hình thức...'
                          : 'Tìm mã, tên sinh viên...'
                      }
                      className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {filteredGroups.length === 0 ? (
                  <EmptyState message={
                    searchKeyword
                      ? 'Không tìm thấy kết quả phù hợp'
                      : sentSubTab === TARGET_SUBJECTS
                        ? 'Chưa có thông báo học phần nào'
                        : 'Chưa có thông báo sinh viên nào'
                  } />
                ) : (
                  <div className="space-y-4">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all"
                      >
                        <div className="flex justify-between items-start mb-1 gap-3">
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {group.title}
                          </h3>
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded ring-1 ring-emerald-100">
                            Đã gửi
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {timeAgo(group.sentAt)}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(group.sentAt)}
                          </span>
                        </div>

                        {group.message && (
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            {group.message}
                          </p>
                        )}

                        <div className="rounded-xl bg-indigo-50 px-4 py-3">
                          <p className="text-indigo-700 text-xs font-semibold mb-2 flex items-center gap-1.5">
                            {sentSubTab === TARGET_SUBJECTS
                              ? <><BookOpen size={13} /> Học phần (mã, tên, nhóm, hình thức học)</>
                              : <><Users size={13} /> Sinh viên nhận ({group.recipientList.length} người)</>
                            }
                          </p>
                          {sentSubTab === TARGET_SUBJECTS ? (
                            group.subjects.length > 0 ? (
                              <ul className="space-y-1">
                                {group.subjects.map((s, i) => (
                                  <li key={i} className="text-indigo-900 text-sm flex items-start gap-1.5">
                                    <Hash size={12} className="mt-0.5 shrink-0 text-indigo-400" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-indigo-400 text-xs">Không có dữ liệu học phần trong metadata.</p>
                            )
                          ) : (
                            group.recipientList.length > 0 ? (
                              <ul className="space-y-1">
                                {group.recipientList.slice(0, 5).map((r, i) => (
                                  <li key={i} className="text-indigo-900 text-sm flex items-start gap-1.5">
                                    <User size={12} className="mt-0.5 shrink-0 text-indigo-400" />
                                    {r}
                                  </li>
                                ))}
                                {group.recipientList.length > 5 && (
                                  <li className="text-indigo-400 text-xs pl-[18px]">
                                    +{group.recipientList.length - 5} sinh viên khác
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-indigo-400 text-xs">Không có dữ liệu sinh viên nhận.</p>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default TeacherNotificationPage;
