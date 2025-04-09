chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "login") {
    const clientId = "Ov23liqIyYrd2yZQOIIZ";
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error(chrome.runtime.lastError);
          return;
        }

        const url = new URL(redirectUrl);
        const code = url.searchParams.get("code");
        console.log("GitHub OAuth code:", code);

        // NOTE: Now send this `code` to your server to exchange for an access token
      }
    );
  }
});