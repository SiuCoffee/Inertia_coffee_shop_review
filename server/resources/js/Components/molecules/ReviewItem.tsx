import { Box, Button, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { UserName } from "../atoms/UserName";
import { StarRating } from "../atoms/StarRating";

type Props = {
  review: {
    id: number;
    comment: string;
    rating: number;
    user: {
      name: string;
    };
  };
}

export const ReviewItem = (props: Props) => {
  const { review } = props;

  return (
    <Box
      key={review.id}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      mb={4}
    >
      <Text style={{ whiteSpace: 'pre-wrap' }}>{review.comment}</Text>
      <UserName name={review.user.name} />
      <StarRating rating={review.rating} />
      <Box mt={3} w="100%" display="flex" justifyContent="flex-end">
        <Link href={route('review.edit', { id: review.id })}>
          <Button colorScheme="blue" fontSize="14px">
            レビューを編集
          </Button>
        </Link>
      </Box>
    </Box>
  );
};