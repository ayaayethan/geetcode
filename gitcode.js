let loginButton = document.getElementById("login");
let userAuthToken = null; // user token used to make API calls

// checks when the window loads if a user is already logged in.
window.onload = () => {
  chrome.storage.local.get('github_token', (res) => {
    if (res.github_token) {
      userAuthToken = res.github_token;
      app();
    }
  })
}

loginButton.addEventListener("click", () => {
  // sends a message to chrome to start oath
  chrome.runtime.sendMessage({ action: "start_oauth" }, (res) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error: ", chrome.runtime.lastError);
      return;
    }

    console.log("OAuth response: ", res); // log response for sanity check

    // if res is valid, set user's auth token
    if (res && res.success && res.github_token) {
      userAuthToken = res.github_token;
      app();
    } else {
      console.log("Error: Token not received.");
    }
  });
});

// main app function
function app() {
  loginButton.style.display = "none";

  let pushButton = document.getElementById("push");
  let title = document.getElementById("title");
  pushButton.style.display = "block";
  title.style.display = "block";
}