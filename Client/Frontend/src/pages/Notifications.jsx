import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, RefreshCw } from "lucide-react";
import { useSocketContext } from "../context/SocketContext";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api";

const NotificationSkeleton = () => (
  <div className="flex animate-pulse items-start gap-3 border-b border-slate-100 p-4 dark:border-surface-darkBorder">
    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-surface-darkBorder" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-surface-darkBorder" />
      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-surface-darkBorder" />
    </div>
  </div>
);

const formatTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function Notifications() {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async (nextPage = 1) => {
    setError("");
    if (nextPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const result = await getNotifications(nextPage);
      setNotifications((current) =>
        nextPage === 1
          ? result.notifications || []
          : [...current, ...(result.notifications || [])],
      );
      setUnread(result.unread || 0);
      setHasMore(Boolean(result.pagination?.hasMore));
      setPage(nextPage);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load notifications.",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;
    const handleNotification = (notification) => {
      setNotifications((current) => [notification, ...current]);
      setUnread((current) => current + 1);
    };
    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket]);

  const handleRead = async (notification) => {
    if (notification.read) return;
    try {
      await markNotificationRead(notification._id);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item,
        ),
      );
      setUnread((current) => Math.max(0, current - 1));
    } catch {
      setError("Unable to mark this notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true })),
      );
      setUnread(0);
    } catch {
      setError("Unable to mark notifications as read.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Stay in the loop
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink dark:text-slate-100">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-ink-faint">
            Updates from your learning network.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={!unread}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-darkBorder dark:bg-surface-darkCard dark:text-slate-300"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </button>
      </header>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadNotifications(page)}
            className="inline-flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-surface-darkBorder dark:bg-surface-darkCard">
        {loading ? (
          Array.from({ length: 5 }, (_, index) => (
            <NotificationSkeleton key={index} />
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
              <Bell className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink dark:text-slate-100">
              You&apos;re all caught up
            </h2>
            <p className="mt-1 max-w-sm text-sm text-ink-faint">
              New follows and learning milestones will appear here.
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <button
                type="button"
                key={notification._id}
                onClick={() => handleRead(notification)}
                className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 dark:border-surface-darkBorder dark:hover:bg-slate-800/40 ${notification.read ? "" : "bg-brand-50/50 dark:bg-brand-950/20"}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={
                      notification.actor?.img ||
                      "https://via.placeholder.com/80"
                    }
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {!notification.read && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-brand-600 ring-2 ring-white dark:ring-surface-darkCard" />
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-ink dark:text-slate-100">
                    {notification.message}
                  </span>
                  <span className="mt-1 block text-xs text-ink-faint">
                    {formatTime(notification.createdAt)}
                  </span>
                </span>
                {notification.read ? (
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                )}
              </button>
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => loadNotifications(page + 1)}
                disabled={loadingMore}
                className="flex w-full items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:opacity-60 dark:text-brand-300 dark:hover:bg-brand-950/20"
              >
                {loadingMore && <RefreshCw className="h-4 w-4 animate-spin" />}
                Load more
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
