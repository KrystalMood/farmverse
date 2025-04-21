import { Prisma } from "@/utils/prisma";

const parseDate = (input: string): Date => {
  const [day, month, year] = input.split("/").map(Number);
  return new Date(year, month - 1, day);
};

async function seed() {
  await Prisma.careers.deleteMany();
  await Prisma.careers.createMany({
    data: [
      {
        title: "Frontend Developer",
        department: "TECHNOLOGY",
        description: "",
        requirements: "",
        status: "OPEN",
        type: "FULL_TIME",
        min_salary: 4000000,
        max_salary: 5000000,
        location: "REMOTE",
        deadline: parseDate("19/04/2025"),
      },
    ],
  });
}

seed()
  .catch((e) => {
    console.error(process.env.NODE_ENV !== "production" && `Error while seeding database: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });