export const notionTitle = (content: string) => {
  return { title: [{ text: { content }, type: 'text' }], type: 'title' };
};

export const notionText = (content: string) => {
  return {
    rich_text: [{ text: { content }, type: 'text' }],
    type: 'rich_text'
  };
};

export const notionNumber = (content: number) => {
  return { number: content, type: 'number' };
};

export const notionLink = (content: string) => {
  return { type: 'url', url: content };
};
