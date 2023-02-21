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
    Code, Alert, Space, Container
} from '@mantine/core';

const useStyles = createStyles((theme) => ({

    inactiveHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    activeHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.grape[0],
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
}

export function ColonDocs({ headerMetaData, focus }: ColonDocsProps) {
    const [rows, setRows] = useState([]);
    // const [active, setActive] = useState(activeHeader);
    const { classes } = useStyles();
    const focusRef = useRef(null);

    const makeRows = () => {
        console.log("makeDocs", headerMetaData);
        if (headerMetaData == null) {
            setRows([]);
            return;
        }
        const headerDB = headerMetaData;

        if (headerDB != null) {
            const rows_ = headerDB.map((header) => {
                // console.log("header", header, header['response-directives']);
                const responseDirectives = header['response-directives'];
                const inFocus = header.header === focus;
                return (
                    <Container
                      key={header.header}
                      className={inFocus ? classes.activeHeader : classes.inactiveHeader}
                      ref={inFocus ? focusRef : null}
                    >
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
                    : "No response directives"}
                        </Container>);
            });
            console.log("rows_", rows_);
            setRows(rows_);
        }
    };

    useEffect(() => {
        console.log('updating docs', focus);
        makeRows();
        if (focus != null && focusRef.current != null) {
            focusRef.current.scrollIntoView();
            console.log("scrolling to", focusRef.current);
        }
    }, [headerMetaData, focus]);

    return (
        <ScrollArea
          type="always"
        >
            {rows}
        </ScrollArea>
    );
}
