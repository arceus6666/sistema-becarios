export interface IBecario {
  _id?: string;
  name: string;
  cumplidas: number;
  asignadas: number;
  curso?: number;
  faltantes?: number;
  totales?: number;
  // totales?: number;
  semester: string;
  tareas: string[];
}
