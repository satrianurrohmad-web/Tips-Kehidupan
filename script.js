sync function kirim(){

let input=document.getElementById("input");
let teks=input.value;
if(!teks.trim()) return;

let chat=document.getElementById("chat");

chat.innerHTML+="<div class='card'>👤 "+teks+"</div>";
input.value="";

let ai=document.createElement("div");
ai.className="card";
ai.innerText="🤖 berpikir...";
chat.appendChild(ai);

const API_KEY="AIzaSyCMid3FgHPZ4S95dAjo_4xpwXWZ-25321k";

try{
const res=await fetch(
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY},
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({contents:[{parts:[{text:teks}]}]})
}
);

const data=await res.json();

ai.innerText=data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak bisa menjawab";

}catch(e){
ai.innerText="Error koneksi AI";
}

chat.scrollTop=chat.scrollHeight;
}
