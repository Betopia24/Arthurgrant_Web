import { BookOpenCheck, Flame, Gift, Medal, Mic, PenLine, Sparkles, Timer, Volume2 } from "lucide-react";

export const features = [
  {
    icon: "/icon-01.png",
    title: "Interactive Reading",
    paragraph: "Phoneme recognition and word games with visual cues designed for dyslexic learners"
  },
  {
    icon: "/icon-02.png",
    title: "Smart Writing",
    paragraph: "Write. Learn. Improve. AI checks your grammar, structure, and style instantly."
  },
  {
    icon: "/icon-03.png",
    title: "Native Speaking",
    paragraph: "Advanced AI pronunciation coaching with real-time feedback and accent training"
  },
  {
    icon: "/icon-04.png",
    title: "Reward System",
    paragraph: "Phoneme recognition and word games with visual cues designed for dyslexic learners"
  }
];


export const activities = [
    { name: "Daily Reading Practice", done: true },
    { name: "Daily Speaking Practice", done: true },
    { name: "Daily Writing Practice", done: false },
    { name: "Daily Vocabulary Practice", done: false },
];


export const faq = [
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  },
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  },
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  },
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  },
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  },
  {
    question: "How does MANIFEX help with dyslexia?",
    answer: "MANIFEX uses research-backed methods specifically designed for dyslexic learners, including multi-sensory approaches, visual cues, phonics-based learning, and personalized pacing. Our AI adapts to each learner's unique needs and learning style."
  }
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
      imageUrl: "about-01.png"
    },
    {
      title: "Rhythmic Therapy",
      description:
        "Humans are naturally responsive to rhythm. By using rhythmic and repetitive patterns, the brain and nervous system can be regulated. Rhythmic therapy utilizes music to influence neural pathways, facilitating new learning behaviors through cognitive processing. This approach can reduce stress, improve focus, and enhance reading, writing, and speaking skills.",
      imageUrl: "about-02.png"
    },
    {
      title: "Dysgraphia Support",
      description:
        "Dysgraphia is a neurological condition that affects writing. Our tools offer structured practice to strengthen handwriting, written expression, and the motor skills that support the writing process.",
      imageUrl: "about-03.png"
    },
    {
      title: "Dyslexia Support",
      description:
        "Dyslexia, a neurobiological learning difference, can make reading, writing, and spelling difficult. We provide engaging activities that build fluency, comprehension, and language skills—helping learners overcome barriers with confidence.",
      imageUrl: "about-04.png"
    },
  ]
};

export const achievements = [
  {
    title: "Daily Streak Hero",
    description: "Practiced 7 days in a row without missing.",
    status: "Unlocked",
    icon: Flame
  },
  {
    title: "Sentence Starter",
    description: "Wrote your first 3-line story successfully.",
    status: "Unlocked",
    icon: PenLine
  },
  {
    title: "Speaking Star",
    description: "Learned 100 new words with perfect recall.",
    status: "Unlocked",
    icon: Mic
  },
  {
    title: "Word Wizard",
    description: "Learned 100 new words with perfect recall.",
    status: "Unlocked",
    icon: Sparkles
  },
  {
    title: "Quick Learner",
    description: "Finished all daily tasks in under 10 minutes.",
    status: "Locked",
    icon: Timer
  },
  {
    title: "Phonics Pro",
    description: "Complete 50 phoneme flashcards.",
    status: "Locked",
    icon: Volume2
  },
  {
    title: "Comprehension Champ",
    description: "Unlocked 20 comprehension exercises.",
    status: "Locked",
    icon: BookOpenCheck
  },
  {
    title: "Reward Hunter",
    description: "Unlocked 20 reward videos.",
    status: "Locked",
    icon: Gift
  },
  {
    title: "Milestone Master",
    description: "Unlocked 5 achievements in one month.",
    status: "Locked",
    icon: Medal
  }
];
