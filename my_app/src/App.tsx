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
import { useState, useRef } from "react";
import ReactToPrint from "react-to-print";

export const App = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [active, isActive] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  function generate_image() {
    if (!active || !prompt) return;
    isActive(false);
    fetch("https://kind-tan-tadpole-suit.cyclic.app/generate/", {
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
              <>
                <Button onClick={generate_image} isActive={active}>
                  Generate
                </Button>
                <Button
                  isActive={active}
                  onClick={() => {
                    if (image === "") {
                      return;
                    }
                    const iframe = iframeRef.current;
                    if (!iframe) return;

                    iframe?.contentWindow?.document.open();
                    iframe?.contentWindow?.document.write(
                      `<html><head><title>Print Image</title></head><body><img src="${image}" style="width:100%;" /></body></html>`
                    );
                    iframe?.contentWindow?.document.close();
                    iframe?.contentWindow?.print();
                    iframe?.contentWindow?.document.open();
                    iframe?.contentWindow?.document.write("");
                    iframe?.contentWindow?.document.close();
                  }}
                >
                  Print
                </Button>
              </>
            ) : (
              <Spinner />
            )}

            <Image src={image} alt="" />
            <Box textAlign="center" fontSize="sm">
              <iframe ref={iframeRef}></iframe>
            </Box>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
