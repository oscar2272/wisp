// utils/createWebSocketClient.ts
const BASE_URL = import.meta.env.VITE_WS_BASE_URL;

console.log("BASE_URL", BASE_URL);
export function createWebSocketClient(onMessage: (msg: string) => void) {
  const socket = new WebSocket(`${BASE_URL}/ws/autocomplete`);

  socket.onopen = () => {
    console.log("[WS] 연결됨");
  };

  socket.onmessage = (event) => {
    const suggestion = event.data;
    onMessage(suggestion);
  };

  socket.onerror = (err) => {
    console.error("[WS] 에러", err);
  };

  socket.onclose = () => {
    console.warn("[WS] 연결 종료");
  };

  return socket;
}
