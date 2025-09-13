import { Button, CloseButton, Input, Dialog, Portal } from "@chakra-ui/react";

const EditDeleteDialog = ({
  isOpen,
  onClose,
  editedText,
  setEditedText,
  onUpdate,
  onDelete,
}) => {
  // 🔁 Manually control visibility

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.800" color="white" zIndex={1400}>
            <Dialog.Header>
              <Dialog.Title>Edit Message</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Edit message..."
              />
            </Dialog.Body>

            <Dialog.Footer justifyContent="space-between">
              <Button
                onClick={() => {
                  onUpdate();
                  onClose();
                }}
                colorScheme="blue"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                colorScheme="red"
                variant="outline"
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default EditDeleteDialog;
