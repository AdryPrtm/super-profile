import { PrismaClient } from "../prisma/generated/client";
export { Prisma } from "../prisma/generated/client";

// Next.js dev dengan Turbopack mengevaluasi ulang modul ini setiap kali kode
// berubah. Tanpa penjagaan di globalThis, setiap evaluasi membuat PrismaClient
// baru beserta connection pool-nya sendiri, sampai kuota koneksi Supabase
// pooler habis (session mode dibatasi 15 klien).
const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
