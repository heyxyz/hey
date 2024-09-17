import type { Permission } from "@hey/types/hey";
import type { Dispatch, FC, SetStateAction } from "react";

import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { HEY_API_URL } from "@hey/data/constants";
import { STAFFTOOLS } from "@hey/data/tracking";
import { Button, Form, TextArea, useZodForm } from "@hey/ui";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "zod";

const assignPermissionSchema = object({
  ids: string().regex(/0x[\dA-Fa-f]+/g, {
    message: "Invalid user IDs"
  })
});

interface AssignProps {
  permission: Permission;
  setShowAssignModal: Dispatch<SetStateAction<boolean>>;
}

const Assign: FC<AssignProps> = ({ permission, setShowAssignModal }) => {
  const [assigning, setAssigning] = useState(false);

  const form = useZodForm({
    schema: assignPermissionSchema
  });

  const assign = (ids: string) => {
    setAssigning(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/permissions/bulkAssign`,
        { id: permission.id, ids },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setAssigning(false);
          return "Failed to assign permission";
        },
        loading: "Assigning permission...",
        success: ({ data }) => {
          Leafwatch.track(STAFFTOOLS.PERMISSIONS.BULK_ASSIGN);
          setAssigning(false);
          setShowAssignModal(false);
          return `Assigned permission to ${data.assigned} users`;
        }
      }
    );
  };

  return (
    <Form
      className="m-5 space-y-4"
      form={form}
      onSubmit={async ({ ids }) => {
        await assign(ids);
      }}
    >
      <TextArea
        placeholder='User IDs, Eg: ["0x0d", "0x05"]'
        rows={5}
        {...form.register("ids")}
      />
      <Button disabled={assigning} type="submit">
        Assign
      </Button>
    </Form>
  );
};

export default Assign;
