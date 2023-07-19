// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
const { SERVICE_NAME } = process.env;

import { query, Service } from './neo4j.js';

// Load the Neo4J configuration for this Service
const result = await query("MATCH (s:Service {name: $name})-[:PRODUCES]->(e:HttpEndpoint)-->(d:Schema) RETURN s, e, d", { name: SERVICE_NAME });
console.log("Building " + result.records.length + " endpoints for service " + SERVICE_NAME + "...");
result.records.forEach(record => {
  const [s, e, d] = record._fields;

  // console.log(s);
  // console.log(e);
  // console.log(d);

  console.log("Registering endpoint " + e.properties.path + " for service " + s.properties.name + "...");
  fastify.get(e.properties.path, function (request, reply) {
    reply.send({ hello: e.properties.name })
  });
});

try {
  console.log("Starting service " + SERVICE_NAME + "...");;
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}