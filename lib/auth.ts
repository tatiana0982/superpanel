import { auth, googleProvider } from "@/firebase/firebase-client";
import { dump } from "@/helper/helper";
import { signInWithPopup, signOut } from "firebase/auth";

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    // Check if user exists in Firestore
    const token = await result.user.getIdToken();

    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

  };

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return signOut(auth);
  };


  export { googleLogin , logout }