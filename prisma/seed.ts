import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Science", slug: "science", icon: "🔬" },
  { name: "Math", slug: "math", icon: "🧮" },
  { name: "Geography", slug: "geography", icon: "🌍" },
  { name: "History", slug: "history", icon: "📜" },
  { name: "Reading", slug: "reading", icon: "📚" },
  { name: "Art", slug: "art", icon: "🎨" },
  { name: "Music", slug: "music", icon: "🎵" },
  { name: "Nature", slug: "nature", icon: "🌳" },
  { name: "Coding", slug: "coding", icon: "💻" },
  { name: "Language", slug: "language", icon: "💬" },
];

async function main() {
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug_familyId: { slug: cat.slug, familyId: "" } },
      update: {},
      create: { ...cat, familyId: null },
    });
  }
  console.log("Seeded default categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
