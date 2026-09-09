import { useEffect, useState } from "react";
import {
  Bookmark,
  FolderPlus,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  createCollection,
  deleteCollection,
  getCollections,
  renameCollection,
  removePostFromCollection,
} from "../api/collection.api";

const Skeleton = () => (
  <div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-surface-darkBorder" />
);

export default function Saved() {
  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getCollections();
      const next = result.collections || [];
      setCollections(next);
      setSelectedId((current) => current || next[0]?._id || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load collections.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const result = await createCollection(name.trim());
      setCollections((current) => [result.collection, ...current]);
      setSelectedId(result.collection._id);
      setName("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create collection.",
      );
    } finally {
      setSaving(false);
    }
  };

  const rename = async (id) => {
    if (!editingName.trim()) return;
    try {
      const result = await renameCollection(id, editingName.trim());
      setCollections((current) =>
        current.map((item) =>
          item._id === id ? { ...item, name: result.collection.name } : item,
        ),
      );
      setEditingId(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to rename collection.",
      );
    }
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this collection? Saved posts will remain available.",
      )
    )
      return;
    try {
      await deleteCollection(id);
      setCollections((current) => current.filter((item) => item._id !== id));
      setSelectedId((current) => (current === id ? null : current));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete collection.",
      );
    }
  };

  const selected = collections.find((item) => item._id === selectedId);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
          Your library
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink dark:text-slate-100">
          Saved collections
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          Keep useful learning moments organized by subject.
        </p>
      </header>
      {error && (
        <div className="flex justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <span>{error}</span>
          <button type="button" onClick={load} className="font-semibold">
            Retry
          </button>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <form onSubmit={create} className="flex gap-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New collection"
              aria-label="New collection name"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-surface-darkBorder dark:bg-surface-darkCard dark:text-slate-100"
            />
            <button
              disabled={saving}
              type="submit"
              aria-label="Create collection"
              className="rounded-xl bg-brand-600 p-2 text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              <FolderPlus className="h-5 w-5" />
            </button>
          </form>
          {loading ? (
            Array.from({ length: 3 }, (_, index) => <Skeleton key={index} />)
          ) : collections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-ink-faint dark:border-surface-darkBorder">
              <Bookmark className="mx-auto mb-2 h-6 w-6" />
              Create your first collection.
            </div>
          ) : (
            collections.map((collection) => (
              <button
                type="button"
                key={collection._id}
                onClick={() => setSelectedId(collection._id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${selectedId === collection._id ? "border-brand-400 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30" : "border-slate-200 bg-white hover:border-brand-200 dark:border-surface-darkBorder dark:bg-surface-darkCard"}`}
              >
                <span>
                  <span className="block font-semibold text-ink dark:text-slate-100">
                    {collection.name}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {collection.posts?.length || 0} saved items
                  </span>
                </span>
                <MoreVertical className="h-4 w-4 text-ink-faint" />
              </button>
            ))
          )}
        </aside>
        <main className="min-h-90 rounded-3xl border border-slate-200 bg-white p-5 dark:border-surface-darkBorder dark:bg-surface-darkCard">
          {!selected ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
              <Bookmark className="h-10 w-10 text-brand-500" />
              <h2 className="mt-3 font-bold text-ink dark:text-slate-100">
                Select a collection
              </h2>
              <p className="mt-1 text-sm text-ink-faint">
                Your saved posts will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-surface-darkBorder">
                <div>
                  <h2 className="text-xl font-bold text-ink dark:text-slate-100">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-ink-faint">
                    {selected.posts?.length || 0} saved items
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(selected._id);
                      setEditingName(selected.name);
                    }}
                    className="rounded-lg p-2 text-ink-faint hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-surface-darkBorder"
                    aria-label="Rename collection"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(selected._id)}
                    className="rounded-lg p-2 text-ink-faint hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                    aria-label="Delete collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {editingId === selected._id && (
                <div className="flex gap-2 py-4">
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-surface-darkBorder dark:bg-surface-dark"
                  />
                  <button
                    type="button"
                    onClick={() => rename(selected._id)}
                    className="rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white"
                  >
                    Save
                  </button>
                </div>
              )}
              {selected.posts?.length ? (
                <div className="grid gap-3 py-5 sm:grid-cols-2">
                  {selected.posts.map((post) => (
                    <article
                      key={post._id}
                      className="rounded-2xl border border-slate-200 p-4 dark:border-surface-darkBorder"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                            {post.subject}
                          </span>
                          <h3 className="mt-1 font-semibold text-ink dark:text-slate-100">
                            {post.caption ||
                              post.description ||
                              post.questionTitle ||
                              "Saved learning post"}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await removePostFromCollection(
                              selected._id,
                              post._id,
                            );
                            load();
                          }}
                          className="text-xs text-ink-faint hover:text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-65 flex-col items-center justify-center text-center">
                  <Bookmark className="h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-sm text-ink-faint">
                    No posts in this collection yet.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
