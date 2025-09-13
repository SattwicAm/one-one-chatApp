import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Input, Button } from "@chakra-ui/react";
import socket from "../socket";
import { useSelector } from "react-redux";

const GroupChatBox = () => {
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("joinGroupRoom", "main-room");

    socket.on("receiveGroupMessage", ({ senderName, content }) => {
      setMessages((prev) => [...prev, { senderName, content }]);
    });

    return () => {
      socket.off("receiveGroupMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendGroupMessage", {
      room: "main-room",
      senderName: user.name,
      content: input,
    });
    setMessages((prev) => [...prev, { senderName: "You", content: input }]);
    setInput("");
  };

  return (
    <Box
      w="70%"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="start" overflowY="auto" maxH="80vh">
        {messages.map((msg, i) => (
          <Text key={i}>
            <b>{msg.senderName}:</b> {msg.content}
          </Text>
        ))}
      </VStack>
      <Box mt={4} display="flex" gap={2}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default GroupChatBox;
