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
    Code, Alert, Space, Container, Divider, ActionIcon, Title, Badge,
} from '@mantine/core';
import {IconCross, IconEdit, IconPin, IconRefresh, IconUpload, IconX} from '@tabler/icons';
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
    const allRefs = {};

    if (headerMetaData != null && headerMetaData.length > 0) {
        if (headerMetaData.length !== Object.keys(allRefs).length) {
            headerMetaData.forEach((header) => {
                allRefs[header.header.toLowerCase()] = useRef<HTMLElement>(null);
                header['response-directives'].forEach((directive) => {
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
                const responseDirectives = header['response-directives'];
                const toFocus = focus;
                const focusHeader = focus.toLowerCase().split('$')[0];
                const focusDirective = toFocus.toLowerCase().split('$')[1];

                return <Container
                  ref={allRefs[header.header]}
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
                            setFocus(`${header.header}$}`);
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
                             const inFocusDirective = directive.directive.toLowerCase() === focusDirective;
                             return <div
                               key={directive.directive}
                               ref={allRefs[`${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`]}
                               className={classes.inactiveDirective}
                               onClick={(e) => {
                                   e.preventDefault();
                                   // console.log('directive', directive, directive.directive.toLowerCase(), header, directive.directive.toLowerCase() === focusHeader[1]);
                                   if (directive != null && directive.directive != null) {
                                       setFocus(`${header.header.toLowerCase()}$${directive.directive.toLowerCase()}`);
                                   }
                                 }}
                             >
                                 <Badge
                                     color="blue"
                                     variant="filled"
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
    }, [headerMetaData]);

    function setClass(refString: string, className: string) {
        console.log("setting class", refString, className, allRefs[refString.toLowerCase()]);

        const ref = allRefs[refString?.toLowerCase()];
        if (ref != null && ref.current != null) {
            ref.current.className = className;
        }
    }

    function focusAndScroll() {
        const [header, directive] = focus.split('$');
        const [lastHeader, lastDirective] = lastFocus.split('$');

        console.log('focusz', focus, header, directive, lastDirective);
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
    }

    useEffect(() => {
       if (focus !== lastFocus) {
           focusAndScroll();
       }
    }, [focus]);

    return (<ScrollArea>
            <Container
              sx={{
                    position: 'fixed',
                }}
              ml={-25}
              mt={-10}
            >
                <ActionIcon
                    variant="filled"
                    size="lg"
                    color="gray"
                    onClick={(e) => {
                        e.preventDefault();
                        setDrawerOpened(false);
                    }}
                >
                    <IconX size={20} />
                </ActionIcon>
            </Container>
            {rows}
            </ScrollArea>);
}
