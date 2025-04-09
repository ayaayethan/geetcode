document.getElementById("login").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "login" });
});