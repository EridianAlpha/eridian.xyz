import React, { useEffect, useRef, useState } from "react"
import { Image, ImageProps } from "@chakra-ui/react"

type LazyImageProps = ImageProps & {
    rootMargin?: string
    eager?: boolean
}

const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(function LazyImage(
    { src, alt = "", rootMargin = "300px", loading = "lazy", eager = false, ...rest },
    ref
) {
    const localRef = useRef<HTMLImageElement | null>(null)
    const combinedRef = (node: HTMLImageElement) => {
        localRef.current = node
        if (typeof ref === "function") {
            ref(node)
        } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLImageElement | null>).current = node
        }
    }

    const [isVisible, setIsVisible] = useState(Boolean(eager))

    useEffect(() => {
        if (eager) return
        if (!localRef.current) return

        if (typeof IntersectionObserver === "undefined") {
            // Fallback: load immediately on environments without IntersectionObserver
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                })
            },
            { root: null, rootMargin, threshold: 0.01 }
        )

        observer.observe(localRef.current)

        return () => {
            observer.disconnect()
        }
    }, [rootMargin, eager])

    const webpSrc = typeof src === "string" ? src.replace(/\.(png|jpg|jpeg)$/i, ".webp") : undefined

    // Prefer WebP if present; fall back to original
    return (
        <picture>
            {isVisible && webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
            <Image
                ref={combinedRef}
                src={isVisible ? (src as string | undefined) : undefined}
                alt={alt}
                loading={eager ? "eager" : loading}
                {...rest}
            />
        </picture>
    )
})

export default LazyImage
