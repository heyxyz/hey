export const notionTitle = (content: string) => {
  return { title: [{ text: { content }, type: 'text' }], type: 'title' };
};

export const notionText = (content: string) => {
  return {
    rich_text: [{ text: { content }, type: 'text' }],
    type: 'rich_text'
  };
};
