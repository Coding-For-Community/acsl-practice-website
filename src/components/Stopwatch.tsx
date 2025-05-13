import {
  Paper,
  PaperProps,
  PolymorphicComponentProps,
  rem,
  Text,
} from "@mantine/core"
import { RefObject, useEffect, useState } from "react"

export interface StopwatchArgs
  extends PolymorphicComponentProps<"p", PaperProps> {
  // A RefObject<number> basically stores a number "variable".
  // You can use `ref.current = 2` to set its value and `ref.current` to get its value.
  timeRef: RefObject<number>
  disabled: boolean
}

export function Stopwatch(args: StopwatchArgs) {
  const [ellapsedSecs, setEllapsedSecs] = useState(0)
  useEffect(() => {
    if (args.disabled) return
    const interval = setInterval(() => {
      args.timeRef.current += 1
      setEllapsedSecs(args.timeRef.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [args.timeRef, args.disabled])

  const renderTime = (): string => {
    const minutes = Math.floor(ellapsedSecs / 60)
    const seconds = ellapsedSecs % 60
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`
  }
  return (
    <Paper bg="yellow" p={rem(5.6)} {...args}>
      <Text c="white">{renderTime()}</Text>
    </Paper>
  )
}
