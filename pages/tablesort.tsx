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
  Code
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons';
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

interface TableSortProps {
  data: RowData[];
    updateTable: string;
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

export function TableSort({ data, updateTable }: TableSortProps, { sortField }: any) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(sortField);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [rows, setRows] = useState([]);
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
    setSortedData(sortData(data, { sortBy: sortBy, reversed: reverseSortDirection, search: search }));
    if (sortedData != null) {
        const rows_ = sortedData.map((row) => {
            return (<tr key={row.header}>
            <td><Code>{row.header}</Code></td>
            <td><Code>{row.value}</Code></td>
            </tr>);});
        setRows(rows_);
    }
  };

  useEffect(() => {
    console.log("updating table");
    makeRows();
  }, [updateTable]);

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
              Header
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