import { useEffect, useRef, useCallback } from "react";

const WS_URL = "ws://localhost:8000/api/v1/pedidos/cocina/ws";

export interface WsMessage {
  event: string;
  data: unknown;
}

interface UseWebSocketOptions {
  onMessage?: (msg: WsMessage) => void;
  enabled?: boolean;
}


export function useWebSocket({
  onMessage,
  enabled = true,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    let retryCount = 0;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    let currentWs: WebSocket | null = null;

    const closeCleanly = (ws: WebSocket) => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener("open", () => ws.close(1000), { once: true });
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000);
      }
    };

    const connect = () => {
      if (cancelled) return;

      const ws = new WebSocket(WS_URL);
      currentWs = ws;
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          ws.close(1000);
          return;
        }
        retryCount = 0;
        onMessageRef.current?.({ event: "WS_CONNECTED", data: null });
      };

      ws.onmessage = (event) => {
        console.log("EVENTO onmessage recibido", event);
        
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          onMessageRef.current?.(msg);
        } catch {
        }
      };

      ws.onerror = () => {
      };

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        currentWs = null;

        const wasNormal = e.code === 1000; 
        const wasAuthRejected = e.code === 1008; 

        if (cancelled || wasNormal || wasAuthRejected) return;

        retryCount++;
        const delay = Math.min(1000 * 2 ** retryCount, 30_000);
        console.warn(
          `[WS] Reconectando en ${delay / 1000}s (intento ${retryCount})`,
        );
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (currentWs) closeCleanly(currentWs);
      wsRef.current = null;
    };
  }, [enabled]);

  
  const subscribeToOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: "subscribe-order", order_id: orderId }),
      );
    }
  }, []);

  
  const unsubscribeFromOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: "unsubscribe-order", order_id: orderId }),
      );
    }
  }, []);

  return { subscribeToOrder, unsubscribeFromOrder };
}
