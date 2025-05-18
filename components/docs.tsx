import { useEffect, useRef, useState } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    Mark,
    Tooltip,
    Code, Alert, Space, Container, Divider, ActionIcon, Title, Badge, Stack,
} from '@mantine/core';
import {
    IconArrowBigTop,
    IconPin,
    IconX
} from '@tabler/icons';
import { directive } from '@babel/types';
import {all} from "deepmerge";

const useStyles = createStyles((theme) => ({

    inactiveHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    activeHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.gray[8], to: theme.colors.gray[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.gray[1], to: theme.colors.gray[2], deg: 225 }),
        h1: {
            color: theme.colorScheme === 'dark' ? theme.colors.blue[1] : theme.colors.blue[8],
        },
    },

    inactiveDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        border: '1px solid transparent',
        '&:hover': {
            border: `1px solid ${theme.colors.gray[5]}`,
            borderRadius: 5,
            // backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 20 }) : theme.fn.gradient({ from: theme.colors.gray[2], to: theme.colors.gray[1], deg: 225 }),
        },
    },

    activeDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        border: `1px solid ${theme.colors.blue[8]}`,
        borderRadius: 5,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.gray[9], to: theme.colors.gray[8], deg: 200 }) : theme.fn.gradient({ from: theme.colors.gray[1], to: theme.colors.gray[3], deg: 45 }),
        // backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[8], to: theme.colors.blue[8], deg: 20 }) : theme.fn.gradient({ from: theme.colors.blue[2], to: theme.colors.blue[1], deg: 225 }),
    },
}));

interface HeaderData {
    header: string;
    description: string;
    responseDirectives: ResponseDirective[];
}

interface ResponseDirective {
    directive: string,
    description: string,
    details: string
}

interface ColonDocsProps {
    headerMetaData: HeaderData[];
    focus: string;

    setFocus: Function;
    setDrawerOpened: Function;
}

export function ColonDocs({ headerMetaData, focus, setFocus, setDrawerOpened }: ColonDocsProps) {
    const [rows, setRows] = useState([]);
    const { classes, theme } = useStyles();
    const [lastFocus, setLastFocus] = useState('');
    const refs = useRef({});
    const viewport = useRef<HTMLDivElement>(null);

    const makeRows = () => {
        if (headerMetaData == null) {
            setRows([]);
            return;
        }
        const rowsBody = headerMetaData.map((header) => {
            const responseDirectives = header['response-directives'];
            return <Container
                ref={(el) => (refs.current[header.header.toLowerCase()] = el)}
              className={classes.inactiveHeader}
            > <div
              key={header.header}
            >
                <Group position="right" mt="md" mb="sm">
                </Group>
                <div
                  key={header.header}
                  onClick={(e) => {
                        e.preventDefault();
                        setFocus(`${header.header}$`);
                    }}
                >

                <Title size={24}> {header.header} </Title>
                <Space h="xs" />
                </div>

                <Text size="sm"> {header.description} </Text>
                <Space h="sm" />
              </div>
            {responseDirectives.length > 0 ?
                <div>
                <Title size="sm" gradient={{ from: theme.colors.gray[5], to: theme.colors.gray[9] }}> Response Directives </Title>
                    <Space h="xs" />
                <div>
                    {responseDirectives.map((directive) => {
                        if (directive == null || directive.directive == null) {
                            return <div />;
                        }
                        const directiveKey = [header.header.toLowerCase(), directive.directive.toLowerCase()].join('$');
                        return <div
                           key={directiveKey}
                           ref={(el) => (refs.current[directiveKey] = el)}
                           className={classes.inactiveDirective}
                           onClick={(e) => {
                               e.preventDefault();
                               if (directiveKey) {
                                   setFocus(directiveKey);
                               }
                             }}
                         >
                             <Badge
                                 color="gray"
                                 variant="outline"
                                 radius="sm"
                             >{directive.directive}</Badge>
                            <Space h="xs" />
                            <Text size="xs"> {directive.description} </Text>
                            <Text size="xs"> {directive.details} </Text>
                                </div>;
                        }
                    )}
                </div>
                </div>
            : ''}
            <Divider size="xs" />
            <Group position="right" mt="md" mb="sm" spacing="xs">
                <ActionIcon
                  variant="filled"
                  size="xs"
                  onClick={(e) => {
                      e.preventDefault();
                    setFocus(`${header.header.toLowerCase()}$`);
                }}
                >
                    <IconPin size={10} />
                </ActionIcon>
                <ActionIcon
                    variant="filled"
                    size="xs"
                    onClick={(e) => {
                        e.preventDefault();
                        viewport.current.scrollTo({ top: 0, behavior: 'smooth' });
                        setFocus('');
                    }}
                >
                    <IconArrowBigTop size={10} />
                </ActionIcon>
            </Group>
                   </Container>;
        });
        setRows(rowsBody);
    };

    useEffect(() => {
        makeRows();
    }, [headerMetaData]);

    function setClass(refString: string, className: string) {
        const ref = refs.current[refString?.toLowerCase()];
        if (ref != null) {
            ref.className = className;
        }
    }

    function focusAndScroll() {
        const [header, directive] = focus.split('$');
        const [lastHeader, lastDirective] = lastFocus.split('$');

        if (header != null && header !== '') {
            setClass(lastHeader, classes.inactiveHeader);
            setClass(header, classes.activeHeader);
            const directiveRef = refs.current[focus];
            // console.log("scrolling to directive ref", directiveRef);
            if (directiveRef != null) {
                directiveRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                setClass(lastFocus, classes.inactiveDirective);
                setClass(focus, classes.activeDirective);
            } else {
                const headerRef = refs.current[header];
                if (headerRef != null) {
                    headerRef.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
            setLastFocus(focus);
        }
    }

    useEffect(() => {
       if (focus !== lastFocus) {
           focusAndScroll();
       }
    }, [focus]);

    useEffect(() => {
        focusAndScroll();
    }, [rows]);

    return (
        <ScrollArea type="scroll" viewportRef={viewport}>
            <Group spacing="xs" position="left">
                <ActionIcon
                    mr={10}
                    variant="filled"
                    size="sm"
                    color="gray"
                    onClick={(e) => {
                        e.preventDefault();
                        setFocus('');
                        setDrawerOpened(false);
                    }}
                >
                    <IconX size={20} />
                </ActionIcon>

                <Text
                    size={24}
                    sx={{
                        fontFamily: 'Monaco, monospace',
                        fontWeight: 600,
                    }}
                    variant="gradient"
                    gradient={{ from: 'gray', to: 'gray', deg: 160 }}
                >
                    <span user-select="none">
                    HTTP:DOCS
                    </span>
                </Text>

            </Group>
            <Divider size="xs" mt={10} mb={30} color="gray" />
            {rows}
        </ScrollArea>
    );
}
