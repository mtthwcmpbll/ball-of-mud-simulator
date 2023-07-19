import pkg from '@neo4j/graphql-ogm';
const { OGM } = pkg;

import neo4j from "neo4j-driver";

import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
const { URI, DB_USERNAME, DB_PASSWORD } = process.env;

// Neo4J /////////////////////////////////////////////////

// Define your models and relationships using graphql type syntax
const typeDefs = `
    type Service {
        id: ID
        name: String
    }
    type HttpEndpoint {
        id: ID
        name: String
        path: String
    }
    type Schema {
        id: ID
        file: String
        schema: String
    }
`;

// Establish Neo4J Connection using Neo4j drivers
// const driver = neo4j.driver(URI, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const driver = neo4j.driver(URI);

// Connect our typedefs and connection to the OGM
const ogm = new OGM({ typeDefs, driver });
await ogm.init();

// create a model that refers to one of defined types
export const Service = ogm.model("Service");
export const HttpEndpoint = ogm.model("HttpEndpoint");
export const Schema = ogm.model("Schema");

export const query = async (query, params) => {
    const session = driver.session();

    try {
        const result = await session.run(
            query,
            params
        );
        return result;
    } finally {
        await session.close()
    }
}

// on application exit:
await driver.close()