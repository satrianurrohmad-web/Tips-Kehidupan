let history = [];

async function kirim(){

let input = document.getElementById("input");
let teks = input.value;

if(teks.trim().length < 1) return;

let chat = document.getElementById("chat");

/* USER MESSAGE (TIDAK DIUBAH) */
chat.innerHTML += "<div class='card'>👤 "+teks+"</div>";

input.value = "";

/* MEMORY */
history.push({ role:"user", text:teks });

/* AI MESSAGE (TIDAK DIUBAH STYLE) */
let ai = document.createElement("div");
ai.className = "card";
ai.innerText = "🤖 berpikir...";
chat.appendChild(ai);

/* LOADING ANIMATION (TETAP SIMPLE) */
let dots = 0;
let loading = setInterval(() => {
  dots++;
  ai.innerText = "🤖 berpikir" + ".".repeat(dots % 4);
}, 400);

/* CONTEXT MEMORY */
let context = history.map(h => `${h.role}: ${h.text}`).join("\n");

const API_KEY = "Gemini API Key";

try {

const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{
parts:[{
text: `
Kamu adalah AI asisten pintar.

Gunakan percakapan ini:
${context}

Jawab user terakhir dengan jelas, singkat, dan membantu.
`
}]
}]
})
}
);

const data = await res.json();

console.log("DEBUG AI:", data);

/* VALIDASI BIAR TIDAK ERROR */
if(!data.candidates || !data.candidates[0]){
  throw new Error("Response kosong dari AI");
}

clearInterval(loading);

let jawaban = data.candidates[0].content.parts[0].text;

ai.innerText = jawaban;

/* SIMPAN JAWABAN */
history.push({ role:"ai", text:jawaban });

chat.scrollTop = chat.scrollHeight;

} catch (e) {

clearInterval(loading);

console.error(e);

ai.innerText = "⚠ AI sedang bermasalah (cek API / koneksi)";

}

}
