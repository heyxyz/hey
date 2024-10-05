import { TEST_PRO_LENS_ID } from "@hey/data/constants";
import prisma from "../client";

const seedProfileTheme = async (): Promise<number> => {
  // Delete all profileTheme
  await prisma.profileTheme.deleteMany();

  // Seed profileTheme
  await prisma.profileTheme.create({
    data: {
      id: TEST_PRO_LENS_ID,
      overviewFontStyle: "archivo",
      publicationFontStyle: "archivoNarrow"
    }
  });

  return 1;
};

export default seedProfileTheme;
