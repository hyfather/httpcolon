import React, {createRef, useEffect, useRef, useState} from 'react';
import { ActionIcon, Button, Container, createStyles, Group, NativeSelect, TextInput } from '@mantine/core';
import {
    IconCodeCircle,
    IconEdit,
    IconWorld,
    IconX
} from '@tabler/icons';
import {useForm} from "@mantine/form";

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

function ColonizeFormV2({ inputValue, method, onSubmit, isEditing, setIsEditing, setInputValue }) {
    // const [inputValue, setInputValue] = useState(value);
    const { classes, theme } = useStyles();
    const InputRef = useRef<HTMLInputElement>(null);
    const [methodValue, setMethodValue] = useState(method || 'GET');
    const form = useForm({initialValues: { url: '', method: '' }});

    function handleEditClick() {
        // setInputValue(value);
        InputRef.current?.focus();
    }

    function handleSubmitClick() {
        const strippedUrl = inputValue.replace(/(^\w+:|^)\/\//, '').split('?')[0];
        onSubmit(strippedUrl, methodValue || method);
        setIsEditing(false);
    }

    function backOut() {
        setIsEditing(false);
        // setInputValue(value);
        setMethodValue(method);
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    useEffect(() => {
        if (isEditing) {
            handleEditClick();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <div>
                <form onSubmit={form.onSubmit((values) => {
                    console.log('reslugging', inputValue);
                    const strippedUrl = inputValue.replace(/(^\w+:|^)\/\//, '').split('?')[0];
                    setInputValue(strippedUrl);
                    setIsEditing(false);
                    onSubmit(strippedUrl, methodValue || method);
                })}
                >
                <Group spacing="xs">
                    <TextInput
                      size="sm"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      ref={InputRef}
                      icon={<IconWorld size={18} />}
                      rightSection={
                        <Container>
                          <ActionIcon onClick={backOut} size="xs" variant="outline" color="gray">
                                <IconX size={12} />
                          </ActionIcon>
                        </Container>}
                    />
                    <NativeSelect size="sm"
                                  icon={<IconCodeCircle size={18} />}
                                  variant="filled" value={methodValue} data={['GET', 'POST', 'PUT', 'DELETE']} onChange={(event) => event.currentTarget.value && setMethodValue(event.currentTarget.value)} />
                    <Button size="sm" type="submit" variant="gradient" gradient={{ from: theme.colors.blue[10], to: theme.colors.grape[7] }}>
                        GO
                    </Button>
                </Group>
                </form>
            </div>
        );
    }
        return (
            <div>
                <Group spacing="xs">
                    <TextInput
                      size="sm"
                      type="text"
                      value={inputValue}
                      readOnly
                      color="grape"
                      variant="filled"
                      icon={<IconWorld size={18} />}
                      rightSection={
                                <ActionIcon onClick={() => setIsEditing(true)} size="xs" variant="outline" color="grape">
                                    <IconEdit size={12} />
                                </ActionIcon>}
                    />
                </Group>

            </div>
        );
}

export default ColonizeFormV2;
