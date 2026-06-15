import axios from "axios";
import { env } from '../config/env';
const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

export interface PagoCreate {
  pedido_id: number;
}

export interface PagoRead {
  id: number;
  pedido_id: number;
  mp_payment_id?: number | null;
  mp_status: string;
  mp_status_detail?: string | null;
  external_reference: string;
  idempotency_key: string;
  transaction_amount: number;
  payment_method_id?: string | null;
  checkout_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function crearPago(data: PagoCreate): Promise<PagoRead> {
  const response = await api.post<PagoRead>("/pagos/", data);
  return response.data;
}

export async function confirmarPagoConMP(paymentId: number): Promise<void> {
  await api.post(`/pagos/webhook?data.id=${paymentId}`);
}
