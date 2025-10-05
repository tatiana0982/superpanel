import {
  collection,
  doc,
  getDoc as getDocFirebase,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from "@/firebase/firebase-client";

// Make Condition & OrderByField generic over T
type Condition<T> = {
  field: keyof T;
  operator: WhereFilterOp;
  value: T[keyof T];
};

type OrderByField<T> = {
  field: keyof T;
  direction?: "asc" | "desc";
};

export const FirestoreService = {
  // 📄 Generate a unique ID
  docId: (): string => uuidv4(),

  // 📥 Get a single document by ID
  getDoc: async <T extends Record<string, any>>(
    collectionName: string,
    docId: string
  ): Promise<(T & { id: string }) | null> => {
    const ref = doc(db, collectionName, docId);
    const snapshot = await getDocFirebase(ref);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T & { id: string } : null;
  },

  // 📚 Get all documents in a collection
  getAllDocs: async <T extends Record<string, any>>(
    collectionName: string
  ): Promise<(T & { id: string })[]> => {
    const ref = collection(db, collectionName);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  },

  // 🆕 Add a document (auto ID)
  addDoc: async <T extends Record<string, any>>(
    collectionName: string,
    data: T
  ): Promise<string> => {
    const ref = collection(db, collectionName);
    const docRef = await addDoc(ref, data);
    return docRef.id;
  },

  // ✏️ Set (create/replace) a document by ID
  setDoc: async <T extends Record<string, any>>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void> => {
    const ref = doc(db, collectionName, docId);
    return await setDoc(ref, data);
  },

  // 🔁 Update a document by ID (merge = true)
  updateDoc: async <T extends Record<string, any>>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<void> => {
    const ref = doc(db, collectionName, docId);
    return await setDoc(ref, data, { merge: true });
  },

  // ❌ Delete a document by ID
  deleteDoc: async (
    collectionName: string,
    docId: string
  ): Promise<void> => {
    const ref = doc(db, collectionName, docId);
    return await deleteDoc(ref);
  },

  // 🔍 Get documents by conditions with optional ordering
  getByConditions: async <T extends Record<string, any>>(
    collectionName: string,
    conditions: Condition<T>[] = [],
    orderByFields: OrderByField<T>[] = []
  ): Promise<(T & { id: string })[]> => {
    const ref = collection(db, collectionName);

    const constraints: any[] = [];

    if (conditions.length > 0) {
      constraints.push(
        ...conditions.map((c) => where(c.field as string, c.operator, c.value))
      );
    }

    if (orderByFields.length > 0) {
      constraints.push(
        ...orderByFields.map((o) =>
          orderBy(o.field as string, o.direction || "asc")
        )
      );
    }

    const q = constraints.length > 0 ? query(ref, ...constraints) : ref;

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T & { id: string })
    );
  },

  // 📤 Upload a file and get its download URL
  uploadFile: async (
    fileContent: Blob | Uint8Array,
    docId: string,
    repoId: string,
    filePath: string
  ): Promise<string> => {

    const path = `repos/${docId}/${repoId}/${filePath}`;

    const storageRef = ref(storage, path);

    const metadata = {
      contentType: "text/plain",  // Always treat files as plain text
    };
    await uploadBytes(storageRef, fileContent, metadata);

    return `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(
      path
    )}?alt=media`;
  }
};