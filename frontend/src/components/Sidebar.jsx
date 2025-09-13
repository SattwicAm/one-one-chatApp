// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Flex,
  HStack,
  Circle,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveGroup, setActiveUser } from "../features/chatSlice";
import socket from "../socket";
import api from "../api";
import LogoutButton from "./LogoutButton";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onOpenChat = () => {} }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // array of online user IDs

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/api/users/all");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  // Listen for online users (attach once)
  useEffect(() => {
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };
    socket.on("onlineUsers", handleOnlineUsers);
    return () => socket.off("onlineUsers", handleOnlineUsers);
  }, []);

  const navigate = useNavigate();

  return (
    <Box
      w={{ base: "100%", md: "30%" }}
      h="100vh"
      bg="#111"
      color="white"
      px={4}
      py={5}
      borderRight={{ base: "none", md: "1px solid #333" }}
    >
      <Heading fontSize="2xl" mb={6} color="teal.300">
        QuickChat
      </Heading>

      <VStack align="stretch" spacing={3} flex={1} overflowY="auto">
        {users.map((user) => (
          <Flex
            key={user._id}
            align="center"
            gap={3}
            p={2}
            borderRadius="md"
            _hover={{ bg: "#2c2c2c", cursor: "pointer" }}
            onClick={() => {
              dispatch(setActiveUser(user));
              onOpenChat(); // 👉 only matters on mobile
            }}
          >
            <FaUserCircle size={22} />
            <Text fontSize="md">{user.name}</Text>
            {onlineUsers.includes(user._id) && (
              <Circle size="10px" bg="green.400" ml="auto" />
            )}
          </Flex>
        ))}

        {/* If you re-enable Group Chat, also call onOpenChat() */}
        {/* 
        <Flex
          align="center"
          gap={3}
          p={2}
          borderRadius="md"
          _hover={{ bg: "#2c2c2c", cursor: "pointer" }}
          onClick={() => {
            dispatch(setActiveGroup());
            onOpenChat();
          }}
        >
          <FaUsers size={20} />
          <Text fontWeight="bold" fontSize="md">
            # Group Chat
          </Text>
        </Flex>
        */}
      </VStack>

      <Box mt={6}>
        <LogoutButton />
      </Box>

      <Button colorScheme="teal" onClick={() => navigate("/profile")} mt={2}>
        Edit Profile
      </Button>
    </Box>
  );
};

export default Sidebar;
