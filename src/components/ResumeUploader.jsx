import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { parseResume } from '../services/resumeParser';
import { cn } from '../utils/cn';

/**
 * ResumeUploader — drag-and-drop resume upload with client-side skill detection.
 * Calls onSkillsDetected(skills[]) when user confirms the detected skills.
 */
export default function ResumeUploader({ onSkillsDetected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'parsing' | 'done' | 'error'
  const [fileName, setFileName] = useState('');
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setErrorMsg(`Unsupported file type ".${ext}". Please upload a PDF or TXT file.`);
      setStatus('error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 5 MB.');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('parsing');
    setErrorMsg('');

    try {
      const { detectedSkills: skills } = await parseResume(file);
      setDetectedSkills(skills);
      setSelectedSkills(new Set(skills)); // pre-select all detected skills
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to parse resume.');
      setStatus('error');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill); else next.add(skill);
      return next;
    });
  };

  const handleApply = () => {
    onSkillsDetected(Array.from(selectedSkills));
    // Reset to idle so the uploader can be used again
    setStatus('idle');
    setFileName('');
    setDetectedSkills([]);
    setSelectedSkills(new Set());
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName('');
    setDetectedSkills([]);
    setSelectedSkills(new Set());
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Auto-detect from Resume
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ── IDLE: Drop zone ── */}
        {status === 'idle' && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 px-6 cursor-pointer transition-all duration-300 group',
              isDragging
                ? 'border-accent bg-accent/10 scale-[1.02]'
                : 'border-white/15 bg-white/3 hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <motion.div
              animate={{ y: isDragging ? -6 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors"
            >
              <Upload className={cn('w-7 h-7 transition-colors', isDragging ? 'text-accent' : 'text-slate-500 group-hover:text-primary')} />
            </motion.div>
            <div className="text-center">
              <p className="text-slate-300 font-medium">Drop your resume here</p>
              <p className="text-slate-500 text-xs mt-1">PDF or TXT · Max 5 MB</p>
            </div>
            <span className="text-xs text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
              Browse file
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => processFile(e.target.files[0])}
            />
          </motion.div>
        )}

        {/* ── PARSING: Spinner ── */}
        {status === 'parsing' && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/3 py-10 px-6"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-slate-200 font-medium">Analysing your resume…</p>
              <p className="text-slate-500 text-xs mt-1 truncate max-w-[240px]">{fileName}</p>
            </div>
          </motion.div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 py-5 px-5"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-red-300 font-medium text-sm">{errorMsg}</p>
            </div>
            <button onClick={handleReset} className="text-slate-400 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ── DONE: Skill review ── */}
        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-300 font-medium truncate max-w-[200px]">{fileName}</span>
              </div>
              <button onClick={handleReset} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {detectedSkills.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  No recognisable tech skills were found. Try a different file or add skills manually.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      <CheckCircle2 className="inline w-3.5 h-3.5 text-emerald-400 mr-1 mb-0.5" />
                      {detectedSkills.length} skill{detectedSkills.length !== 1 ? 's' : ''} detected — tap to toggle
                    </p>
                    <button
                      onClick={() =>
                        setSelectedSkills(
                          selectedSkills.size === detectedSkills.length ? new Set() : new Set(detectedSkills)
                        )
                      }
                      className="text-[11px] text-primary hover:underline"
                    >
                      {selectedSkills.size === detectedSkills.length ? 'Deselect all' : 'Select all'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {detectedSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200',
                          selectedSkills.has(skill)
                            ? 'bg-accent/15 border-accent/40 text-accent shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                            : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/25'
                        )}
                      >
                        {selectedSkills.has(skill) && <CheckCircle2 className="inline w-3 h-3 mr-1 mb-0.5" />}
                        {skill}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white text-sm font-medium transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  disabled={selectedSkills.size === 0}
                  className="flex-1 py-2.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply {selectedSkills.size > 0 ? `${selectedSkills.size} ` : ''}Skill{selectedSkills.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
