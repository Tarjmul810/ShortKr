import { Redis } from "@upstash/redis";

console.log(process.env.UPSTASH_REDIS_REST_URL)
export const redis = Redis.fromEnv();