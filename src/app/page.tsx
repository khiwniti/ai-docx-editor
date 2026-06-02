'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, FileText, Zap, Sparkles, Code2 } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 selection:bg-brand-500/30 font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SuperDoc AI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/editor"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Powered by MCP Agent Orchestration</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            The Document Editor <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 animate-gradient bg-300%">
              That Thinks With You
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
          >
            Experience the future of writing. Harness the power of autonomous AI agents seamlessly integrated into an enterprise-grade DOCX editor.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/editor" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
              <span className="relative z-10">Start Editing</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <a href="#features" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-zinc-800/50 text-white font-medium text-lg border border-zinc-700/50 hover:bg-zinc-800 transition-colors backdrop-blur-sm">
              See Features
            </a>
          </motion.div>
        </motion.main>

        {/* Interactive Feature Demonstration Section */}
        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the AI Era</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Not just another text editor. SuperDoc AI is engineered from the ground up to orchestrate complex LLM workflows directly on your document.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Bot className="w-6 h-6 text-brand-400" />,
                  title: 'MCP Agent Orchestration',
                  desc: 'Multi-agent architecture using the Model Context Protocol. Reviewers, Writers, and Analysts work on your document simultaneously.',
                  delay: 0
                },
                {
                  icon: <Zap className="w-6 h-6 text-purple-400" />,
                  title: 'Real-time Editing',
                  desc: 'Watch as AI agents format, rewrite, and analyze your document in real-time with flawless collaborative syncing.',
                  delay: 0.1
                },
                {
                  icon: <Code2 className="w-6 h-6 text-blue-400" />,
                  title: 'Enterprise Ready',
                  desc: 'Export flawlessly to DOCX. Complex schemas, intricate styles, and perfect document fidelity preserved.',
                  delay: 0.2
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: feature.delay, duration: 0.5 }}
                  className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-brand-500/30 transition-colors overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Mock Editor Interface Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-20 relative rounded-2xl border border-zinc-800 bg-[#1e1e2e] shadow-2xl shadow-brand-900/20 overflow-hidden"
            >
              <div className="h-12 bg-[#181825] border-b border-zinc-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded bg-[#11111b] text-xs text-zinc-500 font-mono">
                  <FileText className="w-3 h-3" />
                  demo-document.docx
                </div>
              </div>
              <div className="p-8 aspect-[21/9] flex items-center justify-center bg-gradient-to-br from-[#1e1e2e] to-[#11111b] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/5 blur-[100px] rounded-full" />
                
                <div className="relative z-10 max-w-lg w-full bg-[#181825] border border-brand-500/20 rounded-xl p-6 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-brand-400" />
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-400 font-medium text-sm">Reviewer Agent</span>
                        <span className="text-xs text-zinc-500">Just now</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-zinc-800 rounded w-3/4 animate-pulse" />
                        <div className="h-2 bg-zinc-800 rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#1e1e2e] flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="text-sm text-zinc-300">Applying suggested formatting...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-12 text-center text-zinc-500 text-sm">
          <p>© 2026 SuperDoc AI. Designed with perfection.</p>
        </footer>
      </div>
    </div>
  );
}
