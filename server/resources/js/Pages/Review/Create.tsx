import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, FormControl, FormLabel, Heading, HStack, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { router } from "@inertiajs/react";
import { StarIcon } from "@chakra-ui/icons";

import MainLayout from "@/Layouts/MainLayout";

type Props = {
  shop: {
    id: number;
    name: string;
  }
}

const Create = (props: Props) => {
  const { shop } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [values, setValues] = useState({
    shop_id: shop.id,
    rating: 1,
    comment: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCheck = (e) => {
    e.preventDefault();
    onOpen();
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    router.post(route('review.store'), values);
  };

  return (
    <Box
      p={4}
      m={4}
      mx="auto"
      bg="gray.100"
      borderRadius="md"
      boxShadow="md"
      w={{ base: "90%", md: 700 }}
    >
      {/* アラートダイアログ */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
          <AlertDialogHeader>
            最終確認
          </AlertDialogHeader>
          <AlertDialogBody>
            この内容で投稿しますか？
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {loading ? "投稿中..." : "投稿する"}
            </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Heading as="h2" size="md" mb={4} color="gray.800">
        レビューを投稿
      </Heading>
      <Text fontSize="xl" color="gray.500" mb={2}>
        {shop.name}
      </Text>
      <form onSubmit={handleCheck}>
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor="rating" fontWeight="bold">
            評価
          </FormLabel>
          <HStack spacing={1} mb={4}>
            {Array(5).fill("").map((_, i) => (
              <StarIcon
              cursor="pointer"
                key={i}
                color={ i < values.rating || i < hoverRating ? "yellow.500" : "gray.300"}
                onClick={() => setValues({...values, rating: i + 1})}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </HStack>
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor="comment" fontWeight="bold">
            コメント
          </FormLabel>
          <Textarea
            id="comment"
            name="comment"
            placeholder="コメントを入力してください"
            onChange={handleChange}
            bg="white"
          >
          </Textarea>
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={4}>
          投稿する
        </Button>
      </form>
    </Box>
  );
};

Create.layout = (page: ReactNode) => <MainLayout children={page} title="レビュー投稿" />

export default Create;