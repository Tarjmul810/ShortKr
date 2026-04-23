import fastify from 'fastify'
import routes from './routes'
import { job } from './job'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors), {
  origin: 'https://short-kr-8pb6.vercel.app/',
  methods: ['GET', 'POST']
}
app.register(routes, { prefix: '/api/v1/' })

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: '0.0.0.0'
    });

    console.log(`Server listening on `, app.server.address());

    job.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();