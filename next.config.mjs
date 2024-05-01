import { withContentlayer } from "next-contentlayer2";

const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Referrer-Policy",
		value: "same-origin",
	},
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	poweredByHeader: false,

	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},

	env: {
		BUILD_TIME: new Date().toISOString(),
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default withContentlayer(nextConfig);
