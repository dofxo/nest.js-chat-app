import { compareSync } from "bcrypt";

export const passwordMatchToHashedVersion = (
  inputPassword: string,
  storedHashedPassword: string,
) => {
  try {
    return compareSync(inputPassword, storedHashedPassword);
  } catch (error) {
    console.error("Error during password comparison:", error);
    return false;
  }
};
