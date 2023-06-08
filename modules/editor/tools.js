// Editor.js plugins don't support typescript so we define tools in this js file

import List from "@editorjs/list";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

export const INGREDIENTS_EDITOR_TOOLS = {
  list: List
};

export const DEFAULT_EDITOR_TOOLS = {
  list: List,
  header: Header,
  paragraph: Paragraph
};
