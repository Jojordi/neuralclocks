/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: "/new_user",
                destination: "http://localhost:3001/new_user",
            },
            {
                source: "/check_user",
                destination: "http://localhost:3001/check_user",
            },
            {
                source: "/get_timers",
                destination: "http://localhost:3001/get_timers",
            },
            {
                source: "/set_timer",
                destination: "http://localhost:3001/set_timer",
            },
        ];
    },
}

module.exports = nextConfig
