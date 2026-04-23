import { prisma } from "./db";

export const saveUrl = async (url: string) => {
  let shortCode;
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let existingUrl;

  do {
    shortCode = Math.random().toString(36).substring(2, 8);
    existingUrl = await prisma.url.findUnique({ where: { short: shortCode } });
  } while (existingUrl);

  const response = await prisma.url.create({
    data: {
      short: shortCode,
      url,
      expiredAt,
      counts: 0,
    },
  });
  return response;
};

export const findUrl = async (shortCode: string) => {
  const response = await prisma.url.findUnique({ where: { short: shortCode } });
  console.log(response);
  if (!response) throw new Error("URL not found");

  const expired = response.expiredAt.getTime() - Date.now();

  if (expired == 0 || expired < 0) throw new Error("URL expired");

  return response;
};

export const updateClick = async (keys: string[], values: string[]) => {
  
  await prisma.$transaction(
    keys.map((key, index) => {
      const code = key.split(":")[1];
      const count = parseInt(values[index]);
      return prisma.url.update({
        where: { short: code },
        data: { counts: { increment: count } },
      });
    })
  );
};

export const getUrls = async () => {
  return await prisma.url.findMany();
};
