import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Button, Form, Input, TextArea, useZodForm } from "@hey/ui";
import axios from "axios";
import { useRouter } from "next/router";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { object, string, type z } from "zod";

const newListSchema = object({
  name: string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(100, { message: "Name should not exceed 100 characters" }),
  description: string()
    .max(500, { message: "Description should not exceed 500 characters" })
    .optional()
});

const Create: FC = () => {
  const { push } = useRouter();
  const [creatingList, setCreatingList] = useState(false);

  const form = useZodForm({
    schema: newListSchema
  });

  const createList = async ({
    name,
    description
  }: z.infer<typeof newListSchema>) => {
    try {
      setCreatingList(true);
      await toast.promise(
        axios.post(
          `${HEY_API_URL}/lists/create`,
          { name, description, avatar: "gm" },
          { headers: getAuthApiHeaders() }
        ),
        {
          error: "Failed to create list",
          loading: "Creating list...",
          success: ({ data }) => {
            push(`/lists/${data?.result.id}`);
            return "List created";
          }
        }
      );
    } finally {
      setCreatingList(false);
    }
  };

  return (
    <div className="p-5">
      <Form className="space-y-4" form={form} onSubmit={createList}>
        <Input label="Name" placeholder="John Doe" {...form.register("name")} />
        <TextArea
          label="Description"
          placeholder="Please provide additional details about the list"
          {...form.register("description")}
        />
        <Button
          className="flex w-full justify-center"
          disabled={creatingList}
          type="submit"
        >
          {creatingList ? "Creating..." : "Create"}
        </Button>
      </Form>
    </div>
  );
};

export default Create;
