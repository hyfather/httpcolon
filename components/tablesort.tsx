import { useEffect, useRef, useState } from 'react';
import { showNotification } from '@mantine/notifications';
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
  Code,
  Alert,
  Space,
  Container,
  Badge,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconCopy,
  IconX,
  IconArrowUp,
} from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  searchBar: {
    marginLeft: 100,
    marginRight: 100,
  },

  sticky: {
    position: 'fixed',
    top: '40px',
    left: 0,
    right: 0,
    width: 400,
    zIndex: 999,
    padding: '10px 0',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    background: theme.colors.gray[0],
  },

  directiveMark: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.grape[8]
        : theme.colors.grape[1],
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[9],
  },

  headerMark: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.blue[8]
        : theme.colors.blue[1],
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[2]
        : theme.colors.gray[9],
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
  directive: string;
  description: string;
  details: string;
}

interface TableSortProps {
  data: RowData[];
  updateTable: string;
  headerMetaData: HeaderData[];
  setHeaderMetadata: Function;
  setDrawerOpened: Function;
  setDrawerFocus: Function;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
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

export function TableSort(
  {
    data,
    headerMetaData,
    setHeaderMetadata,
    updateTable,
    setDrawerOpened,
    setDrawerFocus,
  }: TableSortProps,
  { sortField }: any
) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(sortField);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { classes } = useStyles();
  const [isSticky, setIsSticky] = useState(false);
  const [isStickyHidden, setIsStickyHidden] = useState(false);
  const headerRef = useRef(null);
  const tooltipRef = useRef(Tooltip);
  const [tooltipRefAssigned, setTooltipRefAssigned] = useState(false);

  //   const [refreshTable, setRefreshTable] = useState("");

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    // console.log("disabled");
    // setSortedData(sortData(data, { sortBy: field, reversed, search }));
    makeRows();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    makeRows();
  };

  const makeRows = () => {
    if (data == null) {
      setRows([]);
      return;
    }
    const sData = sortData(data, {
      sortBy: null,
      reversed: reverseSortDirection,
      search,
    });

    setSortedData(sData);

    const headerDB = headerMetaData;
    if (sData != null && headerDB != null) {
      const rows_ = sData.map((row) => {
        let dInfo;
        headerDB.forEach((d) => {
          if (d.header.toLowerCase() === row.header.toLowerCase()) {
            dInfo = d;
          }
        });
        if (dInfo == null || dInfo['response-directives'] == null) {
          const isExpanded = expandedRows[row.header];
          const tooLong = row.value.length > 100;
          const valueElement =
            !tooLong || isExpanded ? (
              <Code>{row.value}</Code>
            ) : (
              <Code>
                {row.value.slice(0, 100)}...
                <span
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setExpandedRows((prev) => ({
                      ...prev,
                      [row.header]: true,
                    }));
                  }}
                >
                  more
                </span>
              </Code>
            );

          return (
            <tr
              key={row.header}
              onClick={() => {
                navigator.clipboard.writeText(`${row.header}: ${row.value}`);
                showNotification({ message: 'Copied', autoClose: 2000 });
              }}
            >
              <td>
                <Code>{row.header}</Code>
              </td>
              <td>{valueElement}</td>
            </tr>
          );
        }

        const isExpanded = expandedRows[row.header];
        const tooLong = row.value.length > 100;
        let valueElement;
        if (!isExpanded && tooLong) {
          valueElement = (
            <Code>
              {row.value.slice(0, 100)}...
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setExpandedRows((prev) => ({ ...prev, [row.header]: true }));
                }}
              >
                more
              </span>
            </Code>
          );
        } else {
          const responseDirectives = dInfo['response-directives'];
          const tokens = row.value.split(/([\s,=";]+)/);
          const markedUp = tokens.map((token) => {
            let tooltip;
            responseDirectives?.forEach((d) => {
              if (
                d.directive.length > 1 &&
                d.directive.toLowerCase() === token.toLocaleLowerCase()
              ) {
                tooltip = (
                  <Tooltip
                    label={d.description}
                    withArrow
                    inline
                    multiline
                    color="grape"
                    position="bottom"
                    width={250}
                    ref={tooltipRefAssigned ? null : tooltipRef}
                  >
                    <Mark
                      className={classes.directiveMark}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDrawerOpened(true);
                        setDrawerFocus(
                          `${row.header.toLowerCase()}$${d.directive.toLowerCase()}`
                        );
                      }}
                    >
                      {token}
                    </Mark>
                  </Tooltip>
                );
              }
            });
            if (!tooltipRefAssigned) {
              setTooltipRefAssigned(true);
            }
            if (tooltip) {
              return tooltip;
            }
            return <span>{token}</span>;
          });

          valueElement = (
            <div
              sx={{
                width: '400px',
                overflow: 'auto',
              }}
            >
              <Code>{markedUp}</Code>
            </div>
          );
        }

        return (
          <tr
            key={row.header}
            onClick={() => {
              navigator.clipboard.writeText(`${row.header}: ${row.value}`);
              showNotification({ message: 'Copied', autoClose: 2000 });
            }}
          >
            <td>
              <Code>
                <Tooltip
                  label={dInfo.description}
                  withArrow
                  inline
                  multiline
                  color="blue"
                  position="right"
                  width={250}
                >
                  <Mark
                    className={classes.headerMark}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDrawerOpened(true);
                      setDrawerFocus(`${row.header.toLowerCase()}$`);
                    }}
                  >
                    {row.header}
                  </Mark>
                </Tooltip>
              </Code>
            </td>
            <td>{valueElement}</td>
          </tr>
        );
      });
      setRows(rows_);
    }
  };

  useEffect(() => {
    if (tooltipRef.current) {
      // console.log('tooltipRef.current', tooltipRef.current);
      tooltipRef.current.opened = true;
    }
  }, [tooltipRef]);

  useEffect(() => {
    console.log('updating table');
    makeRows();
  }, [data, updateTable, headerMetaData]);

  useEffect(() => {
    makeRows();
  }, [expandedRows]);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current.offsetHeight;
      const scrollPosition = window.scrollY;

      if (scrollPosition > headerHeight + 300) {
        setIsSticky(true);
        if (scrollPosition > headerHeight + 350) {
          // console.log("zz", scrollPosition);
        } else {
          window.scrollTo(0, headerHeight + 400);
        }
      } else {
        setIsSticky(false);
        window.scrollTo(0, 0);
      }
    };

    // window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollArea>
      <Container
        className={isSticky && !isStickyHidden ? classes.sticky : ''}
        ref={headerRef}
      >
        <Stack>
          {isSticky ? (
            <Group position="apart">
              <Badge variant="dot" color="green" size="md" radius="sm" ml={20}>
                GET www.facebook.com
              </Badge>
              <Group spacing="xs">
                <ActionIcon
                  onClick={() => {
                    window.scroll(0, 0);
                  }}
                  variant="filled"
                  size="xs"
                >
                  <IconArrowUp size={14} stroke={1.5} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    setIsStickyHidden(true);
                  }}
                  mr={20}
                  variant="filled"
                  size="xs"
                >
                  <IconX size={14} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Group>
          ) : null}

          <TextInput
            placeholder="Search headers"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            className={classes.searchBar}
            onChange={handleSearchChange}
            size="xs"
          />
        </Stack>
      </Container>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        highlightOnHover
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
              <td colSpan="auto" />
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
