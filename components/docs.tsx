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
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.grape[1], to: theme.colors.blue[1], deg: 200 }),
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
    setDrawerOpened: Function;
}

export function ColonDocs({ headerMetaData, focus, setDrawerOpened }: ColonDocsProps) {
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
                const inFocus = header.header.toLowerCase() === toFocus.toLowerCase();

                return (
                    <Container
                      key={header.header}
                      className={inFocus ? classes.activeHeader : classes.inactiveHeader}
                      // ref={inFocus ? focusRef : noFocusRef}
                    >
                        <Group position="right" mt="md" mb="sm">
                            {setDrawerOpened && <ActionIcon
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDrawerOpened(false);
                                    setInnerFocus(header.header);
                                }}
                            >
                                <IconX size={12} />
                            </ActionIcon>}
                        </Group>

                        <h2> {header.header} </h2>
                    <p> {header.description} </p>
                    <h3> Response Directives </h3>
                    {responseDirectives ? <ul>
                            {responseDirectives.map((directive) => (
                                <li key={directive.directive}>
                                    <h4> {directive.directive} </h4>
                                    <p> {directive.description} </p>
                                    <p> {directive.details} </p>
                                </li>
                            ))}
                                          </ul>
                    : 'No response directives'}
                    <Divider size="xs" />
                    <Group position="right" mt="md" mb="sm">
                        <ActionIcon
                          variant="filled"
                          onClick={(e) => {
                              e.preventDefault();
                            setFocus(header.header);
                        }}
                        >
                            <IconUpload size={18} />
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
        if (focus != null && focusRef.current != null) {
            focusRef.current.scrollIntoView();
            console.log('scrolling to', focusRef.current);
        }
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