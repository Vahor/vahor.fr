import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	env: {
		BUILD_TIME: new Date().toISOString(),
	},
};

export default withContentlayer(nextConfig);
