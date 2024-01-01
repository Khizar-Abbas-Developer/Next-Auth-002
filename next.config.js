
  /** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "daisyui.com"
        },
        {
          protocol: "https",
          hostname: "i.pinimg.com"
        },
        {
          protocol: "https",
          hostname: "cdn.pixabay.com"
        }
      ],
    }  
  };
  
  module.exports = nextConfig;