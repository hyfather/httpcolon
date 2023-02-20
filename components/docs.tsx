import { useEffect, useState } from 'react';
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
    Code, Alert, Space
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconInfoSquareRounded } from '@tabler/icons';
import { useForceUpdate } from '@mantine/hooks';
import { ClassNames } from '@emotion/react';

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0 !important',
    },

    control: {
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    searchBar: {
        marginLeft: 100,
        marginRight: 100,
    },

    directiveMark: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.grape[8] : theme.colors.grape[1],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[9],
    },

    headerMark: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[1],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[9],
    },

    icon: {
        width: 21,
        height: 21,
        borderRadius: 21,
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
}

export function ColonDocs({ headerMetaData }: ColonDocsProps) {
    const [rows, setRows] = useState([]);
    // const [headerMetaData, setHeaderMetaData] = useState(headerData);
    const { classes} = useStyles();

    const makeRows = () => {
        console.log("makeDocs", headerMetaData);
        if (headerMetaData == null) {
            setRows([]);
            return;
        }
        const headerDB = headerMetaData;

        if (headerDB != null) {
            const rows_ = headerDB.map((header) => (<p> {header.header} </p>));
            console.log("rows_", rows_);
            setRows(rows_);
        }
    };

    useEffect(() => {
        console.log("updating table");
        makeRows();
    }, [headerMetaData]);

    return (
        <ScrollArea>
            <Space h={20} />
                {rows.length > 0 ? (
                    rows
                ) : null}
        </ScrollArea>
    );
}
