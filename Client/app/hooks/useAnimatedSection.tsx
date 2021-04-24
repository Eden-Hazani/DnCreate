import { useEffect, useState } from "react"
import { Animated } from "react-native"

const useAnimateSection = (startingPosition: number, delay: number) => {
    const [animatedVal, setAnimatedVal] = useState(new Animated.ValueXY({ x: 0, y: startingPosition }));
    useEffect(() => {
        Animated.timing(animatedVal, {
            toValue: { x: 0, y: 0 },
            duration: 400,
            delay,
            useNativeDriver: false
        }).start()
    }, [])

    return animatedVal
}

export default useAnimateSection