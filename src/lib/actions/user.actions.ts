"use server";

import { prisma } from "../db/prisma";

const getAllUser = async () => {
  try {
    const allUsers = await prisma.user.findMany({});

    return JSON.stringify(allUsers);
  } catch (error) {
    return "";
  }
};

export { getAllUser };
