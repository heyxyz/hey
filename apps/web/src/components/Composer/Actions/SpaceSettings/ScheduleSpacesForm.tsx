import { CalendarIcon } from '@heroicons/react/24/outline';
import { Input } from '@lenster/ui';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useSpacesStore } from 'src/store/spaces';

interface ScheduleSpacesFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ScheduleSpacesForm: FC<ScheduleSpacesFormProps> = ({ setShowModal }) => {
  const setSpacesStartTime = useSpacesStore(
    (state) => state.setSpacesStartTime
  );

  return (
    <div className="m-4 flex flex-col">
      <Input
        type="datetime-local"
        onChange={(e) => {
          setSpacesStartTime(new Date(e.target.value));
        }}
      />
      <div className="mt-4 rounded-lg bg-violet-500 p-2">
        <div className="flex justify-center">
          <CalendarIcon className="h-5 w-5 text-gray-50" />
          <button
            className="ml-2 text-sm font-semibold text-gray-50"
            onClick={() => setShowModal(false)}
          >
            Set Date & Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSpacesForm;
