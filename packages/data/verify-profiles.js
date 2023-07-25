async function main() {
  const query = `
    query ($cursor: Cursor) {
      following(request: {
        address: "0x617Fd60a77297d3533D4abe9dC353626bdA5E171"
        limit: 50
        cursor: $cursor
      }) {
        items {
          profile {
            id
            handle
          }
        }
        pageInfo {
          next
        }
      }
    }
  `;

  const url = 'https://api.lens.dev';
  const allResponses = [];

  let cursor = null;
  while (true) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, variables: { cursor } })
    });

    if (!response.ok) {
      console.log(`Error: ${response.status} - ${await response.text()}`);
      break;
    }

    const responseData = await response.json();
    const items = responseData.data?.following?.items || [];
    if (!items.length) {
      break;
    }

    for (const item of items) {
      const { id, handle } = item.profile;
      console.log(`Verified - ${id} - ${handle} ✅`);
    }

    allResponses.push(...items);
    const pageInfo = responseData.data?.following?.pageInfo || {};
    cursor = pageInfo.next;

    if (!cursor) {
      break;
    }
  }

  if (allResponses.length) {
    const fs = require('fs');
    try {
      const jsonData = JSON.stringify(allResponses, null, 2);
      const parsedJson = JSON.parse(jsonData);

      // Extract the id and name properties from parsedJson
      const profiles = parsedJson.map((entry) => {
        const { id } = entry.profile;
        return `'${id}',`;
      });

      const profileIDs = profiles.map((entry) => {
        return entry.split("',")[0].trim().slice(1);
      });

      // Load the verified.ts file
      const formattedProfileIds =
        'export const verified = [\n  ' +
        profileIDs.map((id) => `'${id}'`).join(',\n  ') +
        '\n];\n';

      // Write the string to a file
      fs.writeFile('verified.ts', formattedProfileIds, (err) => {
        if (err) {
          console.error('Something went wrong:', err);
          return;
        }
        console.log('File has been updated.');
      });
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log('Error occurred while making the GraphQL requests.');
  }
}

main();
