import { RequestMessage } from "../../types/message";
import { TextDocumentIdentifier, documents } from "../../documents";
import * as fs from "fs";
import { log } from "../../log";

const words = fs.readFileSync("/usr/share/dict/words").toString().split("\n");

type CompletionItem = {
  label: string;
};

interface CompletionList {
  /**
   * This list is not complete. Further typing should result in recomputing
   * this list.
   *
   * Recomputed lists have all their items replaced (not appended) in the
   * incomplete completion sessions.
   */
  isIncomplete: boolean;

  /**
   * In many cases the items of an actual completion result share the same
   * value for properties like `commitCharacters` or the range of a text
   * edit. A completion list can therefore define item defaults which will
   * be used if a completion item itself doesn't specify the value.
   *
   * If a completion list specifies a default value and a completion item
   * also specifies a corresponding value the one from the item is used.
   *
   * Servers are only allowed to return default values if the client
   * signals support for this via the `completionList.itemDefaults`
   * capability.
   *
   * @since 3.17.0
   */
  itemDefaults?: object;

  /**
   * The completion items.
   */
  items: CompletionItem[];
}

interface Position {
  /**
   * Line position in a document (zero-based).
   */
  line: number;

  /**
   * Character offset on a line in a document (zero-based). The meaning of this
   * offset is determined by the negotiated `PositionEncodingKind`.
   *
   * If the character value is greater than the line length it defaults back
   * to the line length.
   */
  character: number;
}

interface TextDocumentPositionParams {
  /**
   * The text document.
   */
  textDocument: TextDocumentIdentifier;

  /**
   * The position inside the text document.
   */
  position: Position;
}

interface CompletionParams extends TextDocumentPositionParams {
  /**
   * The completion context. This is only available if the client specifies
   * to send this using the client capability
   * `completion.contextSupport === true`
   */
  context?: object;
}

export const completion = (message: RequestMessage): CompletionList | null => {
  const params = message.params as CompletionParams;
  const documentUri = params.textDocument.uri;
  const content = documents.get(documentUri);
  if (!content) return null;

  const currentLine = content.split("\n")[params.position.line];
  const lineUntilCursor = currentLine.slice(0, params.position.character);
  const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");

  const items = words
    .filter((word) => {
      return word.startsWith(currentPrefix);
    })
	.slice(0, 1000)
    .map((word) => {
      return { label: word };
    });

  return {
    isIncomplete: true,
    items,
  } satisfies CompletionList;
};
