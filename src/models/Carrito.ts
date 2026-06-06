export interface CarritoItem {
  producto_id: number;
  cantidad: number;
  ingredientes_removidos: number[];  
}

// incompleto, pero se puede expandir con más campos como precio, nombre del producto, etc. si es necesario para la UI

export function generarIdCarritoItem(item: CarritoItem): string {
  const ingredientesKey = item.ingredientes_removidos.sort().join(',');
  return `${item.producto_id}_${ingredientesKey}`;
}