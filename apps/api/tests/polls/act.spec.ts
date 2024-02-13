import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('polls/act', () => {
  test('should act on a poll', async () => {
    const newPollResponse = await axios.post(
      `${TEST_URL}/polls/create`,
      { length: 1, options: ['option 1', 'option 2'] },
      { headers: await getAuthApiHeadersForTest() }
    );

    const response = await axios.post(
      `${TEST_URL}/polls/act`,
      {
        option: newPollResponse.data.poll.options[0].id,
        poll: newPollResponse.data.poll.id
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.id).toHaveLength(36);
  });
});
