import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import {
    IconClock,
    IconPlus,
    IconMoon,
    IconSun,
    IconBook,
    IconEdit,
    IconHistory,
    IconX,
    IconRefresh,
    IconCodeCircle, IconBrandTwitter, IconBrandGithub,
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
    Drawer, MediaQuery, Badge, TextInput, ActionIcon, Aside, Transition, Tooltip, Loader, Select, Stack, Anchor,
} from '@mantine/core';
import { format } from 'timeago.js';


import { motion } from 'framer-motion';
import { TableSort } from '../components/tablesort';
import { FooterLinks } from '../components/footer';
import { TaskCard } from '../components/taskcard';
import { Explore } from '../components/explore';
import { ColonizeForm } from '../components/colonize';
import { ColonNavbar } from '../components/navbar';
import { ColonDocs } from '../components/docs';
import ColonizeFormV2, { ColonizeMethodForm } from '../components/masthead';
import {FullDocs} from "../components/fulldocs";

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
            backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.dark[7], to: theme.colors.dark[6], deg: 0 }) : theme.fn.gradient({ from: theme.colors.gray[0], to: theme.colors.grape[0], deg: 20 }),
        },

        drawer: {
            overflowY: 'auto',
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginBottom: 80,
            marginTop: theme.spacing.md,
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
            borderWidth: theme.colorScheme === 'dark' ? '1px' : '1px',
            borderImage: 'linear-gradient(45deg, #E599F7, #74C0FC) 1',
            zIndex: 999,
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
    const [docsFocus, setDocsFocus] = useState('');
    const [eValue, setEValue] = useState('');
    const [colonizeFormEditable, setColonizeFormEditable] = useState(false);
    const [navOpened, setNavOpened] = useState(false);

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
        if (drawerOpened) {
            setDrawerOpened(false);
        } else {
            setDrawerOpened(true);
            setDrawerFocus('');
        }
    }

    function toggleNav() {
        if (drawerOpened && !navOpened) {
            setDrawerOpened(false);
        }
        setNavOpened(!navOpened);
    }

    const makeAPICall = (encodedSlug: string, decodedMethod: string, refresh: boolean) => {
        setLoading(true);
        const dbURL = `${baseURL}/api/v1/database`;
        const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${decodedMethod}${refresh ? '&refresh=true' : ''}`;
        console.log('make api call to', slugURL);

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

    function reSlug(refresh: boolean = false) {
        const slug1 = router.query.slug;
        setSlug(slug1);
        if (slug1) {
            const encodedSlug = base64Encode(slug1.toString());
            makeAPICall(encodedSlug, router.query.method ? router.query.method.toString() : 'GET', refresh);
            refreshNavBar();
        }
    }

    async function reSlugTo(slug: string, method: string) {
        if (slug === '') {
            return;
        }
        await router.push({
            pathname: `/${slug}`,
            query: method !== 'GET' ? { method } : {} });
        setSlug(slug);
        const encodedSlug = base64Encode(slug.toString());
        makeAPICall(encodedSlug, method ? method.toString() : 'GET', true);
    }

    function refreshTable() {
        console.log('refresh table');
        reSlug(true);
    }

    function refreshNavBar() {
        if (data != null && data.instances != null) {
            const instances = data.instances.slice().reverse();

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
                        // console.log('updatetable', updateTable);
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
        setDrawerOpened(false);
        setNavOpened(false);
        inputRef.current?.focus();
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
              navbar={<Transition mounted={navOpened && !!slug} transition="slide-right" duration={0} timingFunction="ease">
                  {(styles) =>
                      <ColonNavbar style={styles} themeSwich={ThemeSwitch()} hidden={!slug} data={data} setResponse={setResponse} refreshActive={refreshActive} setRefreshActive={setRefreshActive} setNavOpened={setNavOpened} />
                  }
                      </Transition>}
              aside={<Transition mounted={drawerOpened} transition="slide-left" duration={0} timingFunction="ease">
                          {(styles) =>
                          <Aside style={styles} p="md" hiddenBreakpoint="sm" hidden={!drawerOpened} width={{ sm: 300, lg: 400 }}>
                              <FullDocs focus={drawerFocus} setFocus={setDrawerFocus} embedded updateTable={updateTable} />
                          </Aside> }
                     </Transition>}
              header={<Header height={50} p="xs" className={classes.header}>
                                <Group spacing="sm" position="apart" mt={1}>
                                    <Group spacing="sm" align="vertical" mt={-2}>
                                            <Avatar
                                              className={classes.logo}
                                              src="/httpcolon3.png"
                                              alt="it's me, http:colon"
                                              size="sm"
                                              mt={3}
                                              radius={0}
                                              onClick={goHome}
                                            />
                                        <Text
                                          size={24}
                                          sx={{
                                                fontFamily: 'Monaco, monospace',
                                                fontWeight: 600,
                                            }}
                                          variant="gradient"
                                          mt={-2}
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
                                            radius="sm"
                                            mt={8}
                                        >BETA</Badge>

                                    </Group>
                                    {slug &&
                                        <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                                            <Group position="right" mt={-5}>
                                                <ColonizeForm setRedirect={setRedirect} focus={false} onSubmit={reSlugTo} />
                                            </Group>
                                        </MediaQuery>
                                    }
                                </Group>
                      </Header>}
            >

                <Analytics />

                {slug ? <Group position="apart" mt={10}>
                    <Group>
                        {!navOpened && <Button
                          leftIcon={<IconHistory size={18} stroke={2} />}
                          variant="outline"
                          color="grape"
                          size="sm"
                          compact
                          onClick={() => toggleNav()}
                        >
                            History
                        </Button>}
                    </Group>
                    <Group position="right">
                        <Button
                          leftIcon={<IconPlus size={18} stroke={2} />}
                          variant="outline"
                          color="grape"
                          size="sm"
                          compact
                          onClick={goHome}
                        >
                            New URL
                        </Button>
                        {!drawerOpened && <Button
                          leftIcon={drawerOpened ? <IconX size={18} stroke={2} /> : <IconBook size={18} stroke={2} />}
                          variant="outline"
                          color={drawerOpened ? 'gray' : 'grape'}
                          size="sm"
                          compact
                          onClick={() => toggleDocs()}
                        >
                            Docs
                        </Button>}
                    </Group>
                        </Group> : <Group position="apart"> </Group>}

                { slug ? <Container>
                    <div />
                        <Space h="md" />
                        <Container>
                            {!response.status && <Center> <Loader color="gray" /> </Center>}
                            <table>
                        {!!response.status &&
                            <tbody>
                            <tr className={classes.tableRow}>
                                <td className={classes.tableKey}>URL</td>
                                <td className={classes.tableValue}>
                                    <ColonizeFormV2 inputValue={eValue} setInputValue={setEValue} method={response.method} onSubmit={reSlugTo} isEditing={colonizeFormEditable} setIsEditing={setColonizeFormEditable} />
                                </td>
                            </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>METHOD</td>
                                    <td className={classes.tableValue}>
                                        <Group spacing="xs">
                                            <Select
                                                placeholder={response.method}
                                                readOnly
                                                variant="filled"
                                                defaultChecked={response.method}
                                                icon={<IconCodeCircle size={18} stroke={2} />}
                                                rightSection={colonizeFormEditable ? <IconEdit size={12} stroke={2} /> : <ActionIcon onClick={() => setColonizeFormEditable(true)} color="grape" variant="outline" size="xs">
                                                    <IconEdit size={12} stroke={2} />
                                                </ActionIcon>}
                                                data={[
                                                    { value: 'GET', label: 'GET' },
                                                    { value: 'POST', label: 'POST' },
                                                    { value: 'PUT', label: 'PUT' },
                                                    { value: 'DELETE', label: 'DELETE' },
                                                ]}
                                            />
                                        </Group>
                                    </td>
                                </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>STATUS</td>
                                    <td className={classes.tableValue}>
                                        <Badge
                                          color={response.status < 300 ? 'green' : response.status < 400 ? 'yellow' : 'red'}
                                          radius="sm"
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
                                          radius="sm"
                                          size="md"
                                          variant="dot">
                                            {response.latency ? (response.latency > 1000 ? `${response.latency / 1000} sec` : `${response.latency} ms`) : 'N/A'}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr className={classes.tableRow}>
                                    <td className={classes.tableKey}>TIMESTAMP </td>
                                    <td className={classes.tableValue}>
                                        <Group spacing="xs">
                                        <Tooltip
                                            label={new Date(response.timestamp).toLocaleString()}
                                            position="right"
                                            withArrow
                                            color="gray"
                                        >
                                            <Badge
                                                color='gray'
                                                radius="sm"
                                                size="md"
                                                variant="dot"
                                            >
                                                { format(response.timestamp) }
                                            </Badge>
                                        </Tooltip>
                                        <ActionIcon onClick={() => {
                                                        openNav();
                                                        refreshTable();
                                                    }}
                                                    color="green"
                                                    variant="outline"
                                                    size="xs">
                                            <IconRefresh size={12} stroke={2} />
                                        </ActionIcon>
                                        </Group>
                                    </td>
                                </tr>
                            </tbody>}
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
                    {loading ? <Center> <Loader size="md" color="gray" /> </Center>: <div id="headers">
                            {!!response.payload && <TableSort data={response.payload} headerMetaData={headerData} setHeaderMetadata={setHeaderData} updateTable={updateTable} setDrawerFocus={setDrawerFocus} setDrawerOpened={setDrawerOpened} />}
                        </div>}
                         </Container> : <Container>
                    <Space h="xl" />
                    <Space h="xl" />
                    <Center>
                        <ColonizeForm setRedirect={setRedirect} focus onSubmit={null} />
                    </Center>
                    <Space h="xl" />
                    <Space h="xl" />
                    <Explore />
                    <Space h="xl" />
                    <Space h="xl" />
                    <Center>{ThemeSwitch()}</Center>
                                        </Container> }
                <Space h="xl" />

                {!slug && <Group position="apart"
                    sx={{
                        background: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.dark[8], to: theme.colors.dark[8], deg: 1 }) : theme.fn.gradient({ from: theme.colors.gray[0], to: theme.colors.grape[0], deg: 1 }),
                        width: '100%',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '15px',
                        position: 'absolute',
                        left: 0,
                        borderTop: theme.colorScheme === 'dark' ? '1px solid #555' : '1px solid #eaeaea',
                    }}
                   mt={20}
                >
                        <Stack>
                            <Text variant="gradient" gradient={{ from: 'grape', to: 'blue', deg: 200 }} size={10}>
                                © 2023 HTTP:COLON // All rights reserved
                            </Text>
                            <Text variant="gradient" gradient={{ from: 'grape', to: 'blue', deg: 200 }} size={10} mt={-15} ml={40}>
                                ✨ Made in San Francisco
                            </Text>
                        </Stack>
                        <Group spacing={10} className={classes.social} position="right" noWrap>
                            <Anchor href="https://twitter.com/nmungel" target="_blank">
                                <IconBrandTwitter size={18} stroke={1.5} />
                            </Anchor>
                            <Anchor href="https://github.com/hyfather/httpcolon" target="_blank">
                                <IconBrandGithub size={18} stroke={1.5} />
                            </Anchor>
                        </Group>
                </Group>}

                {!slug && <FullDocs focus={docsFocus} setFocus={setDocsFocus} embedded={false} updateTable={updateTable} />}
                <FooterLinks setDrawerOpened={setDrawerOpened} setDrawerFocus={setDrawerFocus} />

            </AppShell>);
}
