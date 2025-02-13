import { Box } from "@chakra-ui/react";
import { ReviewItem } from "../molecules/ReviewItem";

type Props = {
  reviews: {
    id: number;
    comment: string;
    rating: number;
    user: {
      name: string;
    };
  }[];
}

export const ReviewList = (props: Props) => {
  const { reviews } = props;

  return (
    <>
      {reviews.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
    </>
  );
};