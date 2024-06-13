export const authConfig = () => ({
  access: process.env.ACCESS_SECRET,
  refresh: process.env.REFRESH_SECRET,
});
