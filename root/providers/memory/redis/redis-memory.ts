import client from "../redis/redis-client.js";

export async function setInMemory(
  key: string,
  value: { role: "user" | "model"; content: string },
) {
  // return client.flushAll();
  await client.RPUSH(key, JSON.stringify(value));
  await client.EXPIRE(key, 5 * 60);
  return await client.LRANGE(key, -35, -1);
}
