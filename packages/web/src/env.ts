import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const env = createEnv({
  server: {
    WEB_ORIGIN: z.string().optional().default("http://localhost:3100"),
    SOCKET_URL: z.string().optional().default("http://localhost:3201"),
    DEFAULT_LANGUAGE: z.string().default("EN")
  },

  runtimeEnv: {
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    SOCKET_URL: process.env.SOCKET_URL,
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE
  },
})

export default env
