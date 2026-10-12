import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	outputFileTracingRoot: path.resolve(__dirname, "../.."),
	outputFileTracingIncludes: {
		"/*": ["../../packages/db/prisma/generated/libquery_engine-rhel-openssl-3.0.x.so.node"],
	},
	experimental: {
		serverActions: { bodySizeLimit: "16mb" },
	},
};

export default nextConfig;
