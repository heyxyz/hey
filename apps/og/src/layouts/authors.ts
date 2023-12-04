export const authors = [
  {
    image: 'https://og.railway.app/authors/faraz-patankar.jpeg',
    name: 'Faraz Patankar'
  },
  {
    image: 'https://og.railway.app/authors/jake-cooper.jpeg',
    name: 'Jake Cooper'
  },
  {
    image: 'https://og.railway.app/authors/greg-schier.jpeg',
    name: 'Greg Schier'
  },
  {
    image: 'https://og.railway.app/authors/jake-runzer.jpeg',
    name: 'Jake Runzer'
  },
  {
    image: 'https://og.railway.app/authors/angelo-saraceno.jpeg',
    name: 'Angelo Saraceno'
  },
  {
    image: 'https://og.railway.app/authors/wyzlle.png',
    name: 'wyzlle'
  },
  {
    image: 'https://og.railway.app/authors/david-banys.png',
    name: 'David Banys'
  }
];

const defaultAuthor = authors[0];

export const getAuthor = (name: string) => {
  const author = authors.find((author) => author.name === name);

  return author ?? defaultAuthor;
};
