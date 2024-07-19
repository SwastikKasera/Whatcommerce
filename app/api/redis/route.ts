import { redisAdd, redisGet } from "@/app/lib/Redis"

export async function GET() {
    redisAdd("hello", "world")
    const resp = await redisGet("hello")
    return Response.json({ status: "ok", redis:resp  })
  }
  