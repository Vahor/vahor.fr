import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		BUILD_TIME: z.coerce.string(),
	},

	client: {
		NEXT_PUBLIC_BUILD_TIME: z.coerce.string(),
	},

	runtimeEnv: {
		BUILD_TIME: process.env.BUILD_TIME,
		NEXT_PUBLIC_BUILD_TIME: process.env.BUILD_TIME,
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
