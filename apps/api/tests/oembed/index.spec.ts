import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('oembed/index', () => {
  test('should return basic oembed', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://github.com' }
    });

    expect(response.data.oembed.description).contains('GitHub');
    expect(response.data.oembed.favicon).contains(
      'https://www.google.com/s2/favicons?domain=github.com&sz=128'
    );
    expect(response.data.oembed.site).contains('GitHub');
    expect(response.data.oembed.title).contains('GitHub');
    expect(response.data.oembed.url).contains('https://github.com');
  });

  test('should return rich oembed', async () => {
    const response = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: 'https://www.youtube.com/watch?v=SXK6NHp09jE' }
    });

    expect(response.data.oembed.html).toEqual(
      '<iframe src="https://www.youtube.com/embed/SXK6NHp09jE" width="100%" height="415" allow="accelerometer; encrypted-media" allowfullscreen></iframe>'
    );
  });
});
