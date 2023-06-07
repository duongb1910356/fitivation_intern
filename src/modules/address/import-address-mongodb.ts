import mongoose from 'mongoose';
import { appConfig } from '../../app.config';

mongoose.connect(appConfig.mongoURI);
