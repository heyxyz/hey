import axios from 'axios';

/**
 * Get the IP info from the IP info API.
 * @returns The IP info.
 */
const getIpInfo = async (): Promise<{
  success: boolean;
  ip: string;
  country: string;
  ray: string;
}> => {
  try {
    const response = await axios('https://ipinfo.lenster.xyz');
    return response.data;
  } catch {
    throw new Error('Failed to get IP info.');
  }
};

export default getIpInfo;
