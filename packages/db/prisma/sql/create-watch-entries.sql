-- Watch tracker storage. The site reads and writes through server-side Prisma.
-- No Data API role needs direct table access.
CREATE TABLE "public"."watch_entries" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "year" INTEGER,
  "posterUrl" TEXT,
  "rating" INTEGER,
  "notes" TEXT,
  "watchedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "watch_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "watch_entries_category_status_idx"
  ON "public"."watch_entries"("category", "status");
CREATE INDEX "watch_entries_watchedAt_idx"
  ON "public"."watch_entries"("watchedAt");

ALTER TABLE "public"."watch_entries" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."watch_entries" FROM "anon", "authenticated";
