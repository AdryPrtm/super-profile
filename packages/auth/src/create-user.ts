import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import prisma from "@super-profile-dry/db";
import { normalizeLoginIdentifier } from "./login-identifier";

const userInput = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().transform(normalizeLoginIdentifier).pipe(z.string().email().max(254)),
  password: z.string().min(12).max(128),
});

// Server/CLI only. Never expose provisioning through a public route.
export async function createUser(input: z.input<typeof userInput>) {
  const data = userInput.parse(input);
  const password = await hashPassword(data.password);
  const now = new Date();
  const id = randomUUID();
  return prisma.user.create({
    data: {
      id,
      name: data.name,
      email: data.email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: id,
          providerId: "credential",
          password,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
    select: { id: true, email: true, name: true },
  });
}

export async function updateUser(currentIdentifier: string, input: z.input<typeof userInput>) {
  const data = userInput.parse(input);
  const password = await hashPassword(data.password);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { email: normalizeLoginIdentifier(currentIdentifier) },
    });
    const now = new Date();
    await tx.user.update({
      where: { id: user.id },
      data: { name: data.name, email: data.email, emailVerified: data.email === user.email ? user.emailVerified : false, updatedAt: now },
    });
    const account = await tx.account.findFirst({ where: { userId: user.id, providerId: "credential" } });
    if (account) {
      await tx.account.update({ where: { id: account.id }, data: { password, updatedAt: now } });
    } else {
      await tx.account.create({ data: { id: randomUUID(), userId: user.id, accountId: user.id, providerId: "credential", password, createdAt: now, updatedAt: now } });
    }
    await tx.session.deleteMany({ where: { userId: user.id } });
    return { id: user.id, email: data.email, name: data.name };
  });
}
