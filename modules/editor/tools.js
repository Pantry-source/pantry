// Editor.js plugins don't support typescript so we define types here

import List from "@editorjs/list";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import Ingredient from './Ingredient';

export const INGREDIENTS_EDITOR_TOOLS = {
  ingredient: {
    class: Ingredient,
    config: {
      defaultStyle: 'unordered'
    }
  }
};

export const DEFAULT_EDITOR_TOOLS = {
  list: List,
  header: Header,
  paragraph: Paragraph
};
