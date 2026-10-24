export const PRIORITIES = [
  { value: "low", label: "🟢 Low" },
  { value: "medium", label: "🟡 Medium" },
  { value: "high", label: "🔴 High" },
];

export const CATEGORIES = [
  { value: "math", label: "📐 Math" },
  { value: "science", label: "🔬 Science" },
  { value: "language", label: "🗣️ Language" },
  { value: "history", label: "📜 History" },
  { value: "programming", label: "💻 Programming" },
  { value: "literature", label: "📚 Literature" },
  { value: "assignment", label: "📝 Assignment" },
  { value: "exam", label: "📖 Exam" },
  { value: "project", label: "🎯 Project" },
  { value: "other", label: "🔷 Other" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map(({ value, label }) => [value, label]),
);
