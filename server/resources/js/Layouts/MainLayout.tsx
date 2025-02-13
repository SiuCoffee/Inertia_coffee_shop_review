import React, { ReactNode } from "react";
import { usePage, Link as InertiaLink } from "@inertiajs/react";
import { Box, Heading, HStack, Link as ChakraLink, Menu, MenuButton, IconButton, MenuList, MenuItem, Text, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, VStack, Button } from "@chakra-ui/react";
import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";

type Props = {
  children: ReactNode;
  title: string;
}

const MainLayout = (props: Props) => {
  const { children } = props;
  const { auth } = usePage().props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
     <Drawer
        size={{ base: "xs", md: "sm" }}
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
  
            <DrawerBody>
              <VStack>
                {auth.user ? (
                  <Box display="block">
                    <Box fontSize="xs" mb={4}>{auth.user.name}さん</Box>
                    <VStack>
                    <ChakraLink href={route("dashboard")} _hover={{ color: "gray.500" }}>マイページ</ChakraLink>
                      <ChakraLink href={route('shop.create')} _hover={{ color: "gray.500" }}>店舗の登録</ChakraLink>
                      <InertiaLink href={route('logout')} method="post" onClick={onClose}>
                        <ChakraLink _hover={{ color: "gray.500" }}>ログアウト</ChakraLink>
                      </InertiaLink>
                      
                    </VStack>
                  </Box>
                ) : (
                    <>
                        <ChakraLink href={route('login')}>ログイン</ChakraLink>
                        <ChakraLink href={route('register')}>新規登録</ChakraLink>
                    </>
                )}
                    
              </VStack>
            </DrawerBody>
        </DrawerContent>
      </Drawer>
      <header>
      <Box bg={"orange.700"}>
        <HStack justifyContent={"space-between"} alignItems={"center"} py={{ base: 0, md: 3 }} px={{ base: 1, md: 2 }}>
          <Heading
            as="h1"
            size={{ base: "xs", md: "md" }}
            color={"white"}
          >
            <ChakraLink href={route('shop.index')} _hover={{ color: "gray.500" }}>
              {import.meta.env.VITE_APP_NAME}
            </ChakraLink>
          </Heading>
          {/* PC表示 */}
          <HStack display={{ base: "none", md: "flex" }} color={"white"} fontWeight={"bold"}>
        {auth.user ? (
          <Box>
            <Text
              cursor="pointer"
              onClick={onOpen}
              ref={btnRef}
            >
              {auth.user.name}さん
              <SettingsIcon mx={2}/>
            </Text>
          </Box>
        ) : (
          <>
            <Box>
              <ChakraLink href={route('login')}>
                <Button colorScheme={"white"} bg="white" color="black" _hover={{bg:"orange.500"}} mr={4}>ログイン</Button>
              </ChakraLink>
              <ChakraLink href={route('register')}>
                <Button colorScheme={"white"} bg="white" color="black" _hover={{bg:"orange.500"}}>新規登録</Button>
                  </ChakraLink>
            </Box>
          </>
        )}
          </HStack>
          {/* SP表示 */}
          <Box display={{ base: "block", md: "none" }} px={{ base: "1", md: "0" }} py={{ base: "2", md: "none" }}>
            <Box
              as="button"
              ref={btnRef}
              onClick={onOpen}
              border="2px solid black"
              borderRadius="md"
              p={2}
              _hover={{ borderColor: "gray.500", color: "gray.500" }}>
              <HamburgerIcon fontSize="xl" />
            </Box>
            {/* <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
                colorScheme="white"
                _hover={{ color: "gray.500" }}
              />
              <MenuList>
                <MenuItem icon={<SettingsIcon />}>マイページ</MenuItem>
                <MenuItem>店舗の登録</MenuItem>
              </MenuList>
            </Menu> */}
          </Box>
        </HStack>
        </Box>
      </header>
      <Box>{children}</Box>
      {/* footer */}
      <Box>
        <Box
          bg={"orange.800"}
          color={"white"}
          fontWeight={"bold"}
          textAlign={"center"}
          py={{ base: 2, md: 3 }}
        >
          <Text fontSize={{ base: "16px", md: "20px" }}>&copy; 2025 {import.meta.env.VITE_APP_NAME}</Text>
        </Box>
        </Box>
    </>
  );
}

export default MainLayout;