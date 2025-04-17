import { Client, Databases } from 'appwrite';
import { conf } from '../conf/conf';

const client = new Client();

client
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject(conf.appwriteProjectId);

export const databases = new Databases(client)

export default client;