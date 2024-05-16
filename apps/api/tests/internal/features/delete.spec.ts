import { describe } from 'vitest';

describe.skip('internal/features/delete', async () => {
  // const createNewFeature = async () => {
  //   const response = await axios.post(
  //     `${TEST_URL}/internal/features/create`,
  //     { key: Math.random().toString() },
  //     { headers: await getAuthApiHeadersForTest() }
  //   );
  //   return response.data.feature.id;
  // };
  // const payload = { id: await createNewFeature() };
  // test.skip('should delete a feature', async () => {
  //   const response = await axios.post(
  //     `${TEST_URL}/internal/features/delete`,
  //     payload,
  //     { headers: await getAuthApiHeadersForTest() }
  //   );
  //   expect(response.data.success).toBeTruthy();
  // });
  // test.skip('should fail if not staff', async () => {
  //   try {
  //     const response = await axios.post(
  //       `${TEST_URL}/internal/features/delete`,
  //       payload,
  //       { headers: await getAuthApiHeadersForTest({ staff: false }) }
  //     );
  //     expect(response.status).toEqual(401);
  //   } catch {}
  // });
  // test.skip('should fail if not authenticated', async () => {
  //   try {
  //     const response = await axios.post(
  //       `${TEST_URL}/internal/features/delete`,
  //       payload
  //     );
  //     expect(response.status).toEqual(401);
  //   } catch {}
  // });
});
