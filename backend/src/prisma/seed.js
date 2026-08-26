import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== SEED SUPER ADMIN ====================
async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set."
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const superAdmin = await prisma.user.update({
      where: { email },
      data: {
        role: "SUPER_ADMIN",
        isEmailVerified: true,
      },
    });

    console.log("Existing user promoted to Super Admin:", superAdmin.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email,
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