import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Target, Zap, X, Code2, Cpu, Globe, User, AlertCircle
} from 'lucide-react';
import { INTERNSHIPS, ALL_SKILLS } from './data/internships';
import { InternshipMatcher } from './logic/matching';
import { fetchExternalInternships } from './services/api';
import { useProfile } from './hooks/useProfile';
import { cn } from './utils/cn';
import InternshipCard from './components/InternshipCard';
import DetailsModal from './components/DetailsModal';
import ResumeUploader from './components/ResumeUploader';
import ProfilePanel from './components/ProfilePanel';

// Pre-built matchers for local vs. external data
const localMatcher = new InternshipMatcher(INTERNSHIPS);

export default function App() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);

  // External sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'external'
  const [externalMatcher, setExternalMatcher] = useState(null);
  const [syncError, setSyncError] = useState('');

  // Profile panel
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, updateProfile, incrementApplied } = useProfile();

  // Choose the active matcher based on tab
  const activeMatcher = activeTab === 'external' && externalMatcher ? externalMatcher : localMatcher;

  // Derive recommendations directly from state — no effect needed
  const recommendations = useMemo(() => {
    if (selectedSkills.length === 0) return [];
    return activeMatcher.getRecommendations(selectedSkills);
  }, [selectedSkills, activeMatcher]);

  // ── Sync external jobs ──
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError('');
    try {
      const externalData = await fetchExternalInternships();
      const combined = [...INTERNSHIPS, ...externalData];
      setExternalMatcher(new InternshipMatcher(combined));
      setActiveTab('external');
    } catch (error) {
      console.error('Sync failed', error);
      setSyncError('Failed to sync jobs. Check your connection and try again.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Switch back to local curated tab
  const handleTabLocal = useCallback(() => {
    setActiveTab('local');
    setSyncError('');
  }, []);

  // ── Skill management ──
  const toggleSkill = useCallback((skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }, []);

  const clearSkills = useCallback(() => setSelectedSkills([]), []);

  // Merge detected resume skills without duplicates
  const handleSkillsDetected = useCallback((detectedSkills) => {
    setSelectedSkills(prev => {
      const lowerPrev = new Set(prev.map(s => s.toLowerCase()));
      const newSkills = detectedSkills.filter(s => !lowerPrev.has(s.toLowerCase()));
      return [...prev, ...newSkills];
    });
  }, []);

  // ── Filtered results ──
  const filteredRecommendations = useMemo(() => {
    if (!searchQuery) return recommendations;
    const q = searchQuery.toLowerCase();
    return recommendations.filter(item =>
      item.company.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q)
    );
  }, [recommendations, searchQuery]);

  // Count skills detected banner
  const [lastDetectedCount, setLastDetectedCount] = useState(0);
  const handleSkillsDetectedWithFeedback = useCallback((skills) => {
    setLastDetectedCount(skills.length);
    handleSkillsDetected(skills);
    // Clear banner after 4 seconds
    setTimeout(() => setLastDetectedCount(0), 4000);
  }, [handleSkillsDetected]);

  return (
    <div className="min-h-screen text-slate-200 p-4 md:p-8 font-['Outfit'] selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <header className="relative text-center space-y-6 pt-10">
          {/* Profile button — top right of header */}
          <div className="absolute right-0 top-10">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="relative w-11 h-11 rounded-full bg-white/5 border border-white/15 hover:border-primary/50 transition-all overflow-hidden flex items-center justify-center group"
              title="My Profile"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              )}
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium tracking-wide uppercase">
              DSA-Powered Matching
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-6">
              Find Your Perfect <br />
              <span className="text-gradient">Internship Match</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              Our intelligent algorithm uses Coverage Scoring and HashMap indexing to map your skills to the most relevant industry opportunities.
            </p>
          </motion.div>
        </header>

        {/* Skill Input Section */}
        <section className="glass rounded-3xl p-6 md:p-10 space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="text-primary w-6 h-6" />
                Your Skill Set
              </h2>
              <p className="text-slate-400 text-sm">Select your skills manually, or upload your resume below.</p>
            </div>

            {selectedSkills.length > 0 && (
              <button
                onClick={clearSkills}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Clear all
              </button>
            )}
          </div>

          {/* Resume detected banner */}
          <AnimatePresence>
            {lastDetectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-2.5"
              >
                <Zap className="w-4 h-4 shrink-0" />
                {lastDetectedCount} skill{lastDetectedCount !== 1 ? 's' : ''} detected from your resume and added!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual skill tags */}
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'px-4 py-2 rounded-xl border text-sm transition-all duration-300',
                  selectedSkills.includes(skill)
                    ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10'
                )}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Resume Uploader */}
          <ResumeUploader onSkillsDetected={handleSkillsDetectedWithFeedback} />
        </section>

        {/* Results Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={handleTabLocal}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === 'local' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
              )}
            >
              Curated Jobs
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2',
                activeTab === 'external' ? 'bg-secondary text-white shadow-lg' : 'text-slate-400 hover:text-white disabled:opacity-50'
              )}
            >
              {isSyncing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              Sync Industry Jobs
            </button>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <Cpu className="w-4 h-4 text-secondary" />
            Matching {filteredRecommendations.length} opportunities
          </div>
        </div>

        {/* Sync error banner */}
        <AnimatePresence>
          {syncError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-5 py-3"
            >
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {syncError}
              </div>
              <button onClick={() => setSyncError('')} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {selectedSkills.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center glass rounded-3xl"
              >
                <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-300">Select skills to start matching</h3>
                <p className="text-slate-500 mt-2">The ranking algorithm will update in real-time.</p>
              </motion.div>
            ) : filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((internship, index) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  index={index}
                  userSkills={selectedSkills}
                  onViewDetails={() => setSelectedInternship(internship)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center glass rounded-3xl"
              >
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-300">
                  No matches found{searchQuery ? ` for "${searchQuery}"` : ''}
                </h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or skills.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Internship Details Modal */}
        <AnimatePresence>
          {selectedInternship && (
            <DetailsModal
              internship={selectedInternship}
              onClose={() => setSelectedInternship(null)}
              userSkills={selectedSkills}
              onApply={incrementApplied}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm">Built with React 19 + Tailwind CSS + Framer Motion</span>
        </div>
        <div className="flex gap-6 text-sm">
          <span>O(log n) Search</span>
          <span>O(1) Skill Lookup</span>
          <span>Coverage Score (|A∩B|/|B|)</span>
        </div>
      </footer>

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        updateProfile={updateProfile}
        selectedSkills={selectedSkills}
        appliedCount={profile.appliedCount}
      />
    </div>
  );
}
