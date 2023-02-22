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
    Code, Alert, Space, Container, Divider, ActionIcon,
} from '@mantine/core';
import {IconCross, IconEdit, IconRefresh, IconUpload, IconX} from '@tabler/icons';

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
        // backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.grape[1], to: theme.colors.blue[1], deg: 10 }),
    },

    activeDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.grape[1], to: theme.colors.grape[2], deg: 225 }),
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
    const [innerFocus, setInnerFocus] = useState('');
    const { classes } = useStyles();
    const focusRef = useRef<HTMLElement>(null);
    const noFocusRef = useRef<HTMLElement>(null);

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
                let toFocus;
                if (innerFocus !== '') {
                    toFocus = innerFocus;
                } else {
                    toFocus = focus;
                }
                const toFocusMatchers = toFocus.toLowerCase().split('$');
                const inFocusHeader = header.header.toLowerCase() === toFocusMatchers[0];

                return (
                    <Container
                      key={header.header}
                      className={inFocusHeader ? classes.activeHeader : classes.inactiveHeader}
                      // ref={inFocusHeader ? focusRef : noFocusRef}
                    >
                        <Group position="right" mt="md" mb="sm">
                            {setDrawerOpened && <ActionIcon
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDrawerOpened(false);
                                    setInnerFocus(header.header + '$');
                                }}
                            >
                                <IconX size={12} />
                                                </ActionIcon>}
                        </Group>

                        <h2> {header.header} </h2>
                    <p> {header.description} </p>
                    <h3> Response Directives </h3>
                    {responseDirectives ? <ul>
                            {responseDirectives.map((directive) => {
                                // console.log("directive", directive, directive.directive.toLowerCase(), toFocusMatchers[1], directive.directive.toLowerCase() === toFocusMatchers[1]);
                                return <li key={directive.directive}
                                    className={inFocusHeader && directive.directive.toLowerCase() === toFocusMatchers[1] ? classes.activeDirective : classes.inactiveDirective}
                                >
                                    <h4> {directive.directive} </h4>
                                    <p> {directive.description} </p>
                                    <p> {directive.details} </p>
                                       </li>;
                            })}
                                          </ul>
                    : 'No response directives'}
                    <Divider size="xs" />
                    <Group position="right" mt="md" mb="sm">
                        <ActionIcon
                          variant="filled"
                          size="xs"
                          onClick={(e) => {
                              e.preventDefault();
                            setInnerFocus(header.header + '$host');
                        }}
                        >
                            <IconUpload size={10} />
                        </ActionIcon>
                    </Group>
                    </Container>);
            });
            console.log('rows_', rows_);
            setRows(rows_);
        }
    };


    useEffect(() => {
        console.log('updating docs', focus);
        makeRows();
        // if (focus != null && focusRef.current != null) {
        //     focusRef.current.scrollIntoView();
        //     console.log('scrolling to', focusRef.current);
        // }
    }, [headerMetaData, focus]);

    useEffect(() => {
        console.log('updating inner focus', innerFocus);
        makeRows();
        if (innerFocus != '' && innerFocus.current != null) {
            innerFocus.current.scrollIntoView();
            console.log('scrolling to', innerFocus.current);
        }
        // setInnerFocus('');
    }, [innerFocus]);

    return (
        <ScrollArea
          type="always"
        >
            {rows}
        </ScrollArea>
    );
}
