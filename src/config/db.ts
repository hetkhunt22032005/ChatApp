import { log } from 'console';
import { connect } from 'mongoose';

const connectDB = async (url: string) => {
    try {
        await connect(url);
        log('Database connected successfully.');
    } catch (error: any) {
        console.error('Error in connecting to database: ', error.message);
        process.exit(1);
    }
}

export default connectDB;
