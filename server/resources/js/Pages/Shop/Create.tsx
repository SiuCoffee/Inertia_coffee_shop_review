import MainLayout from '@/Layouts/MainLayout';
import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea, useToast } from '@chakra-ui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

const Create = () => {
  const { csrf_token} = usePage().props;

  const { data, setData, post, errors } = useForm({
    name: "",
    location: "",
    description: "",
    images: [],
  });

  const toast = useToast();
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("送信データ:",data);

    router.post(route("shop.store"), {
      _token: csrf_token,
      name: data.name,
      location: data.location,
      description: data.description,
      images: data.images,
    });
  }

  return (
    <Box p={4} w={{ base: "90%", md: 700 }}>
      <Heading as="h2" fontSize={{ base: 18, md: 24}} mb={6}>
        店舗新規作成
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
          {/* プレビュー */}
          {data.images.length > 0 && (
            <Box display="flex" p={4} bg="gray.200">
              {data.images.map((image) => (
                <Box px={2} key={image.name}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  style={{ width: 100 }}
                  />
                </Box>
              ))}
            </Box>
          )}
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
          作成
        </Button>
      </form>
    </Box>
  );
}

Create.layout = (page: ReactNode) => <MainLayout children={page} title="店舗新規作成" />

export default Create;