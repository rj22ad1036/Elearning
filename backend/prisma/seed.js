import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.course.create({
    data: {
      title: "JavaScript Basics",
      description: "Learn JS fundamentals",
      videos: {
        create: [
          {
            title: "Intro to JS",
            url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          },
          {
            title: "Variables",
            url: "https://www.youtube.com/watch?v=Bv_5Zv5c-Ts",
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: "React Basics",
      description: "Learn React fundamentals",
      videos: {
        create: [
          {
            title: "Intro to React",
            url: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          },
          { title: "JSX", url: "https://www.youtube.com/watch?v=DiIoWrOlIRw" },
        ],
      },
    },
  });
}

main().finally(() => prisma.$disconnect());
