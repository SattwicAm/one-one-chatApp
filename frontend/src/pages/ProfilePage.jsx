import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import api from "../api";
import { setUser } from "../features/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.name || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!user?._id || !username.trim()) return;

    const formData = new FormData();
    formData.append("username", username);
    if (file) formData.append("avatar", file);

    setLoading(true);
    try {
      const res = await api.put(`/api/users/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(setUser(res.data));
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("❌ Update failed:", err.message);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await api.delete(`/api/users/remove-avatar/${user._id}`);
      dispatch(setUser(res.data));
      alert("🗑️ Profile image deleted!");
    } catch (err) {
      console.error("❌ Avatar deletion failed:", err.message);
      alert("Failed to delete avatar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Update Profile
        </Text>

        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="New username"
        />

        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <Button
          onClick={handleUpdate}
          isLoading={loading}
          colorScheme="teal"
          width="full"
        >
          Update
        </Button>

        <Button
          onClick={handleDeleteAvatar}
          isLoading={loading}
          colorScheme="red"
          variant="outline"
          width="full"
        >
          Delete Profile Image
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
