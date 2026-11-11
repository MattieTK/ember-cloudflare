// Lexxy ships no types. These are the parts of @37signals/lexxy 0.9.24 that rich-text-editor.tsx uses.
declare module "@37signals/lexxy" {
  /** Settings for every editor (`global`) and for each preset of them (`default`). */
  export function configure(settings: { global?: Record<string, unknown>; default?: Record<string, unknown> }): void;

  /** The parts of Lexical's ElementNode that Campfire's node uses. */
  class ElementNode {
    constructor(key?: string);
    readonly __key: string;
    exportJSON(): Record<string, unknown>;
    updateFromJSON(serialized: Record<string, unknown>): this;
  }

  /** The parts of Lexical's LexicalNode that the editor uses. */
  interface LexicalNode {
    getType(): string;
    getParent(): LexicalNode | null;
  }

  /** The parts of Lexical's TextNode that :codes use: the text, and replacing some of it. */
  interface TextNode extends LexicalNode {
    getTextContent(): string;
    hasFormat(format: "code"): boolean;
    spliceText(offset: number, deleteCount: number, text: string, moveSelection?: boolean): TextNode;
  }

  /**
   * The parts of Lexical's RangeSelection that the editor uses: the format of what's typed at it, and
   * where the cursor is.
   */
  interface RangeSelection {
    setFormat(format: number): void;
    setStyle(style: string): void;
    isCollapsed(): boolean;
    readonly anchor: { readonly offset: number; getNode(): LexicalNode };
  }

  /** The Lexical Lexxy is built on, whose nodes an extension's must extend. */
  export const Lexical: {
    ElementNode: typeof ElementNode;
    $getSelection(): unknown;
    $isRangeSelection(selection: unknown): selection is RangeSelection;
    $isTextNode(node: unknown): node is TextNode;
  };

  /** What an editor allows and holds beyond Lexxy's own. */
  export class Extension {
    constructor(editorElement: HTMLElement);
    get allowedElements(): Array<string | { tag: string; attributes: string[] }>;
    get lexicalExtension(): unknown;
    defineExtension(extension: { name: string; nodes: unknown[] }): unknown;
  }
}
