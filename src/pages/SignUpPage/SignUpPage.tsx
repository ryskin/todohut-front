import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AddUserForm } from "../../components/AddUserForm";
import { useStore } from "../../models/StoreContext";
import { UserSnapshot } from "../../models/User/UserModel";

export const SignUpPage = observer(() => {
  const store = useStore();
  const [redirect, setRedirect] = useState(false);

  const handleCreateUser = (user: UserSnapshot) => {
    store.user.add(user);
    if (store.user.items.length > 0) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="w-96 inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <h2>Register</h2>
        <div className="border-b-2 mb-4"></div>
        <AddUserForm handleCreate={handleCreateUser} />
      </div>
    </div>
  );
});
