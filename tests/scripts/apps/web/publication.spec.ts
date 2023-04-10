import { expect, test } from '@playwright/test';
import { APP_NAME, ATTACHMENT, IPFS_GATEWAY, USER_CONTENT_URL } from 'data/constants';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Publication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x01`);
  });

  test('should have publication title', async ({ page }) => {
    await expect(page).toHaveTitle(`Post by @yoginth • ${APP_NAME}`);
  });

  test('should have publication', async ({ page }) => {
    const publication = page.getByTestId('publication-0x0d-0x01');
    await expect(publication).toBeVisible();
  });

  test.describe('Publication header', async () => {
    test('should have profile', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('@yoginth');
    });

    test('should have menu', async ({ page }) => {
      const publicationMenu = page.getByTestId('publication-0x0d-0x01-menu');
      await publicationMenu.click();
      const localeSelectorMenuItems = page.getByTestId('publication-0x0d-0x01-menu-items');
      await expect(localeSelectorMenuItems).toContainText('Report Post');
      await expect(localeSelectorMenuItems).toContainText('Embed');
      await expect(localeSelectorMenuItems).toContainText('Permalink');
    });
  });

  test.describe('Publication body', async () => {
    test('should have body', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('gm frens 👋');
    });
  });

  test.describe('Publication meta', async () => {
    test('should have meta', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('Posted via Lenster');
      await expect(publication).toContainText('May 18, 2022');
    });
  });

  test.describe('Publication stats', async () => {
    test('should have comment stats', async ({ page }) => {
      const publicationCommentStats = page.getByTestId('publication-0x0d-0x01-comment-stats');
      await expect(publicationCommentStats).toContainText('Comments');
    });

    test('should have mirror stats', async ({ page }) => {
      const publicationMirrorStats = page.getByTestId('publication-0x0d-0x01-mirror-stats');
      await expect(publicationMirrorStats).toContainText('Mirror');

      // click mirror stats and check if it opens mirror modal
      await publicationMirrorStats.click();
      const mirrorsModal = page.getByTestId('mirrors-modal');
      await expect(mirrorsModal).toBeVisible();
    });

    test('should have like stats', async ({ page }) => {
      const publicationLikeStats = page.getByTestId('publication-0x0d-0x01-like-stats');
      await expect(publicationLikeStats).toContainText('Likes');

      // click like stats and check if it opens likes modal
      await publicationLikeStats.click();
      const likesModal = page.getByTestId('likes-modal');
      await expect(likesModal).toBeVisible();
    });

    test('should have collect stats', async ({ page }) => {
      const publicationCollectStats = page.getByTestId('publication-0x0d-0x01-collect-stats');
      await expect(publicationCollectStats).toContainText('Collects');

      // click collect stats and check if it opens collectors modal
      await publicationCollectStats.click();
      const collectorsModal = page.getByTestId('collectors-modal');
      await expect(collectorsModal).toBeVisible();
    });

    test('should have comments feed', async ({ page }) => {
      await expect(page.getByTestId('comments-feed')).toBeVisible();
    });

    test('should have none relevant feed', async ({ page }) => {
      await expect(page.getByTestId('none-relevant-feed')).toBeVisible();
    });
  });
});

test.describe('Publication attachments', () => {
  test('should have publication image', async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x037d`);

    const imageURL = `${IPFS_GATEWAY}bafybeihztcpkzhzc3fddsc66r22hzsztja6blflygurlft7lmc4l44pnre`;
    const publicationImage = page.getByTestId(`attachment-image-${imageURL}`);
    await expect(publicationImage).toBeVisible();

    // click image and check if it opens image lightbox and original image
    await publicationImage.click();
    const lightboxOpenOriginal = page.getByTestId('lightbox-open-original');
    await lightboxOpenOriginal.click();
    const newPage = await page.waitForEvent('popup');
    await expect(newPage.url()).toBe(imageURL + '/');
  });

  test('should have publication video', async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x01-0x01`);

    const videoURL = 'https://lens.infura-ipfs.io/ipfs/QmSPijepBo81hDLZ54qg3bKC2DpV9VFdaDJ81Y2viPHCRZ';
    const publicationVideo = page.getByTestId(`attachment-video-${videoURL}`);
    await expect(publicationVideo).toBeVisible();
  });

  test('should have publication audio', async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x01ec`);

    const audioURL = `${IPFS_GATEWAY}bafybeihabco35vpefrlgzx3rvxccfx4th6ti5ktidw2tf5vjmnmjwx5ki4`;
    const coverURL = `${IPFS_GATEWAY}bafkreibljzow3cbr4kirujjc5ldxbcykgahjuwuc5zmfledisq4sizwhyq`;
    const publicationAudio = page.getByTestId(`attachment-audio-${audioURL}`);
    await expect(publicationAudio).toBeVisible();

    // check if audio cover image is visible
    const publicationAudioCover = page.getByTestId(`attachment-audio-cover-${coverURL}`);
    await expect(publicationAudioCover).toHaveAttribute(
      'src',
      `${USER_CONTENT_URL}/${ATTACHMENT}/${coverURL}`
    );
  });

  test.describe('Publication oembed', () => {
    test('should have normal oembed', async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x0375`);

      const publicationOembed = page.getByTestId('normal-oembed-https://testflight.apple.com/join/U9YkOlOy');
      await expect(publicationOembed).toBeVisible();
    });

    test('should have rich oembed', async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x02fb`);

      const publicationOembed = page.getByTestId('rich-oembed-https://lenstube.xyz/watch/0x24-0xe8');
      await expect(publicationOembed).toBeVisible();
    });
  });

  test.describe('Publication snapshot widget', () => {
    test('should have normal oembed', async ({ page }) => {
      await page.goto(`${WEB_BASE_URL}/posts/0x0c-0x2c`);

      const snapshotWidget = page.getByTestId(
        'snapshot-0x9287c40edcd68c362c7c4139fe3489bbaaa27cf4de68be5c218a82d0f252e718'
      );
      await expect(snapshotWidget).toContainText('Do you like the Snapshot integration with Lenster?');
      await expect(snapshotWidget).toContainText('Yes ser 🙌');
    });
  });
});

test.describe('Publication sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x037d`);
  });

  test('should have og poster profile', async ({ page }) => {
    const posterProfile = page.getByTestId('poster-profile');
    await expect(posterProfile).toContainText('@yoginth');
  });

  test('should have relevant profiles', async ({ page }) => {
    const relevantProfiles = page.getByTestId('relevant-profiles');
    await expect(relevantProfiles).toContainText('@lenster');
    await expect(relevantProfiles).toContainText('@sagargowda');
  });

  test('should have on chain meta', async ({ page }) => {
    const onChainMeta = page.getByTestId('onchain-meta');
    // Arweave transaction
    await expect(onChainMeta).toContainText('t0zAPjaeoh3M1TZQV0ZcbSCw_Q0wlQE4LgJuKnO1HLE');
    // NFT address
    await expect(onChainMeta).toContainText('0x89e19Acb4ac03FDf6a09dc299961F51059195612');
  });
});
