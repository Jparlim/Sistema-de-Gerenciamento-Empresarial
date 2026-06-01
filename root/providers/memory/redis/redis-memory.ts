import client from "../redis/redis-client.js";

export async function setInMemory(
  key: string,
  value: { role: "user" | "model"; content: string },
) {
  //   client.flushAll();
  await client.RPUSH(key, JSON.stringify(value));
  return await client.LRANGE(key, 35, -1);
}
