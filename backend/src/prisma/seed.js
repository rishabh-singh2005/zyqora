import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== SEED SUPER ADMIN ====================
async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "rishabhrajput1723@gmail.com" },
  });

  if (existing) {
    console.log("Super Admin already exists, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Rishabh@2005", 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: "rishabhrajput1723@gmail.com",
      password: hashedPassword,
      name: "System Owner",
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("Super Admin created:", superAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });