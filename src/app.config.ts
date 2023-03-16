export const appConfig = {
  name: process.env.APP_NAME,
  version: process.env.APP_VERSION,
  mongoURI: process.env.MONGO_URI,
  jwtExpiresIn: '60s',
  jwtSecret: process.env.JWT_SECRET,
  fileHost: process.env.FILE_HOST,
  fileRoot: process.env.FILE_ROOT,
};
