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
