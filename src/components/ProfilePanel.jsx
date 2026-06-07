import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, GraduationCap, FileText, ChevronDown,
  Camera, RotateCcw, Briefcase, TrendingUp
} from 'lucide-react';
import { cn } from '../utils/cn';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

const LEVEL_COLORS = {
  Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  Advanced: 'text-violet-400 bg-violet-400/10 border-violet-400/25',
};

/**
 * ProfilePanel — slide-in side panel for user profile management.
 * All data persisted to localStorage via the useProfile hook.
 */
export default function ProfilePanel({ isOpen, onClose, profile, updateProfile, selectedSkills, appliedCount }) {
  const avatarInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ avatar: ev.target.result });
    reader.readAsDataURL(file);
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            key="profile-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{
              background: 'rgba(10, 10, 15, 0.95)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
              <h2 className="text-lg font-bold text-white">My Profile</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 scrollbar-thin">

              {/* Avatar + Quick Stats */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/15 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-600" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {profile.avatar && (
                    <button
                      onClick={() => updateProfile({ avatar: null })}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Quick stats row */}
                <div className="flex gap-4 w-full">
                  <div className="flex-1 flex flex-col items-center gap-1 bg-white/4 rounded-2xl py-3 border border-white/8">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-xl font-bold text-white">{appliedCount ?? profile.appliedCount ?? 0}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Applied</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 bg-white/4 rounded-2xl py-3 border border-white/8">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="text-xl font-bold text-white">{selectedSkills?.length ?? 0}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Skills</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 bg-white/4 rounded-2xl py-3 border border-white/8">
                    <span className="text-lg">🎯</span>
                    <span className={cn('text-xs font-bold border px-2 py-0.5 rounded-full', LEVEL_COLORS[profile.level] || LEVEL_COLORS.Beginner)}>
                      {profile.level?.[0] ?? 'B'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Level</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>

                {/* College */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" /> College / University
                  </label>
                  <input
                    type="text"
                    value={profile.college}
                    onChange={(e) => updateProfile({ college: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. MIT, IIT Bombay"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value.slice(0, 200) })}
                    className={cn(inputClass, 'min-h-[80px] resize-none')}
                    placeholder="Tell recruiters about yourself…"
                  />
                  <p className="text-right text-[10px] text-slate-600">{profile.bio?.length ?? 0}/200</p>
                </div>

                {/* Skill Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ChevronDown className="w-3.5 h-3.5" /> Skill Level
                  </label>
                  <div className="flex gap-2">
                    {LEVEL_OPTIONS.map(level => (
                      <button
                        key={level}
                        onClick={() => updateProfile({ level })}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                          profile.level === level
                            ? LEVEL_COLORS[level]
                            : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/25'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Skills */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Skills</span>
                  {selectedSkills?.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold">
                      {selectedSkills.length}
                    </span>
                  )}
                </div>
                {selectedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-primary/10 border border-primary/25 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">No skills selected yet. Select skills on the main page.</p>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-white/5 shrink-0">
              <p className="text-[11px] text-slate-600 text-center">
                Profile saved automatically · Local storage only
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
