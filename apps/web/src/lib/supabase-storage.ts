import { createClient } from "@supabase/supabase-js";

export const PROJECT_IMAGE_BUCKET =
	process.env.SUPABASE_STORAGE_BUCKET?.trim() || "project-images";

/**
 * Klien storage khusus server. Memakai service role key, jadi jangan pernah
 * diimpor dari komponen client. Mengembalikan null kalau env belum diisi,
 * supaya pemanggilnya bisa memberi pesan yang jelas ke admin.
 */
export function getStorageClient() {
	const url = process.env.SUPABASE_URL?.trim();
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

	if (!url || !serviceRoleKey) {
		return null;
	}

	return createClient(url, serviceRoleKey, {
		auth: { persistSession: false },
	});
}
