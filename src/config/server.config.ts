export const serverConfig = () => ({
  port: parseInt(process.env.PORT) ?? 3001,
});
