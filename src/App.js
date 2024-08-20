import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Input,
  Text,
  Container,
  Flex,
  Image,
  HStack,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  Circle,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setInput('');
    setIsLoading(true);
    // API call logic would go here
    setIsLoading(false);
  };

  return (
    <ChakraProvider>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        {/* Header */}
        <Box as="header" bg="white" boxShadow="sm" py={4}>
          <Container maxW="container.xl">
            <Flex justify="space-between" align="center">
              <Image src="/openai-logo.png" alt="OpenAI Logo" h="30px" />
              <HStack spacing={8}>
                {['Research', 'Products', 'Safety', 'Company'].map((item) => (
                  <Link key={item} fontWeight="medium" fontSize="sm">
                    {item}
                  </Link>
                ))}
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Box flex={1} bg="gray.50" display="flex" alignItems="center">
          <Container maxW="container.md">
            <VStack spacing={12} align="stretch">
              <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold" textAlign="center" lineHeight="1.2">
                How can I help you today?
              </Text>
              <InputGroup size="lg">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Recommend an easy potluck dish"
                  bg="white"
                  borderRadius="full"
                  pr="4.5rem"
                  fontSize="md"
                  h="60px"
                />
                <InputRightElement width="4.5rem" h="60px">
                  <IconButton
                    h="40px"
                    w="40px"
                    onClick={sendMessage}
                    isLoading={isLoading}
                    icon={<ArrowForwardIcon />}
                    colorScheme="blue"
                    borderRadius="full"
                  />
                </InputRightElement>
              </InputGroup>
              <HStack justify="center" spacing={2} pt={4}>
                {[...Array(4)].map((_, i) => (
                  <Circle key={i} size={2} bg={i === 0 ? "blue.500" : "gray.300"} />
                ))}
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Box as="footer" bg="gray.800" color="white" py={4}>
          <Container maxW="container.xl">
            <Flex justify="space-between" align="center">
              <Image src="/openai-logo-white.png" alt="OpenAI Logo" h="20px" />
            </Flex>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
