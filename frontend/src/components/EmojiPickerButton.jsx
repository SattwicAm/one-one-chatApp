import React from "react";
import { Menu, IconButton, Portal, Box } from "@chakra-ui/react";
import { BsEmojiSmile } from "react-icons/bs";

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "🙂",
  "😉",
  "😊",
  "😍",
  "🥰",
  "😘",
  "😜",
  "🤩",
  "😎",
  "🤔",
  "🤗",
  "😴",
  "🤤",
  "😭",
  "😇",
  "😏",
  "👍",
  "👎",
  "🙏",
  "👏",
  "🙌",
  "🤝",
  "🔥",
  "🎉",
  "✨",
  "💯",
  "❤️",
  "💖",
  "💙",
  "💚",
  "💛",
  "💜",
];

const EmojiMenuButton = ({ onSelect }) => {
  return (
    <Menu.Root positioning={{ placement: "top-start" }} lazyMount>
      <Menu.Trigger>
        <BsEmojiSmile />
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner zIndex={1500}>
          <Menu.Content bg="#1a1a1a" borderColor="#333" p={2}>
            <Box
              display="grid"
              gridTemplateColumns="repeat(8, 1fr)"
              gap={1}
              maxW="360px"
            >
              {EMOJIS.map((e) => (
                <Menu.Item
                  key={e}
                  onClick={() => onSelect(e)} // closes menu automatically
                  _hover={{ bg: "#2c2c2c" }}
                  px={2}
                  py={1}
                >
                  <Box as="span" fontSize="4xl" lineHeight="1">
                    {e}
                  </Box>
                </Menu.Item>
              ))}
            </Box>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default EmojiMenuButton;
