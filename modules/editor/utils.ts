import { OutputData } from "@editorjs/editorjs";

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
