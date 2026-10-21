import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";

config({ path: fileURLToPath(new URL("../../../apps/web/.env", import.meta.url)), quiet: true });

if (!process.env.DATABASE_URL?.trim()) {
  console.error("Set DATABASE_URL in apps/web/.env before creating a user.");
  process.exit(1);
}

// Static imports run before config(), so load database-dependent modules only
// after the environment has been initialized.
const [{ default: prisma }, { createUser, updateUser }] = await Promise.all([
  import("@super-profile-dry/db"),
  import("../src/create-user"),
]);
const updating = process.argv.includes("--update");

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error("Run bun run user:create or bun run user:update in an interactive terminal. Password input is hidden.");
  process.exit(1);
}

let hidden = false;
const output = new Writable({
  write(chunk, _encoding, callback) {
    if (!hidden) process.stdout.write(chunk);
    callback();
  },
});
const prompt = createInterface({ input: process.stdin, output, terminal: true });
prompt.on("SIGINT", () => { prompt.close(); process.exit(130); });

try {
  const currentIdentifier = updating ? await prompt.question("Current email or username: ") : "";
  const name = await prompt.question("Name: ");
  const email = await prompt.question(updating ? "New email or username: " : "Email or username: ");
  hidden = true;
  process.stdout.write("Password (12–128 characters, hidden): ");
  const password = await prompt.question("");
  process.stdout.write("\nConfirm password (hidden): ");
  const confirmation = await prompt.question("");
  process.stdout.write("\n");
  hidden = false;
  if (password !== confirmation) throw new Error("Passwords do not match.");
  if (updating) await updateUser(currentIdentifier, { name, email, password });
  else await createUser({ name, email, password });
  console.log(updating ? "Account updated. Existing sessions have been revoked. Sign in at /login." : "Account created. Sign in at /login.");
} catch (error) {
  const code = error && typeof error === "object" && "code" in error ? error.code : null;
  if (code === "P2002") console.error("An account with that email already exists.");
  else if (code === "P2025") console.error("Account not found. Check the current email or username.");
  else if (error instanceof Error && error.message === "Passwords do not match.") console.error(error.message);
  else console.error("Unable to save account. Check the name, email or username, password length (12–128), and database connection.");
  process.exitCode = 1;
} finally {
  hidden = false;
  prompt.close();
  await prisma.$disconnect();
}
