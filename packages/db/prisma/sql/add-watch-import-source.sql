-- Stable source identifiers let repeated imports update existing entries.
ALTER TABLE "public"."watch_entries"
  ADD COLUMN "source" TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN "externalId" TEXT;

CREATE UNIQUE INDEX "watch_entries_externalId_key"
  ON "public"."watch_entries"("externalId");
CREATE INDEX "watch_entries_source_idx"
  ON "public"."watch_entries"("source");
