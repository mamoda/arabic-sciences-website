import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setMsg("تم تسجيل الدخول!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <h2 className="text-2xl mb-4 font-bold">تسجيل الدخول</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-primary text-white p-2 rounded" type="submit">دخول</button>
      </form>
      <div className="mt-4 text-red-500">{msg}</div>
    </div>
  );
}