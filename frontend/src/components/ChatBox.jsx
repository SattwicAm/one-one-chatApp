// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  IconButton,
  Flex,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { FiSend } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import api from "../api";
import socket from "../socket";
import EditDeleteDialog from "./EditDeleteDialog"; // ✅ default import
import EmojiPickerButton from "./EmojiPickerButton"; // keep your existing component

const ChatBox = ({ onBack = () => {} }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const activeUser = useSelector((state) => state.chat.activeUser);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Scroll to bottom on message update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Register socket and listeners
  useEffect(() => {
    socket.emit("registerUser", currentUser._id);

    const onNewPrivate = ({ senderId, content }) => {
      if (senderId === activeUser?._id) {
        setMessages((prev) => [...prev, { sender: senderId, content }]);
      }
    };

    const onEdited = ({ messageId, newContent }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, content: newContent } : m
        )
      );
    };

    const onDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("newPrivateMessage", onNewPrivate);
    socket.on("messageEdited", onEdited);
    socket.on("messageDeleted", onDeleted);

    return () => {
      socket.off("newPrivateMessage", onNewPrivate);
      socket.off("messageEdited", onEdited);
      socket.off("messageDeleted", onDeleted);
    };
  }, [currentUser, activeUser]);

  // Load messages for selected user
  useEffect(() => {
    if (!activeUser) return;
    const fetchMessages = async () => {
      const res = await api.get(`/api/messages/${activeUser._id}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [activeUser]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await api.post("/api/messages", {
      receiverId: activeUser._id,
      content: input,
    });

    socket.emit("sendPrivateMessage", {
      senderId: currentUser._id,
      receiverId: activeUser._id,
      content: input,
    });

    setMessages((prev) => [
      ...prev,
      { sender: currentUser._id, content: input },
    ]);
    setInput("");
  };

  // ====== Edit/Delete Dialog State ======
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleMsgClick = (msg) => {
    if (msg.sender === currentUser._id) {
      setSelectedMsg(msg);
      setEditedText(msg.content);
      setIsDialogOpen(true);
    }
  };

  const handleUpdateMsg = async () => {
    if (!editedText.trim()) {
      setIsDialogOpen(false);
      return;
    }
    try {
      await api.put(`/api/messages/${selectedMsg._id}`, {
        content: editedText,
      });
      socket.emit("editMessage", {
        messageId: selectedMsg._id,
        newContent: editedText,
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDeleteMsg = async () => {
    try {
      await api.delete(`/api/messages/${selectedMsg._id}`);
      socket.emit("deleteMessage", { messageId: selectedMsg._id });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ====== Emoji insert at caret ======
  const insertAtCursor = (emojiChar) => {
    const el = inputRef.current;
    if (!el) {
      setInput((prev) => prev + emojiChar);
      return;
    }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const next = input.slice(0, start) + emojiChar + input.slice(end);
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emojiChar.length;
      el.setSelectionRange(pos, pos);
    });
  };

  if (!activeUser) {
    return (
      <Box
        w={{ base: "100%", md: "70%" }}
        h="100vh"
        bg="#1a1a1a"
        color="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        Select a user to start chatting.
      </Box>
    );
  }

  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "70%" }}
      h="100vh"
      bg="#1a1a1a"
      color="white"
    >
      {/* Header */}
      <HStack spacing={3} px={4} py={3} bg="#111" borderBottom="1px solid #333">
        {isMobile && (
          <IoArrowBackCircle size={38} onClick={onBack} color="#38b2ac" />
        )}
        <FaUserCircle size="30px" color="#38b2ac" />
        <Text fontWeight="semibold" fontSize="md">
          {activeUser.name}
        </Text>
      </HStack>

      {/* Messages */}
      <VStack
        spacing={3}
        align="stretch"
        overflowY="auto"
        px={4}
        py={3}
        flex={1}
      >
        {messages.map((msg, i) => {
          const isSender = msg.sender === currentUser._id;
          return (
            <Flex key={i} justify={isSender ? "flex-end" : "flex-start"}>
              <Box
                bg={isSender ? "#2563eb" : "#2c2c2c"}
                color={isSender ? "white" : "gray.200"}
                px={4}
                py={2}
                borderRadius="2xl"
                maxW="70%"
                cursor={isSender ? "pointer" : "default"}
                onClick={() => handleMsgClick(msg)}
              >
                <Text fontSize="lg">{msg.content}</Text>
              </Box>
            </Flex>
          );
        })}
        <div ref={bottomRef} />
      </VStack>

      {/* Input Row */}
      <Flex px={4} py={3} gap={2} borderTop="1px solid #333" align="center">
        <EmojiPickerButton onSelect={insertAtCursor} />
        <Input
          ref={inputRef}
          bg="#2c2c2c"
          border="none"
          color="white"
          placeholder="Type message..."
          _placeholder={{ color: "gray.400" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton
          icon={<FiSend />}
          onClick={sendMessage}
          colorScheme="blue"
          borderRadius="full"
          aria-label="Send"
        />
      </Flex>

      {/* Edit/Delete Dialog */}
      <EditDeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editedText={editedText}
        setEditedText={setEditedText}
        onUpdate={handleUpdateMsg}
        onDelete={handleDeleteMsg}
      />
    </Flex>
  );
};

export default ChatBox;
