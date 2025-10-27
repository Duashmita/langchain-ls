import dotenv from "dotenv";
dotenv.config(); // Load GOOGLE_API_KEY from .env file

import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from 'readline';
import fs from 'fs';

async function madlibsStoryGenerator() {
  // Initialize Google GenAI client with API key from environment variables
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
    temperature: 0.7,
  });

  // Create system and human messages: Asking for ui for words for input, and general role instructions.
  const systemMsg = new SystemMessage("You are a comedian, playing the rle of a madlibs story generator assistant.");
  let humanMsg = new HumanMessage("Ask the user to provide a mix of catogrised words (noun, plural_noun, verb, adjective, adverb, name) upto 5 words and generate a 6 sentence story based on the words provided.");

  // Call the Google GenAI chat model with messages
  const response = await llm.invoke([systemMsg, humanMsg]);

  // Print the generated content
  console.log("Response:", response.content);

  // Setup readline for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Ask user for words input
  const userInput = await new Promise((resolve) => {
    rl.question("Please enter the words for the madlibs story, separated by commas:\n", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  // Write the response to a file
  humanMsg = new HumanMessage("Using the following words:" + userInput + " generate a 6 sentence story based on the words provided. And then return the story as a markdown file.");
  let response2 = await llm.invoke([systemMsg, humanMsg]);
  fs.writeFileSync("madlibs_output.md", response2.content);
  console.log("Story written to madlibs_output.md");
}

madlibsStoryGenerator();
 