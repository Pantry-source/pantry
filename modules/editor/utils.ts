import { OutputData } from "@editorjs/editorjs";
import { Json } from '../../types/generated/supabase';

export function formatOrderedListData(data: String[]) {
    return {
        blocks: [{
            type : "list",
            data : {
                style : "ordered",
                items : data
            }
        },]
    };
}

export function formatIngredientData(data: String[]) {
  return {
      blocks: [{
          type : "list",
          data : {
              style : "unordered",
              items : data
          }
      },]
  };
}

export function parseListData(editorData: OutputData): string[] {
  const list: string[] = [];
  editorData.blocks.forEach((block) => {
    if (block.type === 'list') {
      list.push(...block.data.items);
    }
  });
  return list;
}

export function parseBlocksData(editorData: OutputData): { blocks: OutputData["blocks"] } {
  return { blocks: editorData.blocks };
}

// Supabase saves JSON data as a generic Json type which is too loose of a type to be compatible
// with the editor.js OutputData interface. 
// This function converts Json to OutputData which is useful for when editor data comes from Supabase. 
// This implemetation will need to change if OutputData interface changes
export function convertSupabaseJsonToEditorData(data: Json): OutputData {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return {
      ...data,
      blocks: Array.isArray(data.blocks) ? data.blocks.map(block => {
        if (block && typeof block === 'object' && !Array.isArray(block)) {
          return {
            id: `${block.id}`,
            type: `${block.type}`,
            data: block.data
          };
        } else {
          return {
            type: '',
            id: '',
            data: {}
          };
        }
      }) : []
    }
  }
  return {
    blocks: []
  }
};
