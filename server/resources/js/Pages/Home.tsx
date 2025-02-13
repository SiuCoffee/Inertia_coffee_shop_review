import React, { ReactNode } from "react";
import { Box, Heading, HStack, Image, Link, Text, useToast, VStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import MainLayout from "../Layouts/MainLayout";
import { ReviewList } from "@/Components/organisms/ReviewList";

type Props = {
  shops: {
    id: number;
    name: string;
    address: string;
    description: string;
  }[];
  newReviews: {
    id: number;
    rating: number;
    comment: string;
    user: {
      name: string;
    }
  }[];
};

const Home = (props: Props) => {
  const { shops, newReviews, status } = props;

  const toast = useToast();

  if (status === "shop_created") {
    toast({
      position: "top",
      title: "店舗の登録成功",
      description: "店舗の登録が完了しました。",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <>
    <Box p={4}>
    <Heading
      fontSize={{ base: "24px", md: "40px", lg: "56px"}}
      mb={2}
      >
        ショップ一覧
    </Heading>
    <VStack spacing={4} align="stretch">
      {shops.map((shop) => (
        <Link key={shop.id} href={`/shop/${shop.id}`} _hover={{color: "gray.500"}}>
        <Box
          p={4}
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          boxShadow={"lg"}
          >
          <HStack spacing={4}>
            <Image
              boxSize="100px"
              objectFit="cover"
              src="https://placehold.jp/100x100.png"
              alt={shop.name}
            />
            <VStack align="start">
              <Heading as="h3" size="md">{shop.name}</Heading>
              <Text>{shop.description}</Text>
            </VStack>
          </HStack>
        </Box>
        </Link>
      ))}
    </VStack>
      <Heading
        fontSize={{ base: "24px", md: "40px", lg: "56px"}}
        mt={8}
        mb={2}
      >
          新着レビュー
      </Heading>
      <VStack spacing={4} align="stretch">
        <ReviewList reviews={newReviews} />
      </VStack>
    </Box>
    </>
  );
};

Home.layout = (page: ReactNode) => <MainLayout children={page} title="ホームの画面" />;

export default Home;