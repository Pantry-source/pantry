import React, { memo, useEffect, useRef } from "react";
import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import { DEFAULT_EDITOR_TOOLS } from "../modules/editor/tools";

type Props = {
  initialData?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  readOnly?: boolean,
  tools?: string[],
  defaultBlock?: EditorConfig["defaultBlock"]
};

function getTools(tools?: string[]): {
  list?: any;
  header?: any;
  paragraph?: any;
} {
  if (tools && tools.length) {
    let toolConfig: {
      list?: any;
      header?: any;
      paragraph?: any;
    } = {};
    for (const tool of tools) {
      if (tool === 'list' || tool === 'header' || tool === 'paragraph') {
        toolConfig[tool] = DEFAULT_EDITOR_TOOLS[tool];
      }
    }
    return toolConfig;
  }
  return DEFAULT_EDITOR_TOOLS;
}

const EditorBlock = ({ initialData, onChange, holder, readOnly = false, tools, defaultBlock }: Props) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        defaultBlock,
        holder,
        tools: getTools(tools),
        inlineToolbar: true,
        readOnly,
        data: initialData,
        minHeight: 40, // sets bottom padding to 0
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        }
      });
      ref.current = editor;
    }

    // handles destroying editor
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);


  return <div className="max-w-full relative border border-dashed border-gray-900/25 px-4 py-3 rounded-lg">
    <div className="prose max-w-full" id={holder}></div>
  </div>;
};

export default memo(EditorBlock);
