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
  Code, Alert
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

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface RowData {
  header: string;
  value: string;
  size: number;
}

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

interface TableSortProps {
  data: RowData[];
  updateTable: string;
  headerData: HeaderData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function TableSort({ data, headerData, updateTable }: TableSortProps, { sortField }: any) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(sortField);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [rows, setRows] = useState([]);
  const [headerMetaData, setHeaderMetaData] = useState(headerData);
  const { classes } = useStyles();

//   const [refreshTable, setRefreshTable] = useState("");

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    // setSortedData(sortData(data, { sortBy: field, reversed, search }));
    makeRows();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    // setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    makeRows();
  };

  const makeRows = () => {
    console.log("makeRows", data, sortedData);
    if (data == null) {
        setRows([]);
        return;
    }
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: search }));

    const headerDB = headerMetaData;
    console.log("headerDb", headerDB);

    if (sortedData != null && headerDB != null) {
      const rows_ = sortedData.map((row) => {
            let dInfo;
            headerDB.forEach((d) => {
              if (d.header.toLowerCase() === row.header.toLowerCase()) {
                dInfo = d;
              }
            });
            if (dInfo == null || dInfo['response-directives'] == null) {
              return (
                  <tr key={row.header}>
                    <td><Code>{row.header}</Code></td>
                    <td><Code>{row.value}</Code></td>
                  </tr>);
            }

            const responseDirectives = dInfo['response-directives'];
            const tokens = row.value.split(/([\s,=";]+)/);
            const markedUp = tokens.map((token) => {
              console.log('token', token);
              let tooltip;
              responseDirectives?.forEach((d) => {
                // eslint-disable-next-line max-len
                if (d.directive.length > 1 && d.directive.toLowerCase() === token.toLocaleLowerCase()) {
                  // console.log('found', token, d);
                  tooltip =
                      <Tooltip
                        label={d.description}
                        withArrow
                        inline
                        multiline
                        color="grape"
                        width={250}
                      >
                        <Mark>{token}</Mark>
                      </Tooltip>;
                }
              });
              if (tooltip) {
                return tooltip;
              }
              return <span>{token}</span>;
            });
            // console.log('markedUp', markedUp);

            return (
                <tr key={row.header}>
                  <td><Code><Tooltip label={dInfo["description"]} withArrow inline multiline color="grape"
                               position="right" width={250}><Mark>{row.header}</Mark></Tooltip></Code></td>
                  <td><Code>{markedUp}</Code></td>
                </tr>);
          }
      );
      setRows(rows_);
    }
  };

  useEffect(() => {
    console.log("updating table");
    makeRows();
  }, [updateTable, headerData]);

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search headers"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        className={classes.searchBar}
        onChange={handleSearchChange}
      />
      <Alert
        icon={<IconInfoSquareRounded size={14} stroke={1.5} />}
        color="grape"
        variant={"light"}
        withCloseButton
        onClose={() => {
            console.log('todo: close');
        }}
      >
        <Text size="sm">
            <strong>Tip:</strong> hover on highlighted words to see the description.
        </Text>
      </Alert>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        highlightOnHover={true}
        striped={true}
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === 'header'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('header')}
            >
              HTTP Header
            </Th>
            <Th
              sorted={sortBy === 'value'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('value')}
            >
              Value
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan="auto">
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}