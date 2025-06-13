"use client";

import "@ant-design/v5-patch-for-react-19";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { initSocket } from "@/lib/socket/socket";
import { fetcher } from "@/lib/api/api";
import { Input, Button, List } from "antd";

interface ApiResponse {
  data: Message[];
}

interface Message {
  id: string;
  sender: string;
  message: string;
  senderId: string;
  groupId: string;
  messageId: string;
  isRead: boolean;
  readAt: string | null;
  status: string;
  timestamp: string;
}

interface MessagePageProps {}

const GROUP_ID = "group_123456";

const MessagePage: React.FC<MessagePageProps> = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [senderId, setSenderId] = useState<string | null>(null);
  const [senderName, setSenderName] = useState<string | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof initSocket> | null>(
    null
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("http://localhost:3000/");
    }
  }, [router]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    setSenderId(userId);
    setSenderName(userRole || "Anonymous");
  }, []);

  useEffect(() => {
    const socketInstance = initSocket();
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });
    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    socketInstance.on("connect_error", (error) => {
      console.error("Socket connect error:", error.message);
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const { data: fetchedData, error } = useSWR<ApiResponse>(
    senderId
      ? `http://localhost:5000/api/message/get-messages?groupId=${GROUP_ID}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (fetchedData && Array.isArray(fetchedData.data)) {
      setMessages(fetchedData.data);
    } else {
      console.warn("Fetched data is not valid:", fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (!socket || !senderId) return;

    socket.emit("join_room", { groupId: GROUP_ID }, (response: any) => {
      console.log("Joined room response:", response);
    });

    socket.on("receive_message", (message: Message) => {
      if (message && typeof message === "object" && "messageId" in message) {
        setMessages((prev) => {
          if (
            Array.isArray(prev) &&
            !prev.some((msg) => msg.messageId === message.messageId)
          ) {
            return [...prev, message];
          }
          return prev;
        });
      } else {
        console.error("Invalid message received:", message);
      }
    });

    socket.on("message_read", ({ messageId, isRead, readAt, status }) => {
      setMessages((prev) => {
        if (Array.isArray(prev)) {
          return prev.map((msg) =>
            msg.messageId === messageId
              ? { ...msg, isRead, readAt, status }
              : msg
          );
        }
        return prev;
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_read");
    };
  }, [socket, senderId]);

  const handleSend = () => {
    if (!input.trim() || !senderId || !socket || !socket.connected) return;

    const messageData = {
      sender: senderName || "Anonymous",
      message: input,
      senderId,
      groupId: GROUP_ID,
    };

    socket.emit("send_message", messageData, (response: any) => {
      console.log("Send message response:", response);
    });
    setInput("");
  };

  if (error) return <div>Failed to load messages</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm min-h-[500px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Message</h2>
      <div className="flex-1 overflow-auto mb-4">
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              className={`flex ${
                item.senderId === senderId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  item.senderId === senderId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p className="font-semibold text-sm mb-1 capitalize">
                  {item.sender}
                </p>
                <p>{item.message}</p>
                <span className="text-xs">
                  {new Date(item.timestamp).toLocaleTimeString()}{" "}
                  {item.isRead ? "✓✓" : "✓"}
                </span>
              </div>
            </List.Item>
          )}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessagePage;
