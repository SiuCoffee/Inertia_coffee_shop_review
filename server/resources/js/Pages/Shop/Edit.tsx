import MainLayout from "@/Layouts/MainLayout";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, CloseButton, FormControl, FormLabel, Heading, IconButton, Input, Textarea, useToast } from "@chakra-ui/react";
import { router, useForm, usePage } from "@inertiajs/react";
import { ReactNode } from "react";

const Edit = (props) => {
  const { shop, status } = props;
  const existingImages = shop.shop_images ? shop.shop_images.map((image) => ({
    id: image.id,
    file_name: image.file_name,
    file_path: image.file_path,
  })) : [];
  console.log("existingImages:",existingImages);

  const { csrf_token} = usePage().props;

    const { data, setData, post, errors } = useForm({
      name: shop.name,
      location: shop.location,
      description: shop.description,
      images: [],
      existingImages: existingImages,
    });
  
    const toast = useToast();
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length + data.existingImages.length > 3) {
        toast({
          title: "画像は3枚までしかアップロードできません",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
  
        e.target.value = "";
        return;
      }
      setData("images", files);
    };

    const handleRemoveImage = (index, type) => {
      if (type === "existing") {
        const images = data.existingImages
        images.splice(index, 1);
        setData("existingImages", images);
      } else if (type === "new") {
        const images = data.images;
        images.splice(index, 1);
        setData("images", images);

        const dataTransfer = new DataTransfer();
        const imageFiles = document.getElementById("images").files;

        Array.from(imageFiles).forEach((file, i) => {
          if (i !== index) {
            dataTransfer.items.add(file);
          }
        });
        document.getElementById("images").files = dataTransfer.files;
      }
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      router.post(route("shop.update"), {
        id: shop.id,
        _token: csrf_token,
        name: data.name,
        location: data.location,
        description: data.description,
        images: data.images,
        existingImages: data.existingImages,
      });
    }

    const handleDelete = (e) => {
      e.preventDefault();
      router.delete(route('shop.delete', { id: shop.id }));
    };
  
    return (
      <>
      <Box p={4} w={{ base: "90%", md: 700 }}>
        <Heading as="h2" fontSize={{ base: 18, md: 24}} mb={6}>
          店舗の編集
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="name" mb={4}>
            <FormLabel>店舗名</FormLabel>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="店舗名を入力してください"
              value={data.name ?? ""}
              onChange={(e) => setData("name", e.target.value)}
              isRequired
            />
          </FormControl>
          <FormControl id="location" mb={4}>
            <FormLabel>所在地</FormLabel>
            <Input
              type="text"
              id="location"
              name="location"
              placeholder="所在地を入力してください"
              value={data.location ?? ""}
              onChange={(e) => setData("location", e.target.value)}
              isRequired
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>店舗説明</FormLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="店舗説明を入力してください"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              isRequired
            />
          </FormControl>
          <FormControl id="images" mb={4}>
            <FormLabel>店舗画像</FormLabel>
            <Box display="flex" p="4" bg="gray.200">
              {data.existingImages.map((image, index) => (
                <Box key={image.id} px={2} position="relative">
                  <img
                    src={import.meta.env.VITE_APP_URL + "/" + image.file_path}
                    alt={image.file_name}
                    style={{ width: 100 }}
                  />
                  <IconButton
                    position="absolute"
                    top={{ base: -4, md: -5 }}
                    right="0"
                    isRound="true"
                    variant="solid"
                    colorScheme="gray"
                    aria-label="Done"
                    fontSize={{ base: "xs", md: "sm" }}
                    icon={<CloseIcon />}
                    onClick={() => handleRemoveImage(index, "existing")}
                  />
                </Box>
              ))}
            {/* プレビュー */}
            {data.images.length > 0 && (
              <Box display="flex" p={4} bg="gray.200">
                {data.images.map((image, index) => (
                  <Box px={2} key={image.name} position="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    style={{ width: 100 }}
                    />
                    <IconButton
                    position="absolute"
                    top={{ base: -4, md: -5 }}
                    right="0"
                    isRound="true"
                    variant="solid"
                    colorScheme="gray"
                    aria-label="Done"
                    fontSize={{ base: "xs", md: "sm" }}
                    icon={<CloseIcon />}
                    onClick={() => handleRemoveImage(index, "new")}
                  />
                  </Box>
                ))}
              </Box>
            )}
            </Box>
            <Input
              type="file"
              id="images"
              name="images"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleImageChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            更新する
          </Button>
        </form>
      </Box>
      <Box display="flex" justifyContent="center">
      <form onSubmit={handleDelete}>
        <Button
          type="submit"
          colorScheme="red"
          m={4}
          >
          削除する
        </Button>
      </form>
    </Box>
    </>
    );
}
  
  Edit.layout = (page: ReactNode) => <MainLayout children={page} title="店舗編集" />
  
  export default Edit;