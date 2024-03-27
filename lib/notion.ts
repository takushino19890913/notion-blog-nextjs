import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const getDatabaseForMonth = async(databaseId, year_month) => {
  console.log(`${year_month.slice(0,4)}-${year_month.slice(4)}-01`);
  const on_or_after:string = year_month.slice(4) == "12" ? `${parseInt(year_month.slice(0,4)) + 1}-${year_month.slice(4)}-01` : `${year_month.slice(0,4)}-${'0' + (parseInt(year_month.slice(4))+1).toString().slice(-2)}-01`
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
          timestamp : "last_edited_time",
          direction: "descending"
      }
    ],
    filter: {
      "and": [
          {
            timestamp:"last_edited_time",
            "last_edited_time":{
              "on_or_after": `${year_month.slice(0,4)}-${year_month.slice(4)}-01`,
            }
          },
          {
            "property":"Published",
      "checkbox" : {
        "equals": true
          }
        }
      ]
    },
    
  }) 
  console.log(response);
  return response.results;
}

export const getDatabaseWithTimeStamp = async (databaseId, tag?) => {
  const response = tag ? 
  await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
          timestamp : "last_edited_time",
          direction: "descending"
      }
    ],
    filter: {
      "and": [
          {
            "property":"Tag",
      "multi_select" : {
        "contains": tag
      }
          },
          {
            "property":"Published",
      "checkbox" : {
        "equals": true
          }
        }
      ]
    },
    
  }) : await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
          timestamp : "last_edited_time",
          direction: "descending"
      }
    ],
    filter:   {
      "property":"Published",
"checkbox" : {
  "equals": true
    }
    }
  });
  return response.results;
};


export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
  blockId = blockId.replaceAll("-", "");

  const { results } = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  // Fetches all child blocks recursively - be mindful of rate limits if you have large amounts of nested blocks
  // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = results.map(async (block) => {
    if (block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  });

  return await Promise.all(childBlocks).then((blocks) => {
    return blocks.reduce((acc, curr) => {
      if (curr.type === "bulleted_list_item") {
        if (acc[acc.length - 1]?.type === "bulleted_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "bulleted_list",
            bulleted_list: { children: [curr] },
          });
        }
      } else if (curr.type === "numbered_list_item") {
        if (acc[acc.length - 1]?.type === "numbered_list") {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "numbered_list",
            numbered_list: { children: [curr] },
          });
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  });
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}