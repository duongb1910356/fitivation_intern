export const appConfig = {
	name: process.env.APP_NAME,
	version: process.env.APP_VERSION,
	mongoURI: process.env.MONGO_URI,
	jwtAccessSecret: process.env.JWT_SECRET_ACCESSTOKEN,
	jwtAccessExpiresIn: '15m',
	jwtRefreshSecret: process.env.JWT_SECRET_REFRESHTOKEN,
	jwtRefreshExpiresIn: '7d',
	fileHost: process.env.FILE_HOST,
	fileRoot: process.env.FILE_ROOT,
};
