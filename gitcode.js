// elements
let loginButton = document.getElementById("login");
let pushButton = document.getElementById("push");
let title = document.getElementById("title");
let logoutButton = document.getElementById("logout");

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
  toggleElements("app");

  pushButton.addEventListener("click", () => {
    // TODO: extract your solution code from the leetcode page and push to github repo
  })

  // toggles the elements seen based on the page passed in (login or main)
  function toggleElements(page) {
    if (page === "login") {
      loginButton.style.display = "block";
      pushButton.style.display = "none";
      title.style.display = "none";
      logout.style.display = "none";
    } else if (page === "app") {
      loginButton.style.display = "none";
      pushButton.style.display = "block";
      title.style.display = "block";
      logout.style.display = "block";
    }
  }
}