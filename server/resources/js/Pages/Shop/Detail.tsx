import { ReactNode, useEffect } from "react";

import MainLayout from "../../Layouts/MainLayout";
import { Box, Button, Heading, HStack, Image, Link, Text, useToast } from "@chakra-ui/react";

import { ReviewList } from "@/Components/organisms/ReviewList";
import { EditIcon, SmallAddIcon } from "@chakra-ui/icons";

type Props = {
  shop: {
    id: number;
    name: string;
    location: string;
    description: string;
    shop_images: {
      id: number;
      file_name: string;
      file_path: string;
      file_mime: string;
    }[],
  },
  reviews: {
    id: number;
    rating: number;
    comment: string;
    user: {
      name: string;
    }
  }[],
  status: string;
}

const Detail = (props: Props) => {
  const { shop, reviews, status } = props;
  const toast = useToast();

  useEffect(() => {
    if(status === "review_success") {
      toast({
        position: "top",
        title: "レビューの投稿",
        description: "レビューを投稿しました",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } else if (status === "review_updated") {
      toast({
        position: "top",
        title: "レビューの更新",
        description: "レビューを更新しました",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } else if (status === "review_deleted") {
      toast({
        position: "top",
        title: "レビューの削除",
        description: "レビューを削除しました",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } else if (status === "shop_updated") {
      toast({
        position: "top",
        title: "ショップの更新",
        description: "ショップを更新しました",
      })
    }
  }, [status]);

  return (
    <Box p={4}>
      <HStack spacing={4}>
        <Heading as="h2" size="xl" mb={4}>
          {shop.name}
        </Heading>
        <Link href={route("shop.edit", { id: shop.id })}>
          <Button p={2} borderRadius="10" bg="gray.200">
            編集
            <EditIcon />
          </Button>
        </Link>
      </HStack>
      {shop.shop_images && shop.shop_images.length > 0 ? (
        shop.shop_images.map((image) => (
            <Image
              key={image.id}
              boxSize="300px"
              objectFit="contain"
              src={import.meta.env.VITE_APP_URL + "/" + image.file_path}
              alt={image.file_name}
              mb={4}
            />
        ))
      ) : (
        <Image
          key={shop.id}
          boxSize="300px"
          objectFit="contain"
          src="https://placehold.jp/300x300.png"
          alt={shop.name}
          mb={4}
        />
      )}
      <Text mb={2}>{shop.description}</Text>
      <Text mb={2}>{shop.location}</Text>
      {/* Review */}
      <Box mt={8}>
        <Heading as="h3" size="lg" mb={4}>
          レビュー
        </Heading>
        <Box>
          <Link href={`/review/create/shop/${shop.id}`}>
            <Button my={4}><SmallAddIcon />レビューを書く</Button>
          </Link>
        </Box>
        <Box>
          {reviews.length > 0 &&  (
            <Box mb={2}>
              ({reviews.length}件のレビュー)
            </Box>
          )}
        </Box>
        <Box>
          {reviews.length === 0 && (
            <Text>レビューはまだありません</Text>
          )}
          <ReviewList reviews={reviews} />
        </Box>
      </Box>
    </Box>
  );
}
Detail.layout = (page: ReactNode) => <MainLayout children={page} title="ショップ詳細" />;

export default Detail;