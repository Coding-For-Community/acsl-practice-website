import "@mantine/core/styles.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MantineProvider, createTheme } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App } from "./App.tsx"

const theme = createTheme({})
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
)
