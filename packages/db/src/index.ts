import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";
export { Prisma } from "../prisma/generated/client";

// Next.js dev dengan Turbopack mengevaluasi ulang modul ini setiap kali kode
// berubah. Tanpa penjagaan di globalThis, setiap evaluasi membuat PrismaClient
// baru beserta connection pool-nya sendiri, sampai kuota koneksi Supabase
// pooler habis (session mode dibatasi 15 klien).
const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is required");
	}

	return new PrismaClient({
		adapter: new PrismaPg({ connectionString, max: 1 }),
	});
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
