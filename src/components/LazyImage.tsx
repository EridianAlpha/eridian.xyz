import React, { useEffect, useRef, useState } from "react"
import { Image, ImageProps } from "@chakra-ui/react"

// Reuse observers per margin to reduce CPU load with many images
type ObserverBundle = {
    observer: IntersectionObserver
    callbacks: WeakMap<Element, () => void>
}
const observerBundles: Map<string, ObserverBundle> = new Map()

function getObserverBundle(margin: string): ObserverBundle {
    const existing = observerBundles.get(margin)
    if (existing) return existing
    const callbacks: WeakMap<Element, () => void> = new WeakMap()
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const cb = callbacks.get(entry.target)
                    if (cb) cb()
                }
            }
        },
        { root: null, rootMargin: margin, threshold: 0 }
    )
    const bundle = { observer, callbacks }
    observerBundles.set(margin, bundle)
    return bundle
}

type LazyImageProps = ImageProps & {
    rootMargin?: string
    eager?: boolean
}

const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(function LazyImage(
    { src, alt = "", rootMargin, loading = "lazy", eager = false, ...rest },
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
        const el = localRef.current
        if (!el) return

        if (typeof IntersectionObserver === "undefined") {
            setIsVisible(true)
            return
        }

        const marginString = rootMargin ?? "3000px 0px 3000px 0px"
        const { observer, callbacks } = getObserverBundle(marginString)
        const onIntersect = () => {
            setIsVisible(true)
            observer.unobserve(el)
            callbacks.delete(el)
        }

        callbacks.set(el, onIntersect)
        observer.observe(el)

        return () => {
            callbacks.delete(el)
            observer.unobserve(el)
        }
    }, [rootMargin, eager])

    // For any PNG/JPG/JPEG/GIF source, prefer a sibling .webp file if it exists
    const webpSrc = typeof src === "string" ? src.replace(/\.(png|jpg|jpeg|gif)$/i, ".webp") : undefined

    // Prefer WebP if present; fall back to original. Use display: contents so wrapper doesn't affect layout/styling.
    return (
        <picture style={{ display: "contents" }}>
            {isVisible && webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
            <Image
                ref={combinedRef}
                src={isVisible ? (src as string | undefined) : undefined}
                alt={alt}
                loading={eager ? "eager" : loading}
                objectFit={(rest as any)?.objectFit ?? "cover"}
                objectPosition={(rest as any)?.objectPosition ?? "center"}
                {...rest}
            />
        </picture>
    )
})

export default LazyImage
