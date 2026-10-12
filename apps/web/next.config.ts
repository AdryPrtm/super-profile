import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	experimental: {
		serverActions: { bodySizeLimit: "16mb" },
	},
};

export default nextConfig;
