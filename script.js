let history = [];

async function kirim(){

let input = document.getElementById("input");
let teks = input.value;

if(!teks || teks.trim().length === 0) return;

let chat = document.getElementById("chat");

/* USER MESSAGE (TIDAK DIUBAH UI) */
chat.innerHTML += "<div class='card'>👤 " + teks + "</div>";

input.value = "";

/* MEMORY CHAT */
history.push({ role: "user", text: teks });

/* LIMIT MEMORY BIAR TIDAK LEMOT */
if(history.length > 15){
  history = history.slice(-15);
}

/* AI MESSAGE (TIDAK UBAH UI) */
let ai = document.createElement("div");
ai.className = "card";
ai.innerText = "🤖 berpikir...";
chat.appendChild(ai);

/* LOADING SIMPLE */
let dots = 0;
let loading = setInterval(() => {
  dots++;
  ai.innerText = "🤖 berpikir" + ".".repeat(dots % 4);
}, 350);

/* CONTEXT */
let context = history.map(h => {
  return `${h.role === "user" ? "User" : "AI"}: ${h.text}`;
}).join("\n");

/* SYSTEM PROMPT (BIAR LEBIH PINTAR) */
let systemPrompt = `
Kamu adalah AI asisten pintar seperti ChatGPT.

Aturan:
- Jawab jelas, singkat, dan mudah dipahami
- Gunakan bahasa Indonesia yang natural
- Jangan jawab kosong atau bilang tidak bisa
- Kalau sulit, jelaskan sederhana
`;

/* API KEY */
const API_KEY = "AIzaSyALvQuNNRFeSze7Z9LJfFX0j0u2kRoxRfg";

try {

const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
{
method: "POST",
headers: {"Content-Type": "application/json"},
body: JSON.stringify({
contents: [{
parts: [{
text:
systemPrompt +
"\n\nPercakapan:\n" +
context +
"\n\nPertanyaan terakhir:\n" +
teks
}]
}]
})
}
);

const data = await res.json();

console.log("DEBUG:", data);

/* VALIDASI */
if(!data || !data.candidates || !data.candidates[0]){
  throw new Error("Response AI kosong");
}

clearInterval(loading);

let jawaban = data.candidates[0].content.parts[0].text;

ai.innerText = jawaban;

/* SIMPAN RESPONSE */
history.push({ role: "ai", text: jawaban });

chat.scrollTop = chat.scrollHeight;

} catch (e) {

clearInterval(loading);

console.error(e);

ai.innerText = "⚠ AI sedang error / koneksi bermasalah";

}

}
