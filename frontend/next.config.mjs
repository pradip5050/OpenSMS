/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isUsingTauri = true;

let internalHost = null;

if (!isProd) {
  const { internalIpV4 } = await import("internal-ip");
  internalHost = await internalIpV4();
}

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: isUsingTauri
    ? isProd
      ? null
      : `http://${internalHost}:3000`
    : undefined,
};

export default nextConfig;
