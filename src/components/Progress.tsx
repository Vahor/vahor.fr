import { useRouter } from "next/router"
import { useEffect } from "react"
import NProgress from "nprogress"

export const Progress = () => {
    const router = useRouter()

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        const handleStart = () => {
            NProgress.set(0.3) // Start Position
            NProgress.start()
        }
        const handleComplete = () => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                NProgress.done(true)
            }, 200) // StopDelayMs
        }

        router.events.on("routeChangeStart", handleStart)
        router.events.on("routeChangeComplete", handleComplete)
        router.events.on("routeChangeError", handleComplete)

        return () => {
            NProgress.done()
            router.events.off("routeChangeStart", handleStart)
            router.events.off("routeChangeComplete", handleComplete)
            router.events.off("routeChangeError", handleComplete)
        }
    })

    return <></>
}

