"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMessages, sendMessage } from "./actions";
import { useEffect, useRef, useState } from "react";
import { VehicleBookingMessage } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

type MessageBoardProps = {
  bookingId: string;
};
export default function MessageBoard({ bookingId }: MessageBoardProps) {
  const [messagInProgress, setMessagInProgress] = useState<string[]>([]);
  const [messages, setMessages] = useState<VehicleBookingMessage[]>([]);
  const [composingMessage, setComposingMessage] = useState("");
  const messageArea = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagInProgress?.length) return;
    const interval = setInterval(() => {
      getMessages(bookingId).then((messages) => setMessages(messages));
    }, 300);
    return () => clearInterval(interval);
  }, [bookingId, messagInProgress?.length]);

  const handleSendMessage = async () => {
    const msg = composingMessage;
    setMessagInProgress((prev) => [...prev, msg]);
    setComposingMessage("");
    const newMessage = await sendMessage(bookingId, msg);
    if (!newMessage) return;
    setMessagInProgress((pre) => pre.filter((m) => m !== msg));
    setMessages((messages) => [...messages, newMessage]);
    setTimeout(() => {
      messageArea.current?.scrollTo(0, messageArea.current.scrollHeight);
    }, 10);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline">Message</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          <div className="grid grid-rows-[1fr_auto] h-full py-4">
            <div ref={messageArea} className="justify-end space-y-2 mb-4 overflow-auto">
              {messages?.reverse().map((message) => (
                <div key={message.id} className="flex flex-col justify-end">
                  <div className="pr-2">
                    <div>
                      <span className="text-[12px]">{message.userDisplayName}</span>
                    </div>
                    <div className="bg-gray-200 px-3 py-2 rounded-lg text-sm">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
              {messagInProgress.map((message, index) => (
                <div key={index} className="flex flex-col justify-end">
                  <div className="pr-2">
                    <div>
                      <span className="text-[12px]">&nbsp;</span>
                    </div>
                    <div className="bg-gray-200 px-3 py-2 rounded-lg text-sm">{message}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid w-full gap-2">
              <Textarea
                value={composingMessage}
                onChange={(e) => setComposingMessage(e.currentTarget.value)}
                placeholder="Type your message here."
              />
              <Button onClick={handleSendMessage}>Send message</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
