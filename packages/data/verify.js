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
            name
            handle
          }
        }
        pageInfo {
          prev
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query, variables: { cursor: cursor } })
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
        const { name } = entry.profile;
        return `'${id}', // ${name}`;
      });

      // Load the verified.ts file
      fs.readFile('./verified.ts', 'utf8', (err, tsData) => {
        if (err) {
          console.error('Error reading the verified.ts file:', err);
          return;
        }

        const regex =
          /export const mainnetVerified = \[[\S\s]*?mainnetLensTeamMembers,[\S\s]*?...mainnetStaffs\n];/;
        const match = tsData.match(regex);

        if (match) {
          // Extract existing profiles from verified.ts
          const existingProfiles = new Set(
            match[0]
              .split('\n')
              .map((line) => line.trim())
              .slice(1, -3)
          );

          const regex = /'0x([\dA-Fa-f]+)'/g;

          // Existing IDs
          const existingIDs = Array.from(existingProfiles)
            .join('\n')
            .match(regex)
            .map((idString) => idString.slice(1, -1));

          // Getting unique IDs by comparing existing IDs with new IDs
          const profileIDs = profiles.map((entry) =>
            entry.split("',")[0].trim().slice(1)
          );

          const profileIDsSet = new Set(profileIDs);
          const existingIDsSet = new Set(existingIDs);

          const uniqueIDs = new Set(
            [...profileIDsSet].filter((id) => !existingIDsSet.has(id))
          );
          const uniqueIDsArray = Array.from(uniqueIDs);

          const updatedContent = tsData.replace(match[0], (match) => {
            const mainnetVerifiedArray = match.split('\n');
            mainnetVerifiedArray.splice(
              -3,
              0,
              ...uniqueIDsArray.map((line) => `  '${line}',`)
            );
            return mainnetVerifiedArray.join('\n');
          });

          // updating verified.ts file
          fs.writeFile('./verified.ts', updatedContent, (err) => {
            if (err) {
              console.error('Error writing to the verified.ts file:', err);
              return;
            }
            console.log('verified.ts updated successfully!');
          });
        } else {
          console.error(
            'mainnetVerified array not found in the verified.ts file.'
          );
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log('Error occurred while making the GraphQL requests.');
  }
}

main();
