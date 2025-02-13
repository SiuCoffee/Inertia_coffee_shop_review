import { Text } from "@chakra-ui/react";

type Props = {
  name: string;
}

export const UserName = (props: Props) => {
  const { name } = props;
  return (
    <Text
      fontSize="sm"
      textAlign="right"
      mt={2}>
        {name}
    </Text>
  );
};