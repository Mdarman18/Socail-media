import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

export default function CommunityCard({ community }) {
  const navigate = useNavigate();
  const communityId = community._id || community.id;

  return (
    <div
      onClick={() => navigate(`/community/${communityId}`)}
      className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      {/* Card Thumbnail */}
      <div className="h-36 w-full bg-slate-800 relative overflow-hidden">
        <img
          src={
            community.img ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
          }
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
          {community.category}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
            {community.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            <span>
              {community.members ? community.members.length : 0} members
            </span>
          </div>
          <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Hub <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
