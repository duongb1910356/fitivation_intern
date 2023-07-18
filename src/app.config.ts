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
	maxElementEmbedd: process.env.MAX_ELEMENT_EMBEDD,
	stripeSecretKey: process.env.STRIPE_SECRET_KEY,
	stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
};
