import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "../modules/editor/tools";

type Props = {
  initialData?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  readOnly?: boolean
};

const EditorBlock = ({ initialData, onChange, holder, readOnly = false }: Props) => {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        readOnly,
        data: initialData,
        minHeight: 0, // sets bottom padding to 0
        async onChange(api, event) {
          const data = await api.saver.save();
          console.log('data change', data);
          onChange(data);
        },
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


  return <div className="max-w-full" id={holder} />;
};

export default memo(EditorBlock);
