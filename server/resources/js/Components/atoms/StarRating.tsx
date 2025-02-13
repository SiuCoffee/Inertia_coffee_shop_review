import { HStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

type Props = {
  rating: number;
}

export const StarRating =(props: Props) => {
  const { rating } = props;

  return (
    <HStack>
      {Array(5).fill("").map((_,i) => (
        <StarIcon key={i} color={i < rating ? "yellow.500" : "gray.300"} />
      ))}
    </HStack>
  );
};