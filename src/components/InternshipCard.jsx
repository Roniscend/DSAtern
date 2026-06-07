import { motion } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

function getMatchColor(score) {
  if (score >= 70) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (score >= 40) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

function getMatchLabel(score) {
  if (score >= 70) return 'High Match';
  if (score >= 40) return 'Moderate';
  return 'Low Match';
}

export default function InternshipCard({ internship, index, userSkills, onViewDetails }) {
  const matchPercentage = Math.round(internship.score * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass glass-hover rounded-3xl p-6 flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div className={cn('px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider', getMatchColor(matchPercentage))}>
          {getMatchLabel(matchPercentage)}
        </div>
      </div>

      <div className="space-y-2 flex-grow">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{internship.role}</h3>
        <p className="text-slate-400 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-secondary" />
          {internship.company}
        </p>
        <p className="text-slate-500 text-sm mt-3 line-clamp-2">{internship.description}</p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">Match Score</span>
            <span className="text-gradient font-bold">{matchPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {internship.skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-medium border',
                userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-white/5 border-white/10 text-slate-500'
              )}
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 4 && (
            <span className="text-[10px] text-slate-500 px-1">+{internship.skills.length - 4} more</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            {internship.location}
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs font-bold text-white bg-primary/20 hover:bg-primary transition-colors px-4 py-2 rounded-xl border border-primary/30"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
