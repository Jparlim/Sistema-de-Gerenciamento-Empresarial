import client from "../redis/redis-client.js";

export async function setInMemory(
  key: string,
  value: { role: "user" | "system"; content: string },
) {
  //   client.flushAll();
  await client.RPUSH(key, JSON.stringify(value));
  return await client.LRANGE(key, 15, -1);
}
