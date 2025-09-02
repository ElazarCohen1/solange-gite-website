import { CheckCircle } from "lucide-react";

function EquipmentSection({ title, items, image }) {
 return (
  <div className="h-[300px] flex flex-col md:flex-row gap-6 group relative overflow-hidden rounded-xl shadow-md border bg-white">
  
    {/* Liste */}
    <div className="flex-1 p-6 transition-all duration-500 ease-in group-hover:md:w-1/4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500" /> {it}
          </li>
        ))}
      </ul>
    </div>

    {/* Image */}
    <div className="w-full md:w-1/3 transition-all duration-500 ease-in group-hover:md:w-3/4 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

}
export default EquipmentSection;