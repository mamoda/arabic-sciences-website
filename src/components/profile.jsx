import { useEffect, useState } from "react";
import axios from "axios";

export function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("https://arabic-sciences-website.onrender.com/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  if (!profile) return <div className="container py-10">يجب تسجيل الدخول</div>;

  return (
    <div className="container py-10">
      <h2 className="text-2xl mb-4 font-bold">الملف الشخصي</h2>
      <div>اسم المستخدم: {profile.username}</div>
    </div>
  );
}