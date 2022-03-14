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
    handleCreate({ ...data, rate: Number(data?.rate) });
  };

  const Input = ({ name, label, type, validation }: { name: string; label: string, type?: string, validation?: {} }) => {
    return (
      <div className="mb-2 w-full gap-1">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-500 mb-1"
        >
          {label}
        </label>
        <input
          type={type}
          {...register(name, {...validation } ) }
          className="w-full placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8 bg-gray-100"
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <Input name="nick" label="Username" validation={{ required: true }} />
      <Input name="firstName" label="First name" validation={{ required: true }} />
      <Input name="lastName" label="Last name" validation={{ required: true }} />
      <Input name="email" type="email" label="Email" validation={{ required: true }} />
      <Input name="rate" type="number" label="Hour rate" validation={{ required: true }} />
      <button className="mt-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg h-8" type="submit" disabled={!!errors.nick}>
        Create
      </button>
    </form>
  );
};
