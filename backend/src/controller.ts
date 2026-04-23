import { findUrl, getUrls, saveUrl } from "./services";
import { redis } from "./config";

export const postUrl = async (url: string) => {
  try {
    const isValid = URL.canParse(url);
    if (!isValid) return "Invalid URL";

    const response = await saveUrl(url);

    return response
  } catch (error) {
    console.log(error)
    throw error
  }
};

export const getUrl = async (shortCode: string) => {
  try {
    const value = await redis.get(shortCode);
    if (value) {
      let count = await redis.incr(`clicks:${shortCode}`);
      return value
    }

    const response = await findUrl(shortCode);

    await redis.set(shortCode, response.url, {ex: 60*60*24} );
    await redis.incr(`clicks:${shortCode}`);
    return response.url
  } catch (error) {
    if (error instanceof Error) throw error.message
    throw error
  }
};

export const urls = async () => {
  try {
    return await getUrls()
  } catch (error) {
    throw error
  }
}
