import { IBecario } from "./becario.interface";

export interface ITarea {
  _id?: string;
  name: string;
  semester: string;
  bdate: string;
  edate: string;
  hours: number;
  becarios: string[];
  finished: boolean;
}
