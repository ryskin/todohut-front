import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../models/StoreContext";
import { UserSnapshot } from "../../models/User/UserModel";
import { AddUserForm } from "../AddUserForm";
import { Modal } from "../Modal";

export const AddUserModal = observer(
    ({ clickComponent }: { clickComponent: JSX.Element }) => {
      const store = useStore();
  
      const [closeModal, setCloseModal] = useState(false);
  
      const handleCreateUser = (user: UserSnapshot) => {
        store.user.add(user);
        setCloseModal((prev) => !prev);
      };
    
      return (
        <Modal
          title="Add user"
          clickComponent={clickComponent}
          closeFromParent={closeModal}
        >
          <AddUserForm handleCreate={handleCreateUser} />
        </Modal>
      );
    }
  );