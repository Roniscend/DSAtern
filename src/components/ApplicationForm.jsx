import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, User, Mail, FileText } from 'lucide-react';

export default function ApplicationForm({ internship, onSubmit, onCancel }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    message: '',
  });

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">Application Sent!</h3>
        <p className="text-slate-400">Successfully applied to {internship.company}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              required
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              required
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Resume Link / URL</label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            required
            type="url"
            value={formData.resume}
            onChange={handleChange('resume')}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white"
            placeholder="https://drive.google.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Cover Letter / Message</label>
        <textarea
          value={formData.message}
          onChange={handleChange('message')}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 min-h-[120px] text-white resize-none"
          placeholder="Tell them why you're a great fit..."
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Submit Application
        </button>
      </div>
    </form>
  );
}
