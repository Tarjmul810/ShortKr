import fastify from 'fastify'
import routes from './routes'
import { job } from './job'
import cors from '@fastify/cors'

const server = fastify()

server.register(cors), {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}
server.register(routes, { prefix: '/api/v1/' })

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3001,
      host: '0.0.0.0'
    });

    job.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();