import { useEffect, useRef } from "react";

function useDidUpdateEffect(fn: Function, inputs: any[]) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current)
            fn();

        else
            didMountRef.current = true;
    }, inputs);
}

export default useDidUpdateEffect