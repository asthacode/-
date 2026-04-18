import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfigData);

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId);
export const storage = getStorage(app);

// Critical: Validate connection on boot as per instructions
async function testConnection() {
  try {
    // Testing connection to a mock doc
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    }
  }
}

testConnection();
