import cron from "node-cron";
import { redis } from "./config";
import { updateClick } from "./services";

export const job =  cron.schedule("*/15 * * * * *", async () => {
    const keys = await redis.keys("clicks:*")
    const values = await Promise.all(keys.map((key) => redis.get(key))) as unknown as string[]

    await updateClick(keys, values)

    if(keys.length > 0) await redis.del(...keys)
    
});