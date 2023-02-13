import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router'
import GitHubButton from 'react-github-btn'
import { useForm } from '@mantine/form';
import { IconSelector, IconChevronLeft, IconChevronRight, IconSearch, IconRefresh, IconLink, IconClock, IconPlus, IconShare } from '@tabler/icons';
import { TableSort } from '../components/tablesort';
import { Analytics } from '@vercel/analytics/react';

import {
    AppShell,
    Navbar,
    Header,
    Code,
    Button,
    Card,
    Table,
    TextInput,
    Stack,
    CopyButton,
    Group,
    Grid,
    Text,
    ScrollArea,
    Box,
    Popover,
    createStyles, SegmentedControl,
    Center,
    UnstyledButton,
    useMantineColorScheme,
    Image,
    Select,
    Container,
    Mark,
    keyframes,
    Space,
    useMantineTheme,
    Loader,
} from '@mantine/core';

import { IconFingerprint, IconCopy, IconMoon, IconSquarePlus, IconSun, IconSwitchHorizontal } from '@tabler/icons';

const BASE_URL = 'https://httpcolon.dev/';
// const BASE_URL = 'http://localhost:3000';

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
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
                backgroundColor: theme.fn.variant({ variant: 'light', color: "grape" })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: "grape" }).color,
                },
            },
        },

        card: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
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
            zIndex: 'unset'
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
    };
});

