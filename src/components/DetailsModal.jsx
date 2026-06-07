import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Briefcase, CheckCircle2, MapPin, Globe, Zap
} from 'lucide-react';
import { cn } from '../utils/cn';
import ApplicationForm from './ApplicationForm';

export default function DetailsModal({ internship, onClose, userSkills, onApply }) {
  const [isApplying, setIsApplying] = useState(false);
  const matchPercentage = Math.round(internship.score * 100);

  const handleSubmit = () => {
    if (onApply) onApply();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/20 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="p-8 md:p-12 space-y-8">
          {!isApplying ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{internship.role}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-400 text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                        {internship.company}
                      </p>
                      {internship.source && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                          Via {internship.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass bg-white/5 rounded-3xl p-6 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Opportunity Details</h4>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-500" />
                      <span>{internship.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-slate-500" />
                      <span>Immediate Start</span>
                    </div>
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-3xl p-6 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-secondary">Match Analysis</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-4xl font-bold text-gradient">{matchPercentage}%</span>
                      <span className="text-sm text-slate-400 pb-1">Coverage</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${matchPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">About the Role</h4>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {internship.description} This is a unique opportunity to join {internship.company} and work on cutting-edge projects. You will be part of a dynamic team focused on innovation and excellence.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map(skill => {
                    const isMatched = userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                    return (
                      <span
                        key={skill}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                          isMatched
                            ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-500'
                        )}
                      >
                        {skill}
                        {isMatched && <CheckCircle2 className="w-3 h-3 inline ml-2" />}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Apply for this Position
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Apply to {internship.company}</h2>
                <p className="text-slate-400">Complete the form below to submit your application.</p>
              </div>
              <ApplicationForm
                internship={internship}
                onSubmit={handleSubmit}
                onCancel={() => setIsApplying(false)}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
