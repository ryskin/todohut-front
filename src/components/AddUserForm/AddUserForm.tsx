import { UserSnapshot } from "../../models/User/UserModel";
import { useForm } from "react-hook-form";

export const AddUserForm = ({
  handleCreate,
}: {
  handleCreate: (user: UserSnapshot) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    handleCreate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <input
        defaultValue="Batman"
        {...register("nick")}
        className="placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8"
      />
      <input
        defaultValue="Alexey"
        {...register("firstName")}
        className="placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8"
      />
      <input
        defaultValue="Kuznetsov"
        {...register("lastName")}
        className="placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8"
      />
      <input
        defaultValue="ringo@ringo-web.ru"
        {...register("email")}
        className="placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8"
      />
      <button type="submit" disabled={!!errors.nick}>
        Create
      </button>
    </form>
  );
};
