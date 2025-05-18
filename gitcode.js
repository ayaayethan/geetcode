document.getElementById("login").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start_oauth" });
});