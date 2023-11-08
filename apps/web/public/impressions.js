const postsEndpoint = 'https://ens.hey.xyz';
const postsVisibilityInterval = 5000;
let visiblePostsSet = new Set();

function sendVisiblePostsToServer() {
  const postsToSend = Array.from(visiblePostsSet);

  if (postsToSend.length > 0) {
    visiblePostsSet.clear();
    fetch(postsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visiblePosts: postsToSend }),
      keepalive: true
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to send visible posts:', response);
        }
      })
      .catch((error) => {
        console.error('Error sending visible posts:', error);
      });
  }
}

setInterval(sendVisiblePostsToServer, postsVisibilityInterval);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'POST_VISIBLE') {
    visiblePostsSet.add(event.data.postId);
  }
});
