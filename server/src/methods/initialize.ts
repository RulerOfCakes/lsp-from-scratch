import { RequestMessage } from "../types/message";

type ServerCapabilities = Record<string, unknown>;
interface InitializeResult {
  /**
   * The capabilities the language server provides.
   */
  capabilities: ServerCapabilities;

  /**
   * Information about the server.
   *
   * @since 3.15.0
   */
  serverInfo?: {
    /**
     * The name of the server as defined by the server.
     */
    name: string;

    /**
     * The server's version as defined by the server.
     */
    version?: string;
  };
}

export const initialize = (message: RequestMessage): InitializeResult => {
  return {
    capabilities: { completionProvider: {}, textDocumentSync: 1 },
    serverInfo: {
      name: "lsp-from-scratch",
      version: "0.0.1",
    },
  } satisfies InitializeResult;
};
