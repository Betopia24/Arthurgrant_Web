// components/landing/About.tsx
"use client";
import React from "react";
import Heading from "../shared/Heading";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  FileText,
  FileEdit,
  Mic,
  Presentation,
  Users,
  Video,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const About = () => {
  // Stats data
  const stats = [
    { value: "100K+", label: "Learners worldwide" },
    { value: "24/7", label: "AI Powered Support" },
  ];

  // Age Groups offerings
  const ageGroups = [
    {
      title: "Ages 6–9",
      color: "from-amber-400 to-orange-500",
      bgBorder: "hover:border-orange-500/50",
      activities: [
        "Interactive Reading",
        "Handwriting Practice",
        "Free Writing Practice",
        "Speaking",
      ],
    },
    {
      title: "Ages 10–17",
      color: "from-pink-500 to-rose-500",
      bgBorder: "hover:border-rose-500/50",
      activities: ["Interactive Reading", "Smart Writing", "Speaking"],
    },
    {
      title: "Ages 18–40",
      color: "from-blue-500 to-indigo-500",
      bgBorder: "hover:border-indigo-500/50",
      activities: [
        "Smart Writing",
        "Presentation Practice",
        "English for Adult Practice",
      ],
    },
  ];

  // Activities detail data
  const activities = [
    {
      icon: BookOpen,
      title: "Interactive Reading",
      color: "text-amber-400 bg-amber-500/10",
      description: "Phoneme recognition and word games with visual cues.",
      note: "Also supports readers with dyslexia.",
    },
    {
      icon: PenTool,
      title: "Handwriting Practice",
      color: "text-emerald-400 bg-emerald-500/10",
      description: "Practice tracing letters (both print and cursive) with fun while listening and grooving.",
      note: "Also supports writers with dysgraphia. (Digital pen suggested for best practice)",
    },
    {
      icon: FileText,
      title: "Free Writing Practice",
      color: "text-teal-400 bg-teal-500/10",
      description: "Practice tracing words (both print and cursive) with fun while listening and grooving.",
      note: "Also supports writers with dysgraphia. (Digital pen suggested for best practice)",
    },
    {
      icon: FileEdit,
      title: "Smart Writing",
      color: "text-purple-400 bg-purple-500/10",
      description: "Write. Learn. Improve. AI checks your grammar, structure, and style instantly.",
    },
    {
      icon: Mic,
      title: "Speaking",
      color: "text-rose-400 bg-rose-500/10",
      description: "Advanced AI pronunciation coaching with real-time feedback and accent training.",
    },
    {
      icon: Presentation,
      title: "Presentation Practice",
      color: "text-sky-400 bg-sky-500/10",
      description: "Designed for those who speak or present to large audiences. Using AI-powered activities as practice for those who have already mastered English and just need a quick warm-up!",
    },
    {
      icon: Users,
      title: "English for Adult Practice",
      color: "text-indigo-400 bg-indigo-500/10",
      description: "If English is not your native language, these AI-powered activities will help improve your fluency, articulation, and increase your vocabulary!",
    },
    {
      icon: Video,
      title: "Reward Video",
      color: "text-yellow-400 bg-yellow-500/10",
      description: "Once you have completed all daily activities, tap for your daily reward video! Return to see all rewarded videos in your bank. Choose and lock your favorite two videos; all others delete after 30 days.",
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-[#1A1646] via-[#05051E] to-[#05051E] text-white">
      <div className="app-container space-y-20">
        
        {/* Left Side Mission & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              About MANIFEX
            </div>

            <Heading
              heading="We Created MANIFEX with One Mission"
              subheading="Make English learning simple, engaging, and accessible. For anyone who wants to master the energy of communicating English, this is a revolution powered by AI."
              specialText="One Mission"
              align="left"
            />
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Groups Track Display */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Our Guided Learning Tracks</h2>
            <p className="text-sm sm:text-base text-gray-400">Tailored practice programs designed to dynamically align with different stages of learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ageGroups.map((group, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-all duration-300 ${group.bgBorder} hover:translate-y-[-4px] flex flex-col justify-between`}
              >
                <div className="space-y-5">
                  {/* Badge */}
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${group.color} shadow-sm`}>
                    {group.title}
                  </span>

                  <ul className="space-y-3.5">
                    {group.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-center gap-3 text-sm sm:text-base text-gray-200">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${group.color}`}></div>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Activities Catalog */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Core Learning Activities</h2>
            <p className="text-sm sm:text-base text-gray-400">Advanced tools engineered with cognitive principles to deliver results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between hover:bg-white/[0.05]"
                >
                  <div className="space-y-4">
                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-100">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {item.note && (
                    <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] sm:text-xs font-semibold text-purple-300">
                      {item.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Concept Redirect Link */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Want to learn more about the MANIFEX concept?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Go to the ABOUT section in your toolbar for more insight into our simple, engaging, and AI-powered English learning revolution.
            </p>
          </div>

          <Link
            href="/about"
            className="px-6 py-3 rounded-xl bg-gradient-brand text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition shadow-lg shrink-0"
          >
            <span>Go to About Concept</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