export default function HomePage(props) {
    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [redirect, setRedirect] = useState('');
    const [methodValue, setMethodValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);
    const [navLinks, setNavLinks] = useState([]);
    const [copyURL, setCopyURL] = useState<string>(BASE_URL);
    const [slugLoader, setSlugLoader] = useState<number>(0);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { classes, cx } = useStyles();
    const [ active, setActive] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const colonizeButtonRef = useRef<HTMLButtonElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const theme = useMantineTheme();
    const [updateTable, setUpdateTable] = useState('');
    const [headerData, setHeaderData] = useState({});

    const router = useRouter()

    const slug = router.query["slug"];
    const refreshURL = !router.query["refresh"] ? "" : "?refresh=true"

    const makeAPICall = (url: string) => {
        console.log("make api call");
        setLoading(true);
        // if (headerData) {
        // if (headerData) {
            fetch(url + "&db=cache-control")
                .then(response => response.json())
                .then(data => {
                    console.log("headerData fetch", data);
                    setHeaderData(data);
                }).catch((error) => {
                     console.error("Error:", error);
             });
        // }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("slug fetch: " + data.destination);
                console.log("slug data:" + JSON.stringify(data));

                setData(data);
                setValue(data.destination);
                setInputValue(data.destination);
                setSlugLoader(1)
                setCopyURL(window.location.href);

                const responsePayload = data.instances[data.instances.length - 1];
                setResponse(responsePayload);
                setUpdateTable(responsePayload.timestamp);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    };

    useEffect(()=>{
        if (slug != null && slugLoader == 0) {
            const fetchURL = BASE_URL + "/api/v1/" + slug + refreshURL;
            makeAPICall(fetchURL);
            refreshNavBar();
        }
    }, []);

    function refreshTable(event) {
        event.preventDefault();

        var url = "";

        console.log("slugs: ", slug);
        if(!slug){
            const querySlug = router.query["slug"];
            console.log("query slugs: ", querySlug);
            if(!querySlug) {
                url = "/api/v1/" + querySlug?.toString();
            }
        } else {
            url = "/api/v1/" + slug;
        }

        if(!router.query["refresh"]) {
            url = url + "?refresh=true";
        }
        console.log("refreshing table", url);
        const fetchURL = BASE_URL + url?.toString();
        makeAPICall(fetchURL);
        refreshNavBar();
    };

    function isValidHttpUrl({ string }: { string: any }) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const handleMethodChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setMethodValue(val);
    };


    const form = useForm({
        initialValues: { url: '', method: '' },
    });

    useEffect(() => {
        if (redirect !== "") {
            const r = redirect;
            setRedirect("");
            if (window.location.href !== r) {
                window.location.href = r;
            }
        }
    });

    // var iLinks = [];
    // if(data != null && data.instances != null) {
    //     console.log("old refresh navbar");

    //     const instances = data.instances.slice().reverse();
    //     var d = new Date(0);
    //     iLinks = instances.map(function(item) {
    //         d = new Date(item.timestamp);
    //         return <a
    //         className={cx(classes.link, { [classes.linkActive]: item.timestamp === active })}
    //         key={item.timestamp}
    //         onClick={(event) => {
    //                 event.preventDefault();
    //                 setResponse(item);
    //                 setActive(item.timestamp);
    //                 setUpdateTable(item.timestamp);
    //                 console.log("updatetable", updateTable);
    //             }}
    //             >
    //             <span> <IconClock size={16} stroke={1} /> {d.toLocaleString()}</span>
    //         </a>       
    //     });

    //     // if(instances.length > 1) {
    //     //     setActive(instances[0].timestamp);
    //     // }
    // }

    function refreshNavBar() {
        console.log("refresh navbar");
        if(data != null && data.instances != null) {
            console.log("refresh navbar 2");
            const instances = data.instances.slice().reverse();
            console.log("setting active", instances[0].timestamp, instances)

            const _links = instances.map(function(item) {
                const timestamp = new Date(item.timestamp);
                return <a
                    className={cx(classes.link, { [classes.linkActive]: item.timestamp === active })}
                    key={item.timestamp}
                    onClick={(event) => {
                            event.preventDefault();
                            setResponse(item);
                            setActive(item.timestamp);
                            setUpdateTable(item.timestamp);
                            console.log("updatetable", updateTable);
                        }}
                >
                    <span> <IconClock size={16} stroke={1} /> {timestamp.toLocaleString()}</span>
                </a>
            });
            console.log("ilonks", _links);
            // setActive(instances[0].timestamp);
            setNavLinks(_links);
        }    
    }

    // refreshNavBar();

    useEffect(() => {
        refreshNavBar();
    }, [data]);

    function handleTextInputChange(event) {
        event.preventDefault();
        if(event.target.value != null) {
            setInputValue(event.target.value);
        }
    }

    function goHome(event) {
        event.preventDefault();
        router.push("/");
        setValue("");
        setInputValue("");
        setData([]);
        setResponse([]);
        setUpdateTable("");
        setCopyURL("");
        inputRef.current?.focus();
        // copyButtonRef.current?.disabled = false;
    }

    // @ts-ignore
    return (
        <>
            <AppShell
                padding="lg"
                navbar={
                    <Navbar height={700} width={{ sm: 300 }} p="md" className={classes.navbar}>
                    <Navbar.Section grow>
                        {navLinks}
                    </Navbar.Section>
        
                    <Navbar.Section className={classes.footer}>
                       <Center>
                            <Group position="center" my="xl">
                                <SegmentedControl
                                    value={colorScheme}
                                    onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
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
                                />
                                <GitHubButton href="https://github.com/hyfather/httpcolon" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub"></GitHubButton>
                            </Group>
                        </Center>
                    </Navbar.Section>
                </Navbar>
                }
                header={<Header height={80} p="xs">
                            <form onSubmit={form.onSubmit(function (values) {
                                console.log("redirecting", inputValue);
                                const strippedUrl = inputValue.replace(/(^\w+:|^)\/\//, '').split('?')[0];
                                const redirectUrl = values.method === "GET" || values.method == "" ? (BASE_URL + '/' + strippedUrl + "?refresh=true") : (BASE_URL + '/' + strippedUrl + "?method=" + values.method + "&refresh=true");
                                console.log("redirectUrl: " + redirectUrl + values.method);
                                setRedirect(redirectUrl);
                            })}>
                                <Group spacing="sm" grow>
                                    <Image
                                        width={300}
                                        height={60}
                                        src="/httpcolon.png"
                                        fit="contain"
                                    />

                                    <Select mt="xs" placeholder="GET" {...form.getInputProps('method')} data={['GET', 'POST', 'PUT', 'DELETE']} />

                                    <TextInput autoComplete="on" mt="xs" {...form.getInputProps('url')} value={inputValue} onChange={handleTextInputChange} ref={inputRef} />

                                    <Button type="submit" mt="xs" variant="gradient" gradient={{ from: theme.colors.blue[9], to: theme.colors.grape[7] }} ref={colonizeButtonRef}>
                                        Colonize
                                    </Button>
                                </Group>
                            </form>
                        </Header>}
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                })}
            >

                <Analytics />

                <Container>
                    <div className={classes.buttonContainer}>
                        {/* <Group position='left'> */}
                            <div>
                                <Button className={classes.leftButtons} leftIcon={<IconRefresh size={14} stroke={2} />} variant="gradient" gradient={{ from: theme.colors.blue[5], to: theme.colors.grape[5] }} size="xs" onClick={refreshTable}>
                                    Refresh
                                </Button>
                                <Popover width="auto" position="bottom" transition="pop" withArrow>
                                    <Popover.Target>
                                       <Button className={classes.leftButtons} leftIcon={<IconLink size={14} stroke={2} />} variant="gradient" gradient={{ from: theme.colors.blue[8], to: theme.colors.grape[8] }} size="xs" onClick={refreshTable}>
                                            Share
                                        </Button>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <CopyButton value={copyURL}>
                                            {({ copied, copy }) => (
                                                <Button variant="outline" color="black" size="xs" rightIcon={<IconCopy />} onClick={copy}>
                                                    <Code>{copyURL.replace(/^https?:\/\//, '').split('?')[0]}</Code>
                                                </Button>
                                            )}
                                        </CopyButton>
                                    </Popover.Dropdown>
                                </Popover>

                            </div>
                            <div>
                                <Button leftIcon={<IconPlus size={14} stroke={2} />} variant="gradient" gradient={{ from: theme.colors.blue[8], to: theme.colors.grape[5] }} size="xs" onClick={goHome}>
                                    New URL
                                </Button>
                            </div>
                        {/* </Group> */}
                    </div>
                        <Space h="md" />
                        <Card withBorder p="xl" radius="md" className={classes.card}>
                            <div className={classes.inner}>
                                <div>
                                    <Code color="teal">
                                        GET {response.destination}
                                    </Code>
                                    <div>
                                       <Code>
                                            Status {response.status}
                                        </Code>
                                    </div>
                                    <div>
                                        <Code>
                                            Latency {response.latency} ms
                                        </Code>
                                    </div>
                                    <div>     
                                        <Code>
                                            Timestamp {response.timestamp != null ? new Date(response.timestamp).toLocaleString(): ""}
                                        </Code>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Space h="md" />
                        <div>
                            {loading ? <Group position="center">
                                            <Loader color="grape" size="xl" />
                                        </Group> : 
                                        <TableSort data={response.payload} headerData={headerData} updateTable={updateTable} /> }
                        </div>

                </Container>

            </AppShell>
        </>
    );
}
