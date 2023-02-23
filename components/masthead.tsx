import React, { useState } from "react";
import {Button, TextInput} from "@mantine/core";

function TextInputWithEditButton({ value, onSubmit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    function handleEditClick() {
        setIsEditing(true);
    }

    function handleSubmitClick() {
        onSubmit(inputValue);
        setIsEditing(false);
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    if (isEditing) {
        return (
            <div>
                <TextInput type="text" value={inputValue} onChange={handleInputChange} />
                <Button onClick={handleSubmitClick}>Submit</Button>
            </div>
        );
    }
        return (
            <div>
                <TextInput type="text" value={value} disabled />
                <Button onClick={handleEditClick}>Edit</Button>
            </div>
        );
}

export default TextInputWithEditButton;
