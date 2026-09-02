import React from "react";
import { Users, Tag } from "lucide-react";

export default function CommunityCard({ community }) {
  const {
    name,
    description,
    category,
    tags = [],
    img,
    memberCount = 0,
  } = community;
  console.log(community);

  return (
    <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
      {/* Banner */}
      <div className="h-28 w-full bg-linear-to-br from-indigo-600 to-slate-900 relative overflow-hidden">
        {img && (
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 text-indigo-700 dark:text-indigo-300 backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
          {name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {memberCount} members
          </span>
          <button
            type="button"
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Join →
          </button>
        </div>
      </div>
    </div>
  );
}
