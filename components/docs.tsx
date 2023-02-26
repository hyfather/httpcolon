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
    Code, Alert, Space, Container, Divider, ActionIcon, Title,
} from '@mantine/core';
import { IconCross, IconEdit, IconRefresh, IconUpload, IconX } from '@tabler/icons';
import { directive } from '@babel/types';

const useStyles = createStyles((theme) => ({

    inactiveHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    activeHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.blue[1], to: theme.colors.blue[2], deg: 225 }),
    },

    inactiveDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        '&:hover': {
            backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 20 }) : theme.fn.gradient({ from: theme.colors.blue[1], to: theme.colors.grape[2], deg: 225 }),
        },
    },

    activeDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[8], to: theme.colors.blue[8], deg: 20 }) : theme.fn.gradient({ from: theme.colors.grape[1], to: theme.colors.grape[2], deg: 225 }),
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
    const noFocusRef = useRef<HTMLElement>(null);
    const allRefs = {};

    if (headerMetaData != null && headerMetaData.length > 0) {
        if (headerMetaData.length !== Object.keys(allRefs).length) {
            headerMetaData.forEach((header) => {
                console.log('making ref for header', header.header);
                allRefs[header.header.toLowerCase()] = useRef<HTMLElement>(null);
                header['response-directives'].forEach((directive) => {
                    console.log('making ref for directive', `${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`);
                    allRefs[`${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`] = useRef<HTMLElement>(null);
                });
            });
        }
    }

    const makeRows = () => {
        console.log('makeDocs', headerMetaData);
        if (headerMetaData == null) {
            setRows([]);
            return;
        }
        const headerDB = headerMetaData;

        if (headerDB != null) {
            const rows_ = headerDB.map((header) => {
                // console.log("header", header, header['response-directives']);
                const responseDirectives = header['response-directives'];
                const toFocus = focus;
                const focusHeader = focus.toLowerCase().split('$')[0];
                const focusDirective = toFocus.toLowerCase().split('$')[1];
                const directiveInFocus = focusDirective != null && focusDirective !== '';
                const inFocusHeader = header.header.toLowerCase() === focusHeader;

                return <Container
                  ref={allRefs[header.header]}
                  className={classes.inactiveHeader}
                > <div
                  key={header.header}
                >
                    <Group position="right" mt="md" mb="sm">
                        {setDrawerOpened && <ActionIcon
                          variant="outline"
                          onClick={(e) => {
                                e.preventDefault();
                                setDrawerOpened(false);
                            }}
                        >
                                                <IconX size={12} />
                                            </ActionIcon>}
                    </Group>

                    <div
                      key={header.header}
                      onClick={(e) => {
                            e.preventDefault();
                            console.log('directive', directive, directive.directive.toLowerCase(), header, directive.directive.toLowerCase() === focusHeader[1]);
                            setFocus(`${header.header}$${directive.directive.toLowerCase()}`);
                        }}
                    >

                    <Title size={24}> {header.header} </Title>
                    <Space h="xs" />
                    </div>

                    <Text size="sm"> {header.description} </Text>
                    <Space h="sm" />
                  </div>
                {responseDirectives ?
                    <div>
                    <Title size="sm" gradient={{ from: theme.colors.gray[5], to: theme.colors.gray[9] }}> Response Directives </Title>
                    <div>
                        {responseDirectives.map((directive) => {
                             const inFocusDirective = directive.directive.toLowerCase() === focusDirective;
                             return <div
                               key={directive.directive}
                               ref={allRefs[`${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`]}
                               className={classes.inactiveDirective}
                               onClick={(e) => {
                                   e.preventDefault();
                                   console.log('directive', directive, directive.directive.toLowerCase(), header, directive.directive.toLowerCase() === focusHeader[1]);
                                    setFocus(`${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`);
                                 }}
                             >
                                <Title size="md"> {directive.directive} </Title>
                                <Space h="xs" />
                                <Text size="xs"> {directive.description} </Text>
                                <Text size="xs"> {directive.details} </Text>
                                <Divider size="xs" color="gray" />
                                    </div>;
                            }
                        )}
                    </div>
                    </div>
                : 'No response directives'}
                <Divider size="xs" />
                <Group position="right" mt="md" mb="sm">
                    <ActionIcon
                      variant="filled"
                      size="xs"
                      onClick={(e) => {
                          e.preventDefault();
                        setFocus(`${header.header}$`);
                    }}
                    >
                        <IconUpload size={10} />
                    </ActionIcon>
                </Group>
                       </Container>;
            });
            console.log('rows_', rows_);
            setRows(rows_);
        }
    };

    useEffect(() => {
        console.log('updating docs');
        makeRows();
        setLastFocus('cache-control$private');
    }, [headerMetaData]);

    function setClass(refString: string, className: string) {
        const ref = allRefs[refString.toLowerCase()];
        if (ref != null && ref.current != null) {
            ref.current.className = className;
        }
    }

    useEffect(() => {
        const [header, directive] = focus.split('$');
        const [lastHeader, lastDirective] = lastFocus.split('$');

        console.log('focus', focus, header, directive, lastDirective);
        if (header != null && header !== '') {
            setClass(lastHeader, classes.inactiveHeader);
            setClass(header, classes.activeHeader);
            const directiveRef = allRefs[focus];
            if (directiveRef != null && directiveRef.current != null) {
                directiveRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                setClass(lastFocus, classes.inactiveDirective);
                setClass(focus, classes.activeDirective);
            } else {
                const headerRef = allRefs[header];
                if (headerRef != null && headerRef.current != null) {
                    headerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
            setLastFocus(focus);
        }
    }, [focus]);

    return (<ScrollArea>
            {rows}
            </ScrollArea>);
}
