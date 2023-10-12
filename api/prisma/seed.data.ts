import { Prisma } from '@prisma/client';

const USER_DATA: Prisma.UserCreateManyInput[] = [
  {
    id: 1,
    login: 'admin',
    passwd_hash: '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
    name: 'Admin',
    surname: 'Adminov',
    is_admin: true,
  },
  {
    id: 2,
    login: 'roman',
    passwd_hash: '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
    name: 'Roman',
    surname: 'Romanov',
    is_admin: false,
  },
  {
    id: 3,
    login: 'vasya',
    passwd_hash: '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
    name: 'Vasily',
    surname: 'Vasilev',
    is_admin: false,
  },
  {
    id: 4,
    login: 'william_doe',
    passwd_hash: '$2b$10$7d4WKblBU2ZoDUSSR.GEdevf4VSYpRXy0wkzXPeWtFjCUk8amYbpG',
    name: 'William',
    surname: 'Doe',
    is_admin: false,
  },
];

const AUTHOR_DATA: Prisma.AuthorCreateManyInput[] = [
  { id: 1, user_id: 2, description: 'Author description' },
  { id: 2, user_id: 4, description: 'John description' },
];

const CATEGORY_DATA: Prisma.CategoryCreateManyInput[] = [
  { id: 1, name: 'Category 1', parent_id: null },
  { id: 2, name: 'Category 2', parent_id: 1 },
  { id: 3, name: 'Category 2.1', parent_id: 2 },
  { id: 4, name: 'Category 2.2', parent_id: 2 },
  { id: 5, name: 'Category 2.3', parent_id: 2 },
  { id: 6, name: 'Category 3', parent_id: null },
];

const TAG_DATA: Prisma.TagCreateManyInput[] = [
  { name: 'Tag 1' },
  { name: 'Tag 2' },
  { name: 'Tag 3' },
  { name: 'Tag 4' },
  { name: 'Tag 5' },
  { name: 'Tag 6' },
  { name: 'Tag 7' },
];

const POST_DATA: Prisma.PostCreateManyInput[] = [
  {
    title: 'Post about ducks',
    body: 'Ducks are awesome',
    poster: 'duck.webp',
    images: ['a.webp', 'b.webp'],
    tags: [1, 2],
    category_id: 1,
    author_id: 1,
    is_published: true,
    created_at: '2020-05-12T00:00:00Z',
  },
  {
    title: 'How to make a website',
    body: 'Go to MetaLamp',
    poster: 'metalamp.webp',
    images: ['c.webp'],
    tags: [1, 3],
    category_id: 2,
    author_id: 2,
    is_published: true,
    created_at: '2021-04-05T00:00:00Z',
  },
  {
    title: 'On memes',
    body: 'Memes are a waste of time',
    poster: 'meme.webp',
    images: ['d.webp', 'e.webp', 'f.webp'],
    tags: [3],
    category_id: 4,
    author_id: 1,
    is_published: true,
    created_at: '2021-04-05T00:00:00Z',
  },
  {
    title: 'About rabbits',
    body: 'Rabbits are awesome',
    poster: 'rabbit.webp',
    images: ['g.webp', 'h.webp'],
    tags: [1, 3, 4],
    category_id: 3,
    author_id: 1,
    is_published: true,
    created_at: '2021-07-08T00:00:00Z',
  },
  {
    title: 'How to bake a cake',
    body: 'Ask your mom',
    poster: 'mom.webp',
    images: [],
    tags: [1, 4],
    category_id: 2,
    author_id: 2,
    is_published: true,
    created_at: '2022-01-01T00:00:00Z',
  },
  {
    title: 'Lingua latina',
    body: 'Lingua latina non lorem ipsum est',
    poster: 'latin.webp',
    images: ['i.webp'],
    tags: [3, 4],
    category_id: 1,
    author_id: 2,
    is_published: false,
    created_at: '2022-12-25T00:00:00Z',
  },
];

const DRAFT_DATA: Prisma.DraftCreateManyInput[] = [
  {
    author_id: 1,
    post_id: 1,
    title: 'Post about ducks, edited',
    body: 'Ducks are cool',
    poster: 'duck.webp',
    images: ['a.webp', 'b.webp'],
    tags: [1, 2],
    category_id: 1,
  },
  {
    author_id: 1,
    post_id: 3,
    title: 'About memes',
    body: 'Memes are a waste of time',
    poster: 'meme1.webp',
    images: ['d.webp', 'e.webp'],
    tags: [3],
    category_id: 3,
  },
];

const COMMENT_DATA: Prisma.CommentCreateManyInput[] = [
  { body: 'Comment 1', user_id: 3, post_id: 1 },
  { body: 'Comment 2', user_id: 3, post_id: 1 },
  { body: 'Comment 3', user_id: 3, post_id: 2 },
  { body: 'Comment 4', user_id: 3, post_id: 2 },
  { body: 'Comment 5', user_id: 3, post_id: 2 },
  { body: 'Comment 6', user_id: 3, post_id: 3 },
  { body: 'Comment 7', user_id: 3, post_id: 4 },
  { body: 'Comment 8', user_id: 3, post_id: 4 },
  { body: 'Comment 9', user_id: 3, post_id: 5 },
  { body: 'Comment 10', user_id: 3, post_id: 5 },
];

export { USER_DATA, AUTHOR_DATA, CATEGORY_DATA, TAG_DATA, POST_DATA, DRAFT_DATA, COMMENT_DATA };
