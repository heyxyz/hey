import type { Permission as TPermission } from "@hey/types/hey";
import type { FC } from "react";

import Loader from "@components/Shared/Loader";
import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Permission } from "@hey/data/permissions";
import getAllPermissions from "@hey/helpers/api/getAllPermissions";
import formatDate from "@hey/helpers/datetime/formatDate";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorMessage,
  Modal
} from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Assign from "./Assign";

const List: FC = () => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<null | TPermission>(null);
  const [permissions, setPermissions] = useState<[] | TPermission[]>([]);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllPermissions(getAuthApiHeaders()).then((permissions) => {
        setPermissions(permissions);
        return permissions;
      }),
    queryKey: ["getAllPermissions"]
  });

  return (
    <Card>
      <CardHeader title="Permissions" />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-10" message="Loading permissions..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load permissions" />
        ) : !permissions.length ? (
          <EmptyState
            hideCard
            icon={<AdjustmentsHorizontalIcon className="size-8" />}
            message={<span>No permissions found</span>}
          />
        ) : (
          <div className="space-y-5">
            {permissions?.map((permission) => (
              <div key={permission.id}>
                <ToggleWithHelper
                  description={`Created on ${formatDate(permission.createdAt)}`}
                  disabled={true}
                  heading={
                    <div className="flex items-center space-x-2">
                      <b
                        className={cn(
                          (permission.key === Permission.Suspended ||
                            permission.key === Permission.CommentSuspended) &&
                            "text-red-500"
                        )}
                      >
                        {permission.key}
                      </b>
                      <Badge variant="secondary">{permission.type}</Badge>
                      {permission._count.profiles !== 0 && (
                        <Badge variant="warning">
                          {permission._count.profiles} assigned
                        </Badge>
                      )}
                    </div>
                  }
                  on={true}
                  setOn={() => {}}
                />
                <div className="mt-2 space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedPermission(permission);
                      setShowAssignModal(!showAssignModal);
                    }}
                    outline
                    size="sm"
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        onClose={() => setShowAssignModal(!showAssignModal)}
        show={showAssignModal}
        title={`Assign permission - ${selectedPermission?.key}`}
      >
        {selectedPermission ? (
          <Assign
            permission={selectedPermission}
            setShowAssignModal={setShowAssignModal}
          />
        ) : null}
      </Modal>
    </Card>
  );
};

export default List;
