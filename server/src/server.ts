import { log } from "./log";
import { initialize } from "./methods/initialize";
import { completion } from "./methods/textDocument/completion";
import { didChange } from "./methods/textDocument/didChange";
import { RequestMessage, ResponseMessage } from "./types/message";

type RequestMethod = (message: RequestMessage) => ResponseMessage["result"] | void;

const METHOD_LOOKUP: Record<string, RequestMethod> = {
  initialize,
  "textDocument/completion": completion,
  "textDocument/didChange": didChange,
};

const respond = (
  id: RequestMessage["id"],
  result: ResponseMessage["result"]
) => {
  const message = JSON.stringify({ id, result });
  const messageLength = Buffer.byteLength(message, "utf-8");
  const header = `Content-Length: ${messageLength}\r\n\r\n`;

  log.write(header + message);
  process.stdout.write(header + message);
};

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  while (true) {
    // Check for the Content-Length header
    const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/);
    if (!lengthMatch) 
      break;
    
    const contentLength = parseInt(lengthMatch[1], 10);
    const messageStart = buffer.indexOf("\r\n\r\n") + 4;

    // Continue unless full message is in the buffer
    if (buffer.length < messageStart + contentLength) 
      break;
    

    const rawMessage = buffer.slice(messageStart, messageStart + contentLength);
    const message = JSON.parse(rawMessage) as RequestMessage;

    log.write({ id: message.id, method: message.method, params: message });

    const method = METHOD_LOOKUP[message.method];

    if (method) {
      const result = method(message);

      if (result !== undefined) {
        respond(message.id, result);
      }
    }

    // Remove the processed message from the buffer
    buffer = buffer.slice(messageStart + contentLength);
  }
});

