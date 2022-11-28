import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeeCollector } from 'src/abis/FeeCollector';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { hash } = req.body.event.activity[0];
      const iface = new ethers.utils.Interface(FeeCollector);
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon');
      const tx = await provider.getTransactionReceipt(hash);
      const userId = JSON.parse(JSON.stringify(iface.parseLog(tx.logs[2]))).args[2];

      const updateData = { proExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), txHash: hash };
      const data = await prisma.user.upsert({
        where: { userId },
        create: { userId, ...updateData },
        update: updateData
      });

      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
