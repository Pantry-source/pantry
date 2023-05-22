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
          type : "ingredient",
          data : {
              style : "unordered",
              items : data
          }
      },]
  };
}
