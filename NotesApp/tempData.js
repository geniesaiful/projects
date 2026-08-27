const tempNotes = [
  {
    id: "note_01",
    isPinned: true,
    emoji: "💡",
    title: "Daily Thoughts",
    category: "Personal",
    tags: ["Life","lifestyle"],
    content: "Today was a productive day. I started the morning with a good workout and reading for 30 minutes.\n\nWorked on the quiz application and implemented the timer functionality.\n\nIn the evening, I learned about local storage and how to persist data in JavaScript.\n\nGrateful for small progress every day! 🙂",
    createdAt: "2026-05-16T09:15:00.000Z",
    updatedAt: "2026-07-16T10:25:00.000Z",
    isDeleted: true
  },
  {
    id: "note_02",
    isPinned: false,
    emoji: "🛒",
    title: "Grocery List",
    category: "Shopping",
    tags: ["Home","Food"],
    content: "- Almond milk\n- Whole grain bread\n- Fresh blueberries\n- Greek yogurt",
    createdAt: "2026-05-15T14:30:00.000Z",
    updatedAt: "2026-07-15T14:30:00.000Z",
    isDeleted: true
  },
  {
    id: "note_03",
    isPinned: true,
    emoji: "🚀",
    title: "Project Ideas",
    category: "Work",
    tags: ["Dev","HTML","JavaScript"],
    content: "Build a minimal markdown reader with local storage support and dynamic tag filtering.",
    createdAt: "2026-05-10T11:00:00.000Z",
    updatedAt: "2026-05-12T16:45:00.000Z",
    isDeleted: true
  }
];

const tempCategories = {
  ideas: { name: "Ideas", emoji: "💡", color: "#FEF08A" },     // Light Yellow
  personal: { name: "Personal", emoji: "👤", color: "#FED7AA" }, // Light Orange
  work: { name: "Work", emoji: "💼", color: "#E0E7FF" },     // Light Indigo
  shopping: { name: "Shopping", emoji: "🛒", color: "#DCFCE7" }, // Light Green
  goals: { name: "Goals", emoji: "🎯", color: "#FCE7F3" }      // Light Pink
};

let notesDataJs,categoriesDatajs;