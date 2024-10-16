import clientPromise from './mongodbConnect';

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGO_DB_NAME); // Use an environment variable for the DB name
}
