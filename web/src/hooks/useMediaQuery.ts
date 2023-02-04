import { useEffect, useState, useCallback } from "react";

export const useMediaQuery = (width: string) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: MediaQueryListEvent) => {
        if (e.matches) {
            setTargetReached(true);
        } else {
            setTargetReached(false);
        }
    }, []);
    useEffect(() => {
        const media = window.matchMedia(`(min-width: ${width})`);
        media.addEventListener("change", e => updateTarget(e));
        if (media.matches) {
            setTargetReached(true);
        }
        return () => media.removeEventListener("change", e => updateTarget(e));
    }, [width, updateTarget]);
    return targetReached;
};