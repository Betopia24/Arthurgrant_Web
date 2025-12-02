import {
  BookOpenCheck,
  Flame,
  Gift,
  Medal,
  Mic,
  PenLine,
  Sparkles,
  Timer,
  Volume2,
} from "lucide-react";

export const features = [
  {
    icon: "/icon-01.png",
    title: "Interactive Reading",
    paragraph:
      "Phoneme recognition and word games with visual cues designed for dyslexic learners",
    href: "/practice/reading",
  },
  {
    icon: "/icon-02.png",
    title: "Smart Writing",
    paragraph:
      "Write. Learn. Improve. AI checks your grammar, structure, and style instantly.",
    href: "/practice/writing",
  },
  {
    icon: "/icon-03.png",
    title: "Native Speaking",
    paragraph:
      "Advanced AI pronunciation coaching with real-time feedback and accent training",
    href: "/practice/speaking",
  },
  {
    icon: "/icon-04.png",
    title: "Reward System",
    paragraph:
      "Phoneme recognition and word games with visual cues designed for dyslexic learners",
    href: "/practice/reading",
  },
];

export const activities = [
  { name: "Daily Reading Practice", done: true },
  { name: "Daily Speaking Practice", done: true },
  { name: "Daily Writing Practice", done: false },
  { name: "Daily Vocabulary Practice", done: false },
];

export const faq = [
  {
    question: "What is MANIFEX and who is it for?",
    answer:
      "MANIFEX is an AI-powered English learning platform with a dyslexia-friendly design that helps learners practice reading, writing, speaking, and vocabulary in one place. It is ideal for school-age children, university students, and busy professionals who want to improve their English in as little as 10 minutes a day.",
  },
  {
    question: "How does MANIFEX support dyslexic learners?",
    answer:
      "The platform uses phoneme-based reading games, clear typography, strong color contrast, and step-by-step guidance so dyslexic learners can focus and build skills confidently. AI adaptively adjusts difficulty and pacing based on performance, making practice less overwhelming and more encouraging.",
  },
  {
    question: "What makes MANIFEX different from other English platforms?",
    answer:
      "MANIFEX combines AI tutoring, real-time analytics, and a reward system that unlocks videos tailored to each learner’s interests such as sports, dance, or cooking. Parents and learners can see detailed progress across reading, writing, pronunciation, and vocabulary with 30, 60, and 90 day views.",
  },
  {
    question: "How much time do learners need each day?",
    answer:
      "Most learners use MANIFEX for about 10–20 minutes a day, enough to complete a few targeted tasks in reading, writing, and speaking. Short, consistent sessions are designed to fit into busy schedules while still driving measurable improvement over weeks and months.",
  },
  {
    question: "Can parents or teachers track progress?",
    answer:
      "Yes, MANIFEX includes a visual dashboard that shows streaks, words learned, lesson completion, and accuracy over time. Families and educators can quickly see strengths, areas for improvement, and whether learners are on track with their goals.",
  },
  {
    question: "What plans do you offer and can I try it for free?",
    answer:
      "MANIFEX offers a Free Trial, a Premium plan for individual learners, and a Family plan with up to five learner profiles. New users can start with the free trial and then upgrade to Premium or Family with a 30-day money-back guarantee and the option to cancel anytime.",
  },
];

export const plans = [
  {
    title: "Free Trial",
    price: "$0",
    duration: "7 Days",
    features: [
      "5 Lessons per day",
      "Basic progress tracking",
      "Limited reward content",
      "Mercury AI guidance",
    ],
    buttonText: "Start Free Trial",
    highlight: false,
  },
  {
    title: "Premium",
    price: "$19",
    duration: "per month",
    features: [
      "Unlimited lessons",
      "Advanced progress analytics",
      "Get Unlimited reward upon activity completion",
      "Priority AI support",
    ],
    buttonText: "Start With Premium Plan",
    highlight: true,
  },
  {
    title: "Family",
    price: "$39",
    duration: "per month",
    features: [
      "Up to 5 learner profiles",
      "All Premium features",
      "Family progress reports",
      "Priority support",
      "Educational resources",
    ],
    buttonText: "Start With Family Plan",
    highlight: false,
  },
];

export const aboutUsInfo = {
  sections: [
    {
      title: "Neuroplasticity",
      description:
        "The brain has an incredible ability to reorganize itself by forming new neural connections throughout life. This process supports learning, problem-solving, and adaptation to new challenges. Activities designed to activate neuroplasticity can make practice more impactful over time.",
      imageUrl: "about-01.png",
    },
    {
      title: "Rhythmic Therapy",
      description:
        "Humans are naturally responsive to rhythm. By using rhythmic and repetitive patterns, the brain and nervous system can be regulated. Rhythmic therapy utilizes music to influence neural pathways, facilitating new learning behaviors through cognitive processing. This approach can reduce stress, improve focus, and enhance reading, writing, and speaking skills.",
      imageUrl: "about-02.png",
    },
    {
      title: "Dysgraphia Support",
      description:
        "Dysgraphia is a neurological condition that affects writing. Our tools offer structured practice to strengthen handwriting, written expression, and the motor skills that support the writing process.",
      imageUrl: "about-03.png",
    },
    {
      title: "Dyslexia Support",
      description:
        "Dyslexia, a neurobiological learning difference, can make reading, writing, and spelling difficult. We provide engaging activities that build fluency, comprehension, and language skills—helping learners overcome barriers with confidence.",
      imageUrl: "about-04.png",
    },
  ],
};

export const achievements = [
  {
    title: "Daily Streak Hero",
    description: "Practiced 7 days in a row without missing.",
    status: "Unlocked",
    icon: Flame,
  },
  {
    title: "Sentence Starter",
    description: "Wrote your first 3-line story successfully.",
    status: "Unlocked",
    icon: PenLine,
  },
  {
    title: "Speaking Star",
    description: "Learned 100 new words with perfect recall.",
    status: "Unlocked",
    icon: Mic,
  },
  {
    title: "Word Wizard",
    description: "Learned 100 new words with perfect recall.",
    status: "Unlocked",
    icon: Sparkles,
  },
  {
    title: "Quick Learner",
    description: "Finished all daily tasks in under 10 minutes.",
    status: "Locked",
    icon: Timer,
  },
  {
    title: "Phonics Pro",
    description: "Complete 50 phoneme flashcards.",
    status: "Locked",
    icon: Volume2,
  },
  {
    title: "Comprehension Champ",
    description: "Unlocked 20 comprehension exercises.",
    status: "Locked",
    icon: BookOpenCheck,
  },
  {
    title: "Reward Hunter",
    description: "Unlocked 20 reward videos.",
    status: "Locked",
    icon: Gift,
  },
  {
    title: "Milestone Master",
    description: "Unlocked 5 achievements in one month.",
    status: "Locked",
    icon: Medal,
  },
];
