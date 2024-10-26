import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { HEY_API_URL } from "@hey/data/constants";
import { STAFFTOOLS } from "@hey/data/tracking";
import type { Permission } from "@hey/types/hey";
import { Button, Form, TextArea, useZodForm } from "@hey/ui";
import axios from "axios";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { object, string, type z } from "zod";

const assignPermissionSchema = object({
  ids: string().regex(/0x[\dA-Fa-f]+/g, {
    message: "Invalid profile IDs"
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

  const assign = async ({ ids }: z.infer<typeof assignPermissionSchema>) => {
    try {
      setAssigning(true);
      const { data } = await axios.post(
        `${HEY_API_URL}/internal/permissions/bulkAssign`,
        { id: permission.id, ids },
        { headers: getAuthApiHeaders() }
      );

      setAssigning(false);
      setShowAssignModal(false);
      toast.success(`Assigned permission to ${data.assigned} users`);
      Leafwatch.track(STAFFTOOLS.PERMISSIONS.BULK_ASSIGN);
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Form className="m-5 space-y-4" form={form} onSubmit={assign}>
      <TextArea
        placeholder='Profile IDs, Eg: ["0x0d", "0x05"]'
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
