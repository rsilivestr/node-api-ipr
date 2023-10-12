import { PrismaClient } from '@prisma/client';
import {
  AUTHOR_DATA,
  CATEGORY_DATA,
  COMMENT_DATA,
  DRAFT_DATA,
  POST_DATA,
  TAG_DATA,
  USER_DATA,
} from './seed.data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  for await (const data of USER_DATA) {
    const { id } = await prisma.user.create({ data });
    console.log(`Created user with id: ${id}`);
  }
  for await (const data of AUTHOR_DATA) {
    const { id } = await prisma.author.create({ data });
    console.log(`Created author with id: ${id}`);
  }
  for await (const data of CATEGORY_DATA) {
    const { id } = await prisma.category.create({ data });
    console.log(`Created category with id: ${id}`);
  }
  for await (const data of TAG_DATA) {
    const { id } = await prisma.tag.create({ data });
    console.log(`Created tag with id: ${id}`);
  }
  for await (const data of POST_DATA) {
    const { id } = await prisma.post.create({ data });
    console.log(`Created tag with id: ${id}`);
  }
  for await (const data of DRAFT_DATA) {
    const { id } = await prisma.draft.create({ data });
    console.log(`Created draft with id: ${id}`);
  }
  for await (const data of COMMENT_DATA) {
    const { id } = await prisma.comment.create({ data });
    console.log(`Created comment with id: ${id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
