const WebSocket = require("ws");

// 创建一个 WebSocket 伺服器，監聽端口8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("客戶端已連接");

  // 定期發送訊息到客户端
  const sendUpdates = setInterval(() => {
    const timeMessage = JSON.stringify({
      type: "time",
      data: new Date().toLocaleTimeString(),
    });
    ws.send(timeMessage);
    const notificationMasssage = JSON.stringify({
      type: "notification",
      data: "訊息",
    });
    ws.send(notificationMasssage);
  }, 5000);

  // 接收訊息
  ws.on("message", (message) => {
    const messageStr = JSON.stringify({
      type: "data",
      data: message.toString("utf-8"),
    });
    console.log("收到訊息:", messageStr);
    // 回應訊息
    ws.send(messageStr);
    wss.clients.forEach((clients) => {
      if (clients.readyState === WebSocket.OPEN) {
        clients.send(messageStr);
      }
    });
  });

  // 連接關閉
  ws.on("close", () => {
    console.log("客戶端已斷開連結");
    clearInterval(sendUpdates);
  });
});

console.log("WebSocket 伺服器運行中...");
