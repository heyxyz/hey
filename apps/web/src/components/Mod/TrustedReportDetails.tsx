import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TrustedReportDetailsProps {
  publicationId: string;
}

const TrustedReportDetails: FC<TrustedReportDetailsProps> = ({
  publicationId
}) => {
  const fetchTrustedReportDetails = async (): Promise<
    {
      count: number;
      reason: string;
    }[]
  > => {
    try {
      const response = await axios.get(`${HEY_API_URL}/trusted/reportDetails`, {
        params: { id: publicationId }
      });

      return response.data.result;
    } catch {
      return [];
    }
  };

  const { data } = useQuery({
    queryFn: fetchTrustedReportDetails,
    queryKey: ['fetchTrustedReportDetails', publicationId]
  });

  return (
    <div>
      <div className="divider" />
      <div className="m-5 space-y-2">
        <b>Reports</b>
        <div className="text-sm">
          {data?.map((report) => (
            <div className="flex items-center space-x-1" key={report.reason}>
              <b>{report.reason.toLowerCase().replaceAll('_', ' ')}:</b>
              <div>{report.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedReportDetails;
