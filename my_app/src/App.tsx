import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Image,
  Grid,
  theme,
  Input,
  Button,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";

export const App = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [active, isActive] = useState(true);
  function generate_image() {
    if (!active || !prompt) return;
    isActive(false);
    fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImage(data.image_url);
        isActive(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        isActive(true);
      });
  }
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Heading mb={4}>Generate ColorBook 🧑‍🎨</Heading>
            <Input
              type="text"
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              value={prompt}
              placeholder="Enter a prompt"
              color="teal"
            />
            {active ? (
              <Button onClick={generate_image} isActive={active}>
                Generate
              </Button>
            ) : (
              <Spinner />
            )}
            <Image src={image} alt="" />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
