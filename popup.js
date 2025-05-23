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
  loginButton.innerHTML = "Authenticating..."
  spinner.style.display = "block";

  // sends a message to chrome to start oath
  chrome.runtime.sendMessage({ action: "start_oauth" }, (res) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error: ", chrome.runtime.lastError);
      return;
    }

    // display spinner
    spinner.style.display = "none";
    loginButton.innerHTML = "Login with Github"
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
  chrome.storage.local.remove("github_token", () => {
    userAuthToken = null;
    toggleScreen("login");
  });
})

// push solution code to github repo
pushButton.addEventListener("click", () => {
  // get a reference to the current tab (leetcode)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]; // current open tab

    // verify we are on leetcode.com
    if (!tab.url || !tab.url.includes("leetcode.com/problems/")) {
      alert("Please navigate to a LeetCode problem or submission page before pushing!");
      return;
    }

    // execute a script to extract solution code
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: () => {
        const model = monaco.editor.getModels()[0];
        const language = model.getLanguageId();
        // get the extension for the language (.py, .js, .cpp, etc)
        const langExtension = monaco.languages.getLanguages()
                                              .find(l => l.id === language)
                                              .extensions[0];

        return {
          solutionCode: model.getValue(),
          langExtension
        }
      }
    })
    .then((response) => {
      const { solutionCode, langExtension } = response[0].result;
      // create the name of the file as "[problem-name].[language]"
      const fileName = tab.url.split('/')[4] + langExtension;


      // TODO: Push solution code to a GitHub repo

      // get reference to repo: "[username]-geetcode-solutions"


      // if reference is null, create repo

      // push solution code in a file and commit to repo
    })
  })
})

// toggles the screen based on the screen passed in (login or app)
function toggleScreen(screen) {
  if (screen === "login") {
    // show login button
    loginButton.style.display = "block";
    // hide other buttons
    pushButton.style.display = "none";
    logout.style.display = "none";

    title.innerHTML = "GeetCode!"

  } else if (screen === "app") {
    // hide login button
    loginButton.style.display = "none";
    // show push and logout buttons
    pushButton.style.display = "block";
    logout.style.display = "block";

      // grab user's name and display
    fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${userAuthToken}`,
        "X-GitHub-Api-Version": '2022-11-28'
      }
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      title.innerHTML = `Welcome, ${data.name}`;
    })
  }
}

// main app function
function app() {
  toggleScreen("app");
}
