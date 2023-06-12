import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { initializeApp } from "firebase/app";
import path from "path";

export const getPathStorageFromUrl = (url) => {
  const baseUrl = process.env.BASE_URL;
  let imagePath = url.replace(baseUrl, "");
  const indexOfEndPath = imagePath.indexOf("?");
  imagePath = imagePath.substring(0, indexOfEndPath);
  imagePath = imagePath.replace("%2F", "/");

  return imagePath;
};

const firebaseConfig = {
  apiKey: "AIzaSyBoRLoK1O0p6p5CaVu3GWtIx9c8u36uWnE",
  authDomain: "health-check-3ac95.firebaseapp.com",
  projectId: "health-check-3ac95",
  storageBucket: "health-check-3ac95.appspot.com",
  messagingSenderId: "60013808329",
  appId: "1:60013808329:web:c4f6c09549e07a46a79b18",
  measurementId: "G-HQT5S10RVB",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

const storage = getStorage();

export const uploadFile = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newFileName = Date.now() + path.extname(file.originalname);
      const storageRef = ref(storage, `files/${newFileName}`);
      uploadBytes(storageRef, file.buffer).then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        resolve(url);
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

export const deleteFile = async (oldUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const oldNameFile = getPathStorageFromUrl(oldUrl);
      const desertRef = ref(storage, oldNameFile);
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log("error", error);
          reject();
          // Uh-oh, an error occurred!
        });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

export const uploadImage = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newFileName = Date.now() + path.extname(file.originalname);
      const storageRef = ref(storage, `images/${newFileName}`);
      uploadBytes(storageRef, file.buffer).then(async (snapshot) => {
        const url = await getDownloadURL(snapshot.ref);
        resolve(url);
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};
