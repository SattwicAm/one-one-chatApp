// src/pages/ChatPage.jsx
import React, { useState } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import GroupChatBox from "../components/GroupChatBox";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const activeGroup = useSelector((state) => state.chat.activeGroup);
  const activeUser = useSelector((state) => state.chat.activeUser);

  // true on phones, false on md+
  const isMobile = useBreakpointValue({ base: true, md: false });

  // mobile-only UI state: start on list (sidebar)
  const [showList, setShowList] = useState(true);

  const openChat = () => {
    if (isMobile) setShowList(false);
  };
  const goBackToList = () => {
    if (isMobile) setShowList(true);
  };

  // md+ => show both panes
  if (!isMobile) {
    return (
      <Box display="flex" h="100vh">
        <Sidebar />
        {activeGroup ? <GroupChatBox /> : <ChatBox />}
      </Box>
    );
  }

  // mobile => conditional rendering
  return (
    <Box display="flex" h="100vh">
      {showList ? (
        <Sidebar onOpenChat={openChat} />
      ) : activeGroup ? (
        <GroupChatBox onBack={goBackToList} />
      ) : (
        <ChatBox onBack={goBackToList} />
      )}
    </Box>
  );
};

export default ChatPage;
