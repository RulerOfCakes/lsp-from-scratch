
export type DocumentUri = string;
export type DocumentBody = string;

export interface TextDocumentIdentifier {
  /**
   * The text document's URI.
   */
  uri: DocumentUri;
}

export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
  /**
   * The version number of this document.
   *
   * The version number of a document will increase after each change,
   * including undo/redo. The number doesn't need to be consecutive.
   */
  version: number;
}


export const documents = new Map<DocumentUri, DocumentBody>()