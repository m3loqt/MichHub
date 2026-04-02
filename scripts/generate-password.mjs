/**
 * Usage: node scripts/generate-password.mjs <your-password>
 * Prints the bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.local
 */
import { hash } from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-password.mjs <password>");
  process.exit(1);
}

const hashed = await hash(password, 12);
console.log("\nPaste this into your .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hashed}\n`);
