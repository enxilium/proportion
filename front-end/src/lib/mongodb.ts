import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://anandtandon8:IvpQhmNDdMUK7bRc@cluster0.g6am1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Variable to track connection status
let isConnected = false;

// Function to connect to the database
export async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await client.connect();
        await client.db("primary").command({ ping: 1 });
        console.log("Successfully connected to MongoDB.");
        isConnected = true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Connect to database when the file is imported
connectToDatabase().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

export default client;
