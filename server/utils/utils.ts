import type { z } from "zod"

export const checkParseResult = <T>(b: z.SafeParseReturnType<T, T>) => {
  if (!b.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  } else {
    return b.data
  }
}
