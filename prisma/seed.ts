import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.optionTemplate.createMany({
    data: [
      {
        name: "coffee_template",
        label: "Coffee Options",
        options: {
          sugar: ["no sugar", "less", "normal", "extra"],
          ice: ["hot", "ice"],
          size: ["small", "medium", "large"],
        },
      },
      {
        name: "drink_template",
        label: "Drink Options",
        options: {
          sugar: ["less", "normal", "extra"],
          ice: ["less", "normal"],
        },
      },
      {
        name: "food_spicy_template",
        label: "Spicy Level",
        options: {
          spicy: ["none", "mild", "hot", "extra hot"],
        },
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });