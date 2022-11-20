import axios from 'axios';

const isBrowser = typeof window !== 'undefined';

/**
 * Store IP in session storage
 */
const storeIp = () => {
  if (isBrowser) {
    const ipFromSession = sessionStorage.getItem('ip');

    if (!ipFromSession) {
      axios('https://api.ipify.org', {
        method: 'GET'
      })
        .then(({ data }) => {
          sessionStorage.setItem('ip', data);
        })
        .catch(() => {
          console.error('Error while fetching IP');
        });
    }
  }
};

export default storeIp;
