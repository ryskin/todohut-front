import { observer } from "mobx-react-lite";
import { AddUserModal } from "../../components/AddUserModal";
import { Table } from "../../components/Table/Table";
import { useStore } from "../../models/StoreContext";

export const UsersPage = observer(() => {
  const store = useStore();
  const { items: users } = store.user;

  const columns = [
    {
      Header: "Nickname",
      accessor: "nick",
    },
    {
      Header: "First name",
      accessor: "firstName",
    },
    {
      Header: "Last name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Created at",
      accessor: "createdAt",
      Cell: ({ value }: { value: Date }) => {
        if (value) {
          return value.toLocaleString();
        }
        return "no date"
      }
    },
    {
      Header: "Updated at",
      accessor: "updatedAt",
      Cell: ({ value }: { value: Date }) => {
        if (value) {
          return value.toLocaleString();
        }
        return "no date"
      }
    },
  ];

  return (
    <div className="flex-auto bg-gray-50 border-l rounded-tl-xl shadow-2xl p-6">
      <div className="p-2">
        <h1 className="flex-auto font-semibold text-xl">Users</h1>
      </div>
      <div className="p-2">
        <Table columns={columns} data={users ? [...users] : []} />
      </div>
      <AddUserModal clickComponent={<div>Add User</div>} />
    </div>
  );
});
