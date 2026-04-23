import { FastifyInstance } from "fastify";
import { prisma } from "./db";
import { getUrl, postUrl, urls } from "./controller";

const UrlSchema = {
  schema: {
    body: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string" },
      },
    },
  },
};

export default async function routes(fastify: FastifyInstance) {
  fastify.post("/url", UrlSchema, async (request, reply) => {
    try {
      const { url } = request.body as { url: string };

      const response = await postUrl(url);

      reply.status(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: error,
      });
    }
  });

  fastify.get("/:shortCode", async (request, reply) => {
    try {
      const { shortCode } = request.params as { shortCode: string };

      const response = await getUrl(shortCode);

      reply.status(302).redirect(response);
    } catch (error) {
      if (error === "URL not found")
        reply.status(404).send({ success: false, error: error });
      else if (error === "URL expired")
        reply.status(410).send({ success: false, error: error });
      else reply.status(500).send({ success: false, error: error });
    }
  });

  fastify.get("/urls", async (request, reply) => {
    try {
      const response = await urls();

      reply.status(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      reply.status(500).send({ success: false, error: error });
    }
  });
}
