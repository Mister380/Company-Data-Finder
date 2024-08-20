import React, { useState, useEffect } from 'react';
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
import Papa from 'papaparse';

function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const logMessageToCSV = (message) => {
    const csvData = Papa.unparse([
      {
        timestamp: new Date().toISOString(),
        role: message.role,
        content: message.content,
      },
    ]);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'chat_log.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    logMessageToCSV(userMessage);
    setInput('');
    setIsLoading(true);
    try {
      // API call logic would go here
      // For now, we'll simulate a response
      const botResponse = { role: 'assistant', content: `You said: ${input}` };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      logMessageToCSV(botResponse);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
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
        <Box flex={1} bg="gray.50" display="flex" flexDirection="column">
          <Container maxW="container.md" flex={1} overflowY="auto" py={4}>
            <VStack spacing={4} align="stretch">
              {messages.map((message, index) => (
                <Box
                  key={index}
                  bg={message.sender === 'user' ? 'blue.100' : 'gray.100'}
                  p={3}
                  borderRadius="lg"
                  alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  maxW="70%"
                >
                  <Text>{message.content}</Text>
                </Box>
              ))}
            </VStack>
          </Container>
          <Box bg="white" p={4} borderTop="1px" borderColor="gray.200">
            <Container maxW="container.md">
              <InputGroup size="lg">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message here..."
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
            </Container>
          </Box>
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
