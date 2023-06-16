import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRound = 5;
  try {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
