import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import {
    IconClock,
    IconPlus,
    IconMoon,
    IconSun,
    IconBook, IconEdit, IconHistory, IconCross, IconX,
} from '@tabler/icons';
import { Analytics } from '@vercel/analytics/react';

import {
    AppShell,
    Header,
    Button,
    Avatar,
    Group,
    Text,
    createStyles, SegmentedControl,
    Center,
    useMantineColorScheme,
    Container,
    Space,
    useMantineTheme,
    Drawer, MediaQuery, Badge, TextInput, ActionIcon, Aside, Transition,
} from '@mantine/core';

import { motion } from 'framer-motion';
import { TableSort } from '../components/tablesort';
import { FooterLinks } from '../components/footer';
import { TaskCard } from '../components/taskcard';
import { Explore } from '../components/explore';
import { ColonizeForm } from '../components/colonize';
import { ColonNavbar } from '../components/navbar';
import { ColonDocs } from '../components/docs';
import ColonizeFormV2, { ColonizeMethodForm } from '../components/masthead';

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        drawer: {
            overflowY: 'auto',
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginBottom: 80,
            marginTop: theme.spacing.md,
            // height: 500,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            },
        },

        links: {
            marginLeft: -theme.spacing.md,
            marginRight: -theme.spacing.md,
          },

          linksInner: {
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.xl,
          },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: 'grape' })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: 'grape' }).color,
                },
            },
        },

        tableRow: {
            padding: theme.spacing.xl,
            margin: theme.spacing.xl,
        },

        tableKey: {
            textAlign: 'right',
            fontFamily: 'Monaco, monospace',
            fontSize: theme.fontSizes.md,
        },

        tableValue: {
            // textAlign: 'right',
            fontFamily: 'Monaco, monospace',
            fontSize: theme.fontSizes.sm,
        },

        card: {
            // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            width: 400,
            backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[9], to: theme.colors.blue[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.grape[1], to: theme.colors.blue[1], deg: 200 }),
            fontSize: theme.fontSizes.sm,
            // color: theme.white,
        },

        label: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
            lineHeight: 1,
        },

        lead: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1,
        },

        inner: {
            display: 'flex',

            [theme.fn.smallerThan(350)]: {
                flexDirection: 'column',
            },
        },

        ring: {
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',

            [theme.fn.smallerThan(350)]: {
                justifyContent: 'center',
                marginTop: theme.spacing.md,
            },
        },

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

        navbar: {
            zIndex: 'unset',
        },

        icon: {
            width: 21,
            height: 21,
            borderRadius: 21,
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        leftButtons: {
            paddingRight: '10px',
            marginRight: '10px',
        },

        inputBox: {
            width: '500px',
        },

        logo: {
            background: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[3], to: theme.colors.blue[3], deg: 200 }) : theme.colors.gray[0],
            borderStyle: 'solid',
            borderWidth: theme.colorScheme === 'dark' ? '4px' : '1px',
            borderImage: 'linear-gradient(45deg, #E599F7, #74C0FC) 1',
        },
    };
});

function base64Encode(str) {
    const buffer = Buffer.from(str, 'utf-8');
    return buffer.toString('base64');
}

function getResponseColor(statusCode: number) {
    if (statusCode >= 200 && statusCode < 300) {
        return 'green';
    } if (statusCode >= 300 && statusCode < 400) {
        return 'yellow';
    } if (statusCode >= 400 && statusCode < 500) {
        return 'red';
    } if (statusCode >= 500) {
        return 'red';
    }
}

function getLatencyColor(latencyMS: number) {
    if (latencyMS < 100) {
        return 'green';
    } if (latencyMS >= 100 && latencyMS < 500) {
        return 'yellow';
    } if (latencyMS >= 500) {
        return 'red';
    }
}

