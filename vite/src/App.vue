<template>
  <div>
    <h1>WebSocket 客戶端</h1>
    <button class="mr-2 px-3 py-6" @click="connect">連結伺服器</button>
    <input
      class="rounded-lg border-2 border-black"
      placeholder="write someting..."
      v-model="MessageData"
    />
    <button class="mr-2 px-3 py-6" @click="sendMessage">發送訊息</button>

    <button class="mr-2 px-3 py-6" @click="closeConnection">關閉連接</button>
    <div class="mt-3 font-bold" v-for="message in messages" :key="message">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const socket = ref(null);
const messages = ref([]);

const connect = () => {
  socket.value = new WebSocket("ws://localhost:8080");

  socket.value.onopen = () => {
    console.log("連接已開啟");
    messages.value.push("連接已開啟");
  };

  socket.value.onmessage = (event) => {
    console.log("收到伺服器訊息:", event.data);
    const massageJSON = JSON.parse(event.data);
    if (massageJSON.type === "time") {
      messages.value.push(`時間: ${massageJSON.data}`);
    } else if (massageJSON.type === "notification") {
      messages.value.push(`通知: ${massageJSON.data}`);
    } else {
      messages.value.push(`收到伺服器訊息: ${massageJSON.data}`);
    }
  };

  socket.value.onclose = () => {
    console.log("連結已關閉");
    messages.value.push("連結已關閉");
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket 錯誤:", error);
    messages.value.push(`WebSocket 錯誤: ${error}`);
  };
};

const MessageData = ref("");
const sendMessage = () => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(MessageData.value);
    MessageData.value = "";
    console.log("發送訊息!成功");
  }
};

const closeConnection = () => {
  if (socket.value) {
    socket.value.close();
  }
};
</script>
