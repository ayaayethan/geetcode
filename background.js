chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start_oauth') {
    // grab redirectURI using chrome identity API
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://github.com/login/oauth/authorize?client_id=Ov23liqIyYrd2yZQOIIZ&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl) => {
      if (redirectUrl) {
        const code = new URL(redirectUrl).searchParams.get('code');
        if (code) {
          // Send code to the backend to be authenticated
          fetch('https://geetcode-backend.vercel.app/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })
          .then(response => response.json())
          .then(data => {
            // Store data in local storage
            chrome.storage.local.set({ github_token: data.access_token }, () => {
              chrome.storage.local.get('github_token', (result) => {
                console.log('Verified stored token: ', result.github_token); // Verify it was stored
              });
            });
            sendResponse({ success: true })
          });
        }
      }
    });
    return true;
  }
});