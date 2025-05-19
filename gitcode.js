// elements
let loginButton = document.getElementById("login");
let pushButton = document.getElementById("push");
let title = document.getElementById("title");
let logoutButton = document.getElementById("logout");
let spinner = document.getElementById("spinner");

let userAuthToken = null; // user token used to make API calls

// checks when the window loads if a user is already logged in.
window.onload = () => {
  chrome.storage.local.get("github_token", (res) => {
    if (res.github_token) {
      userAuthToken = res.github_token;
      app();
    }
  })
}

// login user on loginButton click
loginButton.addEventListener("click", () => {
  // start the loading spinner
  loginButton.disabled = true;
  spinner.style.display = "block";

  // sends a message to chrome to start oath
  chrome.runtime.sendMessage({ action: "start_oauth" }, (res) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error: ", chrome.runtime.lastError);
      return;
    }

    // display spinner
    spinner.style.display = "none";
    loginButton.disabled = false;

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

// logout user on logout button click
// sets userAuthToken to null, remove from local storage, and toggle login screen.
logoutButton.addEventListener("click", () => {
  chrome.storage.local.remove("github_token");
  userAuthToken = null;
  toggleScreen("login");
})

// main app function
function app() {
  toggleScreen("app");

  pushButton.addEventListener("click", () => {
    // TODO: extract your solution code from the leetcode page and push to github repo
  })
}

// toggles the screen based on the screen passed in (login or app)
function toggleScreen(screen) {
  if (screen === "login") {
    // show login button
    loginButton.style.display = "block";
    // hide other buttons
    pushButton.style.display = "none";
    logout.style.display = "none";
  } else if (screen === "app") {
    // hide login button
    loginButton.style.display = "none";
    // show push and logout buttons
    pushButton.style.display = "block";
    logout.style.display = "block";
  }
}