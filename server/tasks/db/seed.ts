import { db } from "@nuxthub/db";
import { games, users } from "hub:db:schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { DATA, DEMO_USER } from "#server/data";

/**
 * Seed task for database initialization.
 * Creates default demo user and video game products from Steam.
 */
export default defineTask({
  meta: {
    name: "db:seed",
    description: "Seed database with demo user and Steam game products",
  },
  async run() {
    console.log("🌱 Starting database seed...");

    try {
      // Check if demo user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, DEMO_USER.email),
      });

      if (!existingUser) {
        // Hash password
        const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);

        // Create demo user
        await db.insert(users).values({
          email: DEMO_USER.email,
          passwordHash,
          name: DEMO_USER.name,
          balance: DEMO_USER.balance,
        });

        console.log(`Created demo user: ${DEMO_USER.email} (password: ${DEMO_USER.password})`);
      } else {
        console.log(`Demo user already exists: ${DEMO_USER.email}`);
      }

      // Check if games already exist
      const existingGames = await db.query.games.findMany();
      if (existingGames.length === 0) {
        // Insert sample games
        await db.insert(games).values(DATA);
        console.log(`Created ${DATA.length} sample games`);
      } else {
        console.log(`Games already exist (${existingGames.length} items)`);
      }

      console.log("Seed completed successfully!");
      return { result: "Seed completed successfully" };
    } catch (error) {
      console.error("Seed failed:", error);
      return { result: "Seed failed", error: String(error) };
    }
  },
});
