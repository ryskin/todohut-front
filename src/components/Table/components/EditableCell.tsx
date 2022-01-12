import { useEffect, useState } from "react";
import { CellProps } from "react-table";

interface Data {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: string;
    subRows?: Data[] | undefined;
}

export const EditableCell = ({
    cell: { value: initialValue },
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
    editable,
}: CellProps<Data>) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value);
    };

    // If the initialValue is changed externall, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (!editable) {
        return `${initialValue}`;
    }

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
};
