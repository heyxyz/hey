import { uploadFileToIPFS } from './uploadToIPFS';

/**
 * Generates a URL for an SVG image that represents an NFT with the specified content, username, and timestamp.
 *
 * @param content The string to be displayed in the NFT.
 * @param username The username of the user.
 * @param timestamp The timestamp of the NFT.
 * @returns The SVG image as a string.
 */
const getTextNftUrl = async (
  content: string,
  username: string,
  timestamp: string
) => {
  const svg = `<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .content {
        font: normal 14px sans-serif;
        color: black;
      }
      .timestamp {
        font: normal 13px sans-serif;
        color: black;
        opacity: 70%;
      }
      .username {
        font: bold 15px sans-serif;
      }
    </style>
    <g clip-path="url(#clip0_1_2)">
    <path d="M475 0H25C11.1929 0 0 11.1929 0 25V475C0 488.807 11.1929 500 25 500H475C488.807 500 500 488.807 500 475V25C500 11.1929 488.807 0 475 0Z" fill="white"/>

    <foreignObject x="30" y="90" width="440" height="300">
    <p class="content" xmlns="http://www.w3.org/1999/xhtml">${content}</p>
    </foreignObject>

    <path d="M0 25C0 11.1929 11.1929 0 25 0H475C488.807 0 500 11.1929 500 25V78H0V25Z" fill="#FB3A4D" fill-opacity="0.16"/>
    <path d="M500.06 474.236C500.026 488.043 488.806 499.208 474.999 499.174L24.9999 498.062C11.193 498.027 0.0276556 486.807 0.0617778 473L0.192759 420L500.191 421.236L500.06 474.236Z" fill="#FB3A4D" fill-opacity="0.16"/>

    <foreignObject x="350" y="440" width="440" height="300">
    <p class="timestamp" xmlns="http://www.w3.org/1999/xhtml">${timestamp}</p>
    </foreignObject>


    <foreignObject x="30" y="15" width="440" height="300">
    <p class="username" xmlns="http://www.w3.org/1999/xhtml">@${username}</p>
    </foreignObject>

    </g>
    <defs>
    <clipPath id="clip0_1_2">
    <rect width="500" height="500" fill="white"/>
    </clipPath>
    </defs>
</svg>
`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = new File([blob], 'post.svg', {
    lastModified: new Date().getTime(),
    type: blob.type
  });
  const result = await uploadFileToIPFS(file);

  return result.uri;
};

export default getTextNftUrl;
