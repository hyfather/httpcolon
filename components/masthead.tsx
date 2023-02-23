import React, { createRef, useRef, useState } from 'react';
import { ActionIcon, Button, createStyles, Group, NativeSelect, TextInput } from '@mantine/core';
import {IconDownload, IconEdit, IconWorld, IconWorldLatitude, IconX} from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => ({
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
        },

        drawer: {
            overflowY: 'auto',
        },
    }));

function TextInputWithEditButton({ value, method, onSubmit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const { classes, theme } = useStyles();
    const InputRef = useRef<HTMLInputElement>(null);
    const [methodValue, setMethodValue] = useState(method || 'GET');

    function handleEditClick() {
        setIsEditing(true);
        setInputValue(value);
        InputRef.current?.focus();
    }

    function handleSubmitClick() {
        onSubmit(inputValue, methodValue);
        setIsEditing(false);
    }

    function backOut() {
        setIsEditing(false);
        setInputValue(value);
        setMethodValue(method);
    }


    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    if (isEditing) {
        return (
            <div>
                <Group spacing="xs">
                    <TextInput
                      size="xs"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      ref={InputRef}
                      rightSection={
                            <ActionIcon onClick={backOut} size="xs" variant="outline" color="grape">
                                <IconX size={12} />
                            </ActionIcon>}
                    />
                    <NativeSelect size="xs" variant="filled" value={methodValue} data={['GET', 'POST', 'PUT', 'DELETE']} onChange={(event) => event.currentTarget.value && setMethodValue(event.currentTarget.value)} />
                    <Button size="xs" type="submit" variant="gradient" gradient={{ from: theme.colors.blue[10], to: theme.colors.grape[7] }} onClick={handleSubmitClick}>
                        GO
                    </Button>

                </Group>
            </div>
        );
    }
        return (
            <div>
                <Group spacing="xs">
                    <TextInput
                      size="xs"
                      type="text"
                      value={value}
                      readOnly
                      color="grape"
                      rightSection={
                            <ActionIcon onClick={handleEditClick} size="xs" variant="outline" color="grape">
                                <IconEdit size={12} />
                            </ActionIcon>}
                    />
                </Group>

            </div>
        );
}

export default TextInputWithEditButton;
