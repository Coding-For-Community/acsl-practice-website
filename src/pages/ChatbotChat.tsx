import {
  ActionIcon,
  Affix,
  Group,
  Paper,
  rem,
  ScrollArea,
  Textarea,
} from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import { SendMessageIcon } from "../components/icons/SendMessageIcon"
import { getHotkeyHandler } from "@mantine/hooks"
import { Problem } from "../api/types"
import { BACKEND_URL } from "../api/constants/otherConstants"
import Markdown from "react-markdown"

export interface ChatMsg {
  content: string
  isAi: boolean
}

export interface ChatbotChatArgs {
  problem: Problem | null
  userAnswer: string | null
  messages: ChatMsg[]
  setMessages: (msgs: ChatMsg[]) => void
}

const RATE_LIMITED_MSG = {
  response: "The AI bot is being rate limited; try again in 1 minute.",
}

export function ChatbotChat(args: ChatbotChatArgs) {
  const [focused, setFocused] = useState(false)
  const [currentMsg, setCurrentMsg] = useState("")
  const viewportRef = useRef<HTMLDivElement>(null)

  function handleClickOut(event: MouseEvent) {
    if (
      viewportRef.current == null ||
      viewportRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setFocused(false)
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOut)
    return () => document.removeEventListener("mousedown", handleClickOut)
  }, [viewportRef])
  useEffect(() => {
    // when args.messages changes, scroll to the latest message
    viewportRef.current
      ?.querySelector(".scrollarea")
      ?.querySelectorAll(".textbox")
      ?.[args.messages.length - 1]?.scrollIntoView(true)
  }, [args.messages, viewportRef.current])

  function onSubmit() {
    if (currentMsg === "") return
    let msgList = args.messages.concat({
      content: currentMsg,
      isAi: false,
    })
    setCurrentMsg("")
    args.setMessages(msgList)
    fetch(BACKEND_URL + "/ai-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...args,
        messages: msgList,
      }),
    })
      .then(resp => (resp.status === 429 ? RATE_LIMITED_MSG : resp.json()))
      .then(json => {
        msgList = msgList.concat({
          content: json["response"],
          isAi: true,
        })
        args.setMessages(msgList)
      })
  }

  if (args.problem == null || args.userAnswer == null) {
    return <></>
  }

  return (
    <Affix bottom={rem(-8)} right={rem(-8)}>
      <Paper
        radius={rem(10)}
        bg="gray.4"
        pt={focused ? rem(10) : 0}
        pl={rem(10)}
        pb={rem(15)}
        pr={rem(15)}
        onFocus={() => setFocused(true)}
        ref={viewportRef}
      >
        <ScrollArea.Autosize className="scrollarea" mah={rem(300)} mb={rem(10)}>
          {focused &&
            args.messages.map((msg, idx) => (
              <Paper
                className="textbox"
                shadow="sm"
                px="xs"
                py={msg.isAi ? rem(0.5) : "xs"}
                bg={msg.isAi ? "blue" : "gray"}
                radius={rem(10)}
                mb={rem(10)}
                w={msg.isAi ? rem(250) : rem(150)}
                key={idx}
                ml={msg.isAi ? 0 : "auto"}
              >
                {msg.isAi ? <Markdown>{msg.content}</Markdown> : msg.content}
              </Paper>
            ))}
        </ScrollArea.Autosize>

        <Group gap={rem(15)}>
          <Textarea
            value={currentMsg}
            onChange={e => setCurrentMsg(e.currentTarget.value)}
            onKeyDown={getHotkeyHandler([["Enter", onSubmit]])}
            radius={rem(10)}
            placeholder="Ask AI..."
            autosize
            w={rem(350)}
            rightSection={
              <ActionIcon
                variant="filled"
                radius={rem(10)}
                color="blue.8"
                onClick={onSubmit}
              >
                <SendMessageIcon />
              </ActionIcon>
            }
          />
        </Group>
      </Paper>
    </Affix>
  )
}
