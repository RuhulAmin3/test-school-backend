import bcrypt from "bcrypt";

export const hashedPassword = async (
  password: string,
  soltRound: number
): Promise<string> => {
  return await bcrypt.hash(password, soltRound);
};
