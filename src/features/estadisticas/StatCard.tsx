interface StatCardProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  prefijo?: string;
  sufijo?: string;
}

export default function StatCard({ titulo, valor, descripcion, prefijo = "", sufijo = "" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 flex flex-col gap-1">
      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{titulo}</span>
      <span className="text-3xl font-bold text-stone-900 mt-1">
        {prefijo}{valor}{sufijo}
      </span>
      {descripcion && (
        <span className="text-xs text-stone-400 mt-1">{descripcion}</span>
      )}
    </div>
  );
}
