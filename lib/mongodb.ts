import clientPromise from "./mongodbConnect";

export async function getMongoDb() {
  console.log(process.env.MONGO_DB_NAME);
  const client = await clientPromise;
  return client.db(process.env.MONGO_DB_NAME);
}
