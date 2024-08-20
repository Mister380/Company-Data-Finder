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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Papa from 'papaparse';

const tableStyles = {
  table: {
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    width: '100%',
  },
  th: {
    bg: 'gray.50',
    color: 'gray.600',
    fontWeight: 'semibold',
    px: 4,
    py: 2,
    textAlign: 'left',
  },
  td: {
    px: 4,
    py: 2,
    borderTop: '1px',
    borderColor: 'gray.100',
  },
};

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

  const renderTable = (data) => {
    return (
      <Box overflowX="auto" my={4}>
        <Table variant="simple" size="sm" borderRadius="lg" boxShadow="sm">
          <Thead bg="gray.100">
            <Tr>
              {Object.keys(data[0]).map((header, index) => (
                <Th key={index} textAlign="left" py={2} px={3}>{header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <Td key={cellIndex} py={2} px={3}>{cell}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
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
                  bg={message.role === 'user' ? 'blue.100' : 'gray.100'}
                  p={3}
                  borderRadius="lg"
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxW="80%"
                >
                  {message.content.startsWith('<table>') ? (
                    <Box
                      dangerouslySetInnerHTML={{ __html: message.content }}
                      sx={{
                        'table': {
                          borderCollapse: 'separate',
                          borderSpacing: 0,
                          width: '100%',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        },
                        'th, td': {
                          border: '1px solid #e2e8f0',
                          padding: '8px 12px',
                          textAlign: 'left',
                        },
                        'th': {
                          backgroundColor: '#f7fafc',
                          fontWeight: 'bold',
                        },
                        'tr:last-child td:first-child': { borderBottomLeftRadius: '8px' },
                        'tr:last-child td:last-child': { borderBottomRightRadius: '8px' },
                        '@media (max-width: 480px)': {
                          'table, thead, tbody, th, td, tr': {
                            display: 'block',
                          },
                          'thead tr': {
                            position: 'absolute',
                            top: '-9999px',
                            left: '-9999px',
                          },
                          'tr': { marginBottom: '10px' },
                          'td': {
                            border: 'none',
                            position: 'relative',
                            paddingLeft: '50%',
                          },
                          'td:before': {
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '45%',
                            paddingRight: '10px',
                            whiteSpace: 'nowrap',
                            content: 'attr(data-label)',
                            fontWeight: 'bold',
                          },
                        },
                      }}
                    />
                  ) : (
                    <Text>{message.content}</Text>
                  )}
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
