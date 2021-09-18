import { z } from "zod"

export const ContactMessage = z.object({
    name: z.string(),
    subject: z.string().max(60),
    text: z.string().max(600),
    from: z.string().email(),
})