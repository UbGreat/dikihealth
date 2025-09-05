// Manages Authentication State (Pin, Biometrics)

import { User } from "firebase/auth";
import React, { useState } from "react";




function AuthContext() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  return (
    <div>AuthContext</div>
  )
}

export default AuthContext