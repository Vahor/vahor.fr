import * as z from "zod"

export const errorMap: z.ZodErrorMap = (error, ctx) => {
    if (error.message) return { message: error.message }

    switch (error.code) {
        case z.ZodIssueCode.invalid_type:
            if (error.received === "undefined") {
                return { message: "Requis" }
            }
            break
        case z.ZodIssueCode.too_small:
            if (error.type === "string")
                return { message: `Doit faire au moins ${error.minimum} caractères` }
            break
        case z.ZodIssueCode.too_big:
            if (error.type === "string")
                return { message: `Doit faire au maximum ${error.maximum} caractères` }
            if (error.type == "number") return { message: `Ne doit pas dépasser ${error.maximum}` }
            break

        case z.ZodIssueCode.invalid_string:
            if (error.validation === "email") return { message: `Ce n'est pas une adresse mail valide` }
            break
    }

    return { message: ctx.defaultError }
}