import { useParams } from "react-router-dom";

export function ScientistDetail() {
  const { id } = useParams();

  return (
    <div className="container py-10">
      <h1>صفحة العالم رقم {id}</h1>
      {/* يمكنك هنا عرض تفاصيل العالم حسب الـ id */}
    </div>
  );
}