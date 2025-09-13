import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import { Link } from "react-router-dom";
import api from "../api";

const RegisterPage = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      dispatch(setUser(res.data)); // login after signup
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg="linear-gradient(to bottom right, #002d3a, #0d2c2c)"
      color="white"
    >
      <Box
        bg="rgba(0,0,0,0.5)"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width="full"
        maxW="sm"
      >
        <Heading textAlign="center" mb={6}>
          REGISTER
        </Heading>

        <VStack spacing={4}>
          {/* Name */}
          <Flex align="center" px={4} borderRadius="full" w="100%">
            <Icon as={FaUser} color="gray.400" mr={2} />
            <Input
              variant="unstyled"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color="white"
            />
          </Flex>

          {/* Email */}
          <Flex align="center" px={4} borderRadius="full" w="100%">
            <Icon as={FaEnvelope} color="gray.400" mr={2} />
            <Input
              variant="unstyled"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="white"
            />
          </Flex>

          {/* Password */}
          <Flex align="center" px={4} borderRadius="full" w="100%">
            <Icon as={FaLock} color="gray.400" mr={2} />
            <Input
              variant="unstyled"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="white"
            />
          </Flex>

          <Button
            onClick={register}
            bg="white"
            color="black"
            borderRadius="full"
            w="100%"
            mt={4}
            _hover={{ bg: "gray.100" }}
          >
            REGISTER
          </Button>

          <Text mt={4} fontSize="sm">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#90cdf4" }}>
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
