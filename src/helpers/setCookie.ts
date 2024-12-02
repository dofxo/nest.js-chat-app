export const setCookie = async (res, jwtService, payload) => {
  const token = await jwtService.signAsync(payload);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 2630016000, // 1 month,
  });

  return token;
};
