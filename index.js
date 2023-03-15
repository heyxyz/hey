// have main function with async await

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function fetchRetry(url, delay, tries, fetchOptions = {}) {
  function onError(err) {
    triesLeft = tries - 1;
    if (!triesLeft) {
      throw err;
    }
    return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
  }
  return fetch(url, fetchOptions).catch(onError);
}

const main = async () => {
  for (let i = 0; i < 100; i++) {
    console.log(i);
    fetchRetry('https://staging-api-social-mumbai.lens.crtlkey.com/', 10, 100, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-access-token':
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4M0E1YmQxRTM3YjA5OWFFMzM4NkQxMzk0N2I2YTkwZDk3Njc1ZTVlMyIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2Nzg4NzQ0MTQsImV4cCI6MTY3ODg3NjIxNH0.OSupMY-u-YKMoe0e3cY89donB3Ft5GztuMFPbgQtyK8'
      },
      referrer: 'https://da.lenster.xyz/',
      referrerPolicy: 'strict-origin',
      body: '{"operationName":"CreateDataAvailabilityCommentViaDispatcher","variables":{"request":{"from":"0x7036","commentOn":"0x7036-0x01-DA-150b00f9","contentURI":"ar://aCEvYQPAy4s65Rf_ponX_o002kR9tHIcfjKynx1BeYk"}},"query":"mutation CreateDataAvailabilityCommentViaDispatcher($request: CreateDataAvailabilityCommentRequest!) {\\n  createDataAvailabilityCommentViaDispatcher(request: $request) {\\n    ... on CreateDataAvailabilityPublicationResult {\\n      id\\n      proofs\\n      __typename\\n    }\\n    ... on RelayError {\\n      reason\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}',
      method: 'POST',
      mode: 'cors',
      credentials: 'omit'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          data?.data?.createDataAvailabilityCommentViaDispatcher?.id +
            ' - ' +
            data?.data?.createDataAvailabilityCommentViaDispatcher?.proofs
        );
      });

    if (i % 50 === 0 && i !== 0) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

main();
