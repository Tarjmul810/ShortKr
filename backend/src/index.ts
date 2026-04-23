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

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  job.start()
  
  console.log(`Server listening at ${address}`)
})