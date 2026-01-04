import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple helper to seed a handful of courses with videos and quizzes.
async function main() {
  // Clean out dependent tables first so we can re-run the seed without FK issues.
  await prisma.note.deleteMany();
  await prisma.score.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.video.deleteMany();
  await prisma.course.deleteMany();

  const courseData = [
    {
      title: "Full-Stack JavaScript Jumpstart",
      description:
        "Learn the modern JS toolchain from the browser to Node.js APIs.",
      videos: {
        create: [
          {
            title: "What is JavaScript today?",
            url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
          },
          {
            title: "ES6+ essentials",
            url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
          },
          {
            title: "Async patterns in practice",
            url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
          },
        ],
      },
      quizzes: {
        create: [
          {
            question: "Which keyword declares a block-scoped variable?",
            optionA: "var",
            optionB: "let",
            optionC: "const",
            optionD: "int",
            answer: "B",
          },
          {
            question: "What does fetch() return?",
            optionA: "A Promise",
            optionB: "A Response",
            optionC: "JSON",
            optionD: "A callback",
            answer: "A",
          },
        ],
      },
    },
    {
      title: "React with Hooks Crash Course",
      description:
        "Build interactive UIs with hooks, context, and component patterns.",
      videos: {
        create: [
          {
            title: "Components and JSX",
            url: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
          },
          {
            title: "State, props, and lifting state",
            url: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
          },
          {
            title: "Side effects with useEffect",
            url: "https://samplelib.com/lib/preview/mp4/sample-40s.mp4",
          },
        ],
      },
      quizzes: {
        create: [
          {
            question: "Which hook is used for side effects?",
            optionA: "useState",
            optionB: "useEffect",
            optionC: "useMemo",
            optionD: "useRef",
            answer: "B",
          },
          {
            question: "Props are best described as…",
            optionA: "Mutable component state",
            optionB: "Parent-to-child data",
            optionC: "Global store",
            optionD: "Event handlers only",
            answer: "B",
          },
        ],
      },
    },
    {
      title: "SQL for Beginners",
      description:
        "Query relational data with confidence using SELECT, JOIN, and GROUP BY.",
      videos: {
        create: [
          {
            title: "Database basics",
            url: "https://samplelib.com/lib/preview/mp4/sample-50s.mp4",
          },
          {
            title: "Filtering and sorting",
            url: "https://samplelib.com/lib/preview/mp4/sample-1mb.mp4",
          },
          {
            title: "Joins without fear",
            url: "https://samplelib.com/lib/preview/mp4/sample-2mb.mp4",
          },
        ],
      },
      quizzes: {
        create: [
          {
            question: "Which clause filters rows before grouping?",
            optionA: "WHERE",
            optionB: "HAVING",
            optionC: "GROUP BY",
            optionD: "ORDER BY",
            answer: "A",
          },
          {
            question: "An INNER JOIN returns…",
            optionA: "All rows from both tables",
            optionB: "Only matching rows",
            optionC: "Only non-matching rows",
            optionD: "Distinct rows",
            answer: "B",
          },
        ],
      },
    },
    {
      title: "Node.js API Essentials",
      description:
        "Build RESTful APIs with Express, middleware, and proper error handling.",
      videos: {
        create: [
          {
            title: "Setting up Express",
            url: "https://samplelib.com/lib/preview/mp4/sample-3mb.mp4",
          },
          {
            title: "Routing patterns",
            url: "https://samplelib.com/lib/preview/mp4/sample-5mb.mp4",
          },
          {
            title: "Error handling middleware",
            url: "https://samplelib.com/lib/preview/mp4/sample-7mb.mp4",
          },
        ],
      },
      quizzes: {
        create: [
          {
            question: "Which object holds Express middleware?",
            optionA: "req",
            optionB: "res",
            optionC: "next",
            optionD: "app",
            answer: "D",
          },
          {
            question: "What does res.json() do?",
            optionA: "Sends HTML",
            optionB: "Parses JSON",
            optionC: "Sends a JSON response",
            optionD: "Reads a file",
            answer: "C",
          },
        ],
      },
    },
  ];

  for (const course of courseData) {
    await prisma.course.create({ data: course });
  }

  console.log(`Seeded ${courseData.length} courses with videos and quizzes.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
