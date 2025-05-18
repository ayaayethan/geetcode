let loginButton = document.getElementById("login");
let userAuthToken = null; // user token used to make API calls

loginButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start_oauth" }, (res) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error: ", chrome.runtime.lastError);
      return;
    }

    console.log("OAuth response: ", res); // log response for sanity check

    chrome.storage.local.get('github_token', (result) => {
      userAuthToken = result.github_token; // set the user's auth token

      if (userAuthToken) {
        app(); // start our app
      } else {
        console.log("Error: userAuthToken is null");
      }
    });
  });
});

function app(responseData) {
    loginButton.hidden = true;
    document.getElementById("title").innerHTML = "User is authenticated! Auth token is: " + userAuthToken;
}