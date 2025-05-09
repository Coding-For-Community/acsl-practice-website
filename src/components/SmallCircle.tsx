import { Paper, rem } from "@mantine/core"

export const SmallCircle = Paper.withProps({
  ml: "auto",
  bg: "blue",
  c: "white",
  radius: rem(15),
  h: rem(30),
  w: rem(30),
  py: rem(4),
  fz: "sm",
  style: { textAlign: "center" },
})
