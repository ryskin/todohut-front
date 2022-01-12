import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import { useStore } from "../../models/StoreContext";

export const AddTaskForm = observer(
  ({ statusId, parentId }: { statusId: string; parentId?: string }) => {
    const store = useStore();
    const { register, handleSubmit, resetField } = useForm();

    const onSubmit = async ({
      taskName,
    }: {
      taskName: string;
      status: string;
    }) => {
      if (!store.list.selected) {
        alert("Please select a list");
        return;
      }
      resetField("taskName");
      store.task.add({
        name: taskName,
        list: store.list.selected,
        status: statusId,
        parent: parentId,
      });
    };
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center"></div>
          <input
            {...register("taskName", { required: true })}
            className="p-1 border-gray-300 w-full shadow-sm"
          />
        </form>
      </>
    );
  }
);