export default function HomePage(props) {
    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [redirect, setRedirect] = useState('');
    const [methodValue, setMethodValue] = useState('GET');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);
    const [navLinks, setNavLinks] = useState([]);
    const [slugLoader, setSlugLoader] = useState<number>(0);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('');
    const [refreshActive, setRefreshActive] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const colonizeButtonRef = useRef<HTMLButtonElement>(null);
    const [methodRef, methodDropdown] = useRef<HTMLButtonElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const theme = useMantineTheme();
    const [updateTable, setUpdateTable] = useState('');
    const [headerData, setHeaderData] = useState([]);
    const [baseURL, setBaseURL] = useState<string>('');
    const [copyURL, setCopyURL] = useState<string>('');
    const router = useRouter();
    const [slug, setSlug] = useState(router.query.slug);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [drawerFocus, setDrawerFocus] = useState('');
    const [eValue, setEValue] = useState('');
    const [colonizeFormEditable, setColonizeFormEditable] = useState(false);
    const [navOpened, setNavOpened] = useState(false);
    // const refreshURL = router.query["refresh"] ? "?refresh=true" : ""

    function openDocs() {
        if (navOpened) {
            setNavOpened(false);
        }
        setDrawerOpened(true);
    }

    function openNav() {
        if (drawerOpened) {
            setDrawerOpened(false);
        }
        setNavOpened(true);
    }

    function toggleDocs() {
        if (navOpened && !drawerOpened) {
            setNavOpened(false);
        }
        setDrawerOpened(!drawerOpened);
    }

    function toggleNav() {
        if (drawerOpened && !navOpened) {
            setDrawerOpened(false);
        }
        setNavOpened(!navOpened);
    }

    const makeAPICall = (encodedSlug: string, decodedMethod: string) => {
        const dbURL = `${baseURL}/api/v1/database`;
        const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${decodedMethod}&refresh=1`;
        console.log('make api call to', slugURL);

        setLoading(true);
        // TODO if (headerData.length === 0)
        fetch(dbURL)
            .then(response => response.json())
            .then(data => {
                console.log('headerData fetch', data);
                setHeaderData(data);
            }).catch((error) => {
                 console.error('Error:', error);
         });

        fetch(slugURL)
            .then(response => response.json())
            .then(data => {
                console.log(`slug fetch: ${data.destination}`);
                // console.log(`slug data:${JSON.stringify(data)}`);

                setData(data);
                setValue(data.destination);
                setEValue(data.destination);
                setInputValue(data.destination);
                setSlugLoader(1);
                setCopyURL(window.location.href.toString().replace('?refresh=true', ''));
                const responsePayload = data.instances[data.instances.length - 1];
                setResponse(responsePayload);
                setUpdateTable(new Date().getTime().toString());
                setActive(responsePayload.timestamp);
                setRefreshActive(responsePayload.timestamp);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        slug ? reSlug() : null;
    }, [router.query.slug]);

    function reSlug() {
        const slug1 = router.query.slug;
        if (slug1) {
            const encodedSlug = base64Encode(slug1.toString());
            makeAPICall(encodedSlug, router.query.method ? router.query.method.toString() : 'GET');
            refreshNavBar();
        }
    }

    async function reSlugTo(slug: string, method: string) {
        await router.push(`/${slug}${method ? `?method=${method}` : ''}`);
        reSlug();
    }

    // function refreshTable(event) {
    //     event.preventDefault();
    //     console.log('refresh table');
    //     reSlug();
    // }

    function refreshNavBar() {
        console.log('refresh navbar');
        if (data != null && data.instances != null) {
            console.log('refresh navbar 2');
            const instances = data.instances.slice().reverse();
            console.log('setting active', instances[0].timestamp, instances);

            const _links = instances.map((item) => {
                const timestamp = new Date(item.timestamp);
                return <a
                  className={cx(classes.link, { [classes.linkActive]: item.timestamp === active })}
                  key={item.timestamp}
                  onClick={(event) => {
                        event.preventDefault();
                        setResponse(item);
                        setUpdateTable(item.timestamp);
                        setActive(item.timestamp);
                        setLoading(false);
                        console.log('updatetable', updateTable);
                    }}
                >
                    <span> <IconClock size={16} stroke={1} /> {timestamp.toLocaleString()}</span>
                       </a>;
            });
            console.log('ilonks', _links);
            setNavLinks(_links);
        }
    }

    const form = useForm({
        initialValues: { url: '', method: '' },
    });

    useEffect(() => {
        setBaseURL(window.location.origin);
        setCopyURL(baseURL);
        const queryParams = new URLSearchParams(window.location.search);
        // console.log("==>", queryParams, queryParams.get('url'), queryParams.get('method'));
        setMethodValue(queryParams.get('method') || 'GET');
    }, []);

    useEffect(() => {
        if (redirect !== '') {
            const r = redirect;
            setRedirect('');
            if (window.location.href !== r) {
                window.location.href = r;
            }
        }
    }, [redirect]);

    useEffect(() => {
        refreshNavBar();
    }, [data]);

    function handleTextInputChange(event) {
        event.preventDefault();
        if (event.target.value != null) {
            setInputValue(event.target.value);
        }
    }

    function goHome(event) {
        event.preventDefault();
        router.push('/');
        setValue('');
        setInputValue('');
        setMethodValue('GET');
        setData([]);
        setResponse([]);
        setUpdateTable('');
        setCopyURL('');
        setSlug('');
        inputRef.current?.focus();
        // copyButtonRef.current?.disabled = false;
    }

    function ThemeSwitch() {
       return <SegmentedControl
         value={colorScheme}
         onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
         onClick={() => { setUpdateTable(new Date().getTime().toString()); }}
         data={[
                {
                    value: 'light',
                    label: (
                        <Center>
                            <IconSun size={16} stroke={1.5} />
                            {/* <Box ml={10}>Light</Box> */}
                        </Center>
                    ),
                },
                {
                    value: 'dark',
                    label: (
                        <Center>
                            <IconMoon size={16} stroke={1.5} />
                            {/* <Box ml={10}>Dark</Box> */}
                        </Center>
                    ),
                },
            ]}
       />;
    }

    // @ts-ignore
    return (
            <AppShell
              padding="lg"
              layout="alt"
              fixed
              styles={(theme) => ({
                  main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
              })}
              navbar={<Transition mounted={navOpened} transition="slide-right" duration={0} timingFunction="ease">
                  {(styles) =>
                      <ColonNavbar style={styles} themeSwich={ThemeSwitch()} hidden={!slug} data={data} setResponse={setResponse} refreshActive={refreshActive} setRefreshActive={setRefreshActive} />
                  }
                      </Transition>}
              aside={<Transition mounted={drawerOpened} transition="slide-left" duration={0} timingFunction="ease">
                          {(styles) =>
                          <Aside style={styles} p="md" hiddenBreakpoint="sm" hidden={!drawerOpened} width={{ sm: 300, lg: 400 }}>
                              <ColonDocs headerMetaData={headerData} focus={drawerFocus} setFocus={setDrawerFocus} setDrawerOpened={setDrawerOpened} />
                          </Aside> }
                     </Transition>}
              header={<Header height={80} p="xs">
                                <Group spacing="sm" position="apart">
                                    <Group spacing="sm">
                                        {/*<motion.div*/}
                                        {/*  whileHover={{ scale: 1.2, rotate: 90 }}*/}
                                        {/*  whileTap={{ scale: 0.7, rotate: -90, borderRadius: '100%' }}*/}
                                        {/*>*/}
                                        {/*    <Avatar*/}
                                        {/*      className={classes.logo}*/}
                                        {/*      src="/httpcolon.png"*/}
                                        {/*      alt="it's me, http:colon"*/}
                                        {/*      size="lg"*/}
                                        {/*      radius="md"*/}
                                        {/*      onClick={goHome}*/}
                                        {/*    />*/}
                                        {/*</motion.div>*/}
                                        <Text
                                            ml="sm"
                                          size={36}
                                          onClick={goHome}
                                          sx={{
                                                fontFamily: 'Monaco, monospace',
                                            }}
                                          variant="gradient"
                                          gradient={{ from: 'grape', to: 'blue', deg: 200 }}
                                        >
                                            <span user-select="none">
                                            HTTP:COLON
                                            </span>
                                        </Text>
                                        <Badge
                                            color="gray"
                                            variant="outline"
                                            size="xs"
                                            radius="xs"
                                        >BETA</Badge>

                                    </Group>
                                    {slug &&
                                        <ColonizeForm setRedirect={setRedirect} focus={false} />
                                    }
                                </Group>
                      </Header>}
            >

                <Analytics />

                {slug ? <Group position="apart">
                    <Group>
                        <Button
                          leftIcon={navOpened ? <IconX size={14} stroke={2} /> : <IconHistory size={14} stroke={2} />}
                          variant="light"
                          color={navOpened ? 'gray' : 'grape'}
                          size="xs"
                          onClick={() => toggleNav()}
                        >
                            History
                        </Button>
                    </Group>
                    <Group position="right">
                        <Button
                          leftIcon={<IconPlus size={14} stroke={2} />}
                          variant="light"
                          color="grape"
                          size="xs"
                          onClick={goHome}
                        >
                            New URL
                        </Button>
                        <Button
                          leftIcon={drawerOpened ? <IconX size={14} stroke={2} /> : <IconBook size={14} stroke={2} />}
                          variant="light"
                          color={drawerOpened ? 'gray' : 'grape'}
                          size="xs"
                          onClick={() => toggleDocs()}
                        >
                            Docs
                        </Button>
                    </Group>
                        </Group> : <Group position="apart"> </Group>}

                { slug ? <Container>
                    <div />
                        <Space h="md" />
                        <Container>
                            <table>
                            <tbody>
                            <tr className={classes.tableRow}>
                                <td className={classes.tableKey}>URL</td>
                                <td className={classes.tableValue}>
                                    <ColonizeFormV2 value={eValue} method={response.method} onSubmit={reSlugTo} isEditing={colonizeFormEditable} setIsEditing={setColonizeFormEditable} />
                                </td>
                            </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>METHOD</td>
                                    <td className={classes.tableValue}>
                                        {/*<ColonizeMethodForm value={eValue} method={response.method} onSubmit={reSlugTo} />*/}
                                        <Group spacing="xs">
                                        <Badge
                                          color={response.status < 300 ? 'green' : response.status < 400 ? 'yellow' : 'red'}
                                          radius="xs"
                                          size="md"
                                          variant="filled"
                                        >
                                            {response.method}
                                        </Badge>
                                        {!colonizeFormEditable && <ActionIcon onClick={() => setColonizeFormEditable(true)} color="grape" variant="outline" size="xs">
                                            <IconEdit size={12} stroke={2} />
                                                                  </ActionIcon>}
                                        </Group>
                                    </td>
                                </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>STATUS</td>
                                    <td className={classes.tableValue}>
                                        <Badge
                                          color={response.status < 300 ? 'green' : response.status < 400 ? 'yellow' : 'red'}
                                          radius="xs"
                                          size="md"
                                          variant="dot"
                                        >
                                            {response.status} {response.statusText}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>LATENCY</td>
                                    <td className={classes.tableValue}>
                                        <Badge
                                          color={response.latency < 200 ? 'green' : response.latency < 600 ? 'yellow' : 'red'}
                                          radius="xs"
                                          size="md"
                                          variant="dot"
                                        >
                                            {response.latency ? (response.latency > 1000 ? `${response.latency / 1000} sec` : `${response.latency} ms`) : 'N/A'}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>TIMESTAMP </td>
                                    <td className={classes.tableValue}>{new Date(response.timestamp).toLocaleString()}</td>
                                </tr>
                            </tbody>
                            </table>

                         {/*<TaskCard*/}
                         {/*  status={response.status}*/}
                         {/*  statusMsg={response.statusText}*/}
                         {/*  method={response.method}*/}
                         {/*  url={response.destination}*/}
                         {/*  latency={response.latency}*/}
                         {/*  timestamp={response.timestamp}*/}
                         {/*  copyURL={copyURL}*/}
                         {/*  refreshTable={refreshTable}*/}
                         {/*/>*/}
                        </Container>

                        <Space h="md" />
                    <div>
                        {!slug ? <Group position="center" /> : null}
                        <Space h="md" />
                    </div>
                        <div id="headers">
                           <TableSort data={response.payload} headerMetaData={headerData} setHeaderMetadata={setHeaderData} updateTable={updateTable} setDrawerFocus={setDrawerFocus} setDrawerOpened={setDrawerOpened} />
                        </div>
                         </Container> : <Container>
                    <Space h="xl" />
                    <Space h="xl" />
                    <Center>
                        <ColonizeForm setRedirect={setRedirect} focus />
                    </Center>
                    <Space h="xl" />
                    <Space h="xl" />
                                            <Text
                                              size={28}
                                              weight="bold"
                                              variant="gradient"
                                              gradient={{ from: 'grape', to: 'blue', deg: 100 }}
                                              sx={{
                                                      fontFamily: 'Monaco, monospace',
                                                  }}
                                            >
                                                ✨EXPLORE
                                            </Text>
                                            <Space h="xl" />
                                            <Explore />
                                            <Space h="xl" />
                                            <Space h="xl" />
                                            <Center>{ThemeSwitch()}</Center>
                                        </Container> }

                {/*<Drawer*/}
                {/*  className={classes.drawer}*/}
                {/*  opened={drawerOpened}*/}
                {/*  onClose={() => setDrawerOpened(false)}*/}
                {/*  padding="xl"*/}
                {/*  size="xl"*/}
                {/*  position="right"*/}
                {/*  withCloseButton={false}*/}
                {/*  // withOverlay={false}*/}
                {/*  // lockScroll={false}*/}
                {/*>*/}
                {/*    /!*<ColonDocs headerMetaData={headerData} focus={drawerFocus} setFocus={setDrawerFocus} setDrawerOpened={setDrawerOpened} />*!/*/}
                {/*</Drawer>*/}

                <FooterLinks setDrawerOpened={setDrawerOpened} setDrawerFocus={setDrawerFocus} />

            </AppShell>);
}
