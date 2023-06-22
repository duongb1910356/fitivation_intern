export const appConfig = {
	name: process.env.APP_NAME,
	version: process.env.APP_VERSION,
	mongoURI: process.env.MONGO_URI,
	fileHost: process.env.FILE_HOST,
	fileRoot: process.env.FILE_ROOT,
	jwtAccessSecret: process.env.JWT_AT_SECRET,
	jwtAccessExpiresIn: process.env.JWT_AT_EXPIRES_IN,
	jwtRefreshSecret: process.env.JWT_RT_SECRET,
	jwtRefreshExpiresIn: process.env.JWT_RT_EXPIRES_IN,
	fileHost: process.env.FILE_HOST,
	fileRoot: process.env.FILE_ROOT,
};
