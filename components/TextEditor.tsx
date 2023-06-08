import React, { memo, useEffect, useRef } from "react";
import EditorJS, { EditorConfig, OutputData } from "@editorjs/editorjs";
import { DEFAULT_EDITOR_TOOLS } from "../modules/editor/tools";

type Props = {
  initialData?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  readOnly?: boolean,
  tools?: EditorConfig["tools"],
  defaultBlock?: EditorConfig["defaultBlock"]
};

const EditorBlock = ({ initialData, onChange, holder, readOnly = false, tools = DEFAULT_EDITOR_TOOLS, defaultBlock }: Props) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        defaultBlock,
        holder,
        tools,
        inlineToolbar: true,
        readOnly,
        data: initialData,
        minHeight: 100, // sets bottom padding to 0
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
