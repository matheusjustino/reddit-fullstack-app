/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa")({
	dest: "public",
	disable: !isProd,
});

const nextConfig = {
	images: {
		domains: [
			"uploadthing.com",
			"lh3.googleusercontent.com",
			"play.google.com",
		],
	},
	experimental: {
		appDir: true,
	},
};

module.exports = withPWA(nextConfig);
