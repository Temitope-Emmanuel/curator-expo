import React from "react"

export const useTime = (initialTime:number) => {
    const [time,setTime] = React.useState(initialTime ?? 0)
    
    const increaseTime = () => {
        setTime(time+1000)
    }
    const decreaseTime = () => {
        setTime(time-1000)
    }
    return [time,increaseTime,decreaseTime,setTime] as const
}