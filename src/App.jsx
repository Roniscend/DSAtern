import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Target, 
  Briefcase, 
  MapPin, 
  Zap, 
  CheckCircle2, 
  X,
  Code2,
  Cpu,
  Globe
} from 'lucide-react';
import { INTERNSHIPS, ALL_SKILLS } from './data/internships';
import { InternshipMatcher } from './logic/matching';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchExternalInternships } from './services/api';
import ApplicationForm from './components/ApplicationForm';

// Helper for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const matcher = new InternshipMatcher(INTERNSHIPS);

export default function App() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'external'

  const allInternships = useMemo(() => {
    return INTERNSHIPS;
  }, []);

  const [matcher, setMatcher] = useState(new InternshipMatcher(INTERNSHIPS));

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const externalData = await fetchExternalInternships();
      const combined = [...INTERNSHIPS, ...externalData];
      setMatcher(new InternshipMatcher(combined));
      setActiveTab('external');
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    if (selectedSkills.length > 0) {
      const results = matcher.getRecommendations(selectedSkills);
      setRecommendations(results);
    } else {
      setRecommendations([]);
    }
  }, [selectedSkills]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const clearSkills = () => setSelectedSkills([]);

  const filteredRecommendations = useMemo(() => {
    if (!searchQuery) return recommendations;
    return recommendations.filter(item => 
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recommendations, searchQuery]);

  return (
    <div className="min-h-screen text-slate-200 p-4 md:p-8 font-['Outfit'] selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <header className="text-center space-y-6 pt-10">
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
              Our intelligent algorithm uses Jaccard Similarity and HashMap indexing to map your skills to the most relevant industry opportunities.
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
              <p className="text-slate-400 text-sm">Select the skills you currently possess to see matches.</p>
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

          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm transition-all duration-300",
                  selectedSkills.includes(skill)
                    ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10"
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </section>

        {/* Results Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('local')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === 'local' ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              Curated Jobs
            </button>
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'external' ? "bg-secondary text-white shadow-lg" : "text-slate-400 hover:text-white disabled:opacity-50"
              )}
            >
              {isSyncing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Globe className="w-4 h-4" />}
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
                <h3 className="text-xl font-medium text-slate-300">No matches found for "{searchQuery}"</h3>
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
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Stats */}
      <footer className="max-w-6xl mx-auto py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm">Built with React 19 + Tailwind CSS + Framer Motion</span>
        </div>
        <div className="flex gap-6 text-sm">
          <span>O(log n) Search</span>
          <span>O(1) Skill Lookup</span>
          <span>Jaccard Index</span>
        </div>
      </footer>
    </div>
  );
}

function InternshipCard({ internship, index, userSkills, onViewDetails }) {
  const matchPercentage = Math.round(internship.score * 100);
  
  const getMatchColor = (score) => {
    if (score >= 70) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (score >= 40) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  const getMatchLabel = (score) => {
    if (score >= 70) return "High Match";
    if (score >= 40) return "Moderate";
    return "Low Match";
  };

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
        <div className={cn("px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", getMatchColor(matchPercentage))}>
          {getMatchLabel(matchPercentage)}
        </div>
      </div>

      <div className="space-y-2 flex-grow">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{internship.role}</h3>
        <p className="text-slate-400 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-secondary" />
          {internship.company}
        </p>
        <p className="text-slate-500 text-sm mt-3 line-clamp-2">
          {internship.description}
        </p>
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
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-right from-primary to-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {internship.skills.slice(0, 4).map(skill => (
            <span 
              key={skill}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-medium border",
                userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-white/5 border-white/10 text-slate-500"
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

function DetailsModal({ internship, onClose, userSkills }) {
  const [isApplying, setIsApplying] = useState(false);
  const matchPercentage = Math.round(internship.score * 100);

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
                      <span className="text-sm text-slate-400 pb-1">Compatibility</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-right from-primary to-accent"
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
                          "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                          isMatched 
                            ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                            : "bg-white/5 border-white/10 text-slate-500"
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
                onSubmit={onClose} 
                onCancel={() => setIsApplying(false)} 
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
