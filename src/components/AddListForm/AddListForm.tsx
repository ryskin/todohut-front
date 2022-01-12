import { useStore } from "../../models/StoreContext";
import { useForm } from "react-hook-form";

export const AddListForm = () => {
  const store = useStore();
  const { list } = store;
  const { register, handleSubmit, resetField } = useForm();

  const onSubmit = async ({ listName }: { listName: string; }) => {
    console.log("data", listName);
    resetField("listName");
    list.add({ name: listName });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center"></div>
      <input
        {...register("listName", { required: true })}
        className="flex-auto rounded-xl p-1 border-gray-300 w-full" />
    </form>
  );
};
