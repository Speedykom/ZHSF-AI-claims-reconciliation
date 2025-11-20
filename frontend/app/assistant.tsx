"use client";

import { AssistantRuntimeProvider, ChatModelAdapter, useLocalRuntime } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb
} from "@/components/ui/breadcrumb";

const ModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    try {
      const formattedMessages = messages.map((m) => ({
        role: m.role,
        content: m.content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join("\n"),
      }));

      const result = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: formattedMessages }),
        signal: abortSignal,
      });

      const data = await result.json();
      
      const messageText = data[0]

      return {
        content: [
          {
            type: "text",
            text: messageText.output,
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  }
};

export const Assistant = () => {
  const runtime = useLocalRuntime(ModelAdapter);
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <p className="font-semibold text-md sm:text-xl">ZHSF AI Assistant</p>
              </Breadcrumb>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
