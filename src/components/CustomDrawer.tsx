import { Drawer, rem } from "@mantine/core";

/**
 * A custom drawer component with styling that we need
 */
export const CustomDrawer = Drawer.withProps({
  styles: {
    title: {
      color: "var(--mantine-color-blue-5)",
      fontWeight: "bold",
      fontSize: rem(24)
    }
  },
  padding: rem(15),
  size: "md",
  position: "right"
})