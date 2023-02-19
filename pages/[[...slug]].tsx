import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import GitHubButton from 'react-github-btn';
import { useForm } from '@mantine/form';
import {
    IconSelector,
    IconChevronLeft,
    IconChevronRight,
    IconSearch,
    IconRefresh,
    IconLink,
    IconClock,
    IconPlus,
    IconShare,
    IconWorld,
    IconCopy,
    IconMoon,
    IconSquarePlus,
    IconSun,
    IconSwitchHorizontal,
    IconInfoSquareRounded,
} from '@tabler/icons';
import { Analytics } from '@vercel/analytics/react';

import {
    AppShell,
    Navbar,
    Header,
    Code,
    Button,
    Card,
    Avatar,
    TextInput,
    Stack,
    CopyButton,
    Group,
    Grid,
    Text,
    ScrollArea,
    ActionIcon,
    Popover,
    createStyles, SegmentedControl,
    Center,
    NativeSelect,
    useMantineColorScheme,
    Image,
    Select,
    Container,
    Mark,
    keyframes,
    Space,
    useMantineTheme,
    Loader, Anchor, Alert,
} from '@mantine/core';

import { motion } from 'framer-motion';
import { TableSort } from '../components/tablesort';
import { FooterLinks } from '../components/footer';
import { TaskCard } from '../components/taskcard';
import { Explore } from '../components/explore';

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
            background: theme.fn.gradient({ from: theme.colors.grape[3], to: theme.colors.blue[3], deg: 200 }),
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

    // const refreshURL = router.query["refresh"] ? "?refresh=true" : ""

    const makeAPICall = (encodedSlug: string, decodedMethod: string) => {
        const dbURL = `${baseURL}/api/v1/database`;
        const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${decodedMethod}&refresh=1`;
        console.log('make api call to', encodedSlug);

        setLoading(true);
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
                console.log(`slug data:${JSON.stringify(data)}`);

                setData(data);
                setValue(data.destination);
                setInputValue(data.destination);
                setSlugLoader(1);
                setCopyURL(window.location.href.toString().replace('?refresh=true', ''));
                const responsePayload = data.instances[data.instances.length - 1];
                setResponse(responsePayload);
                setUpdateTable(responsePayload.timestamp);
                setActive(responsePayload.timestamp);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        slug ? reSlug() : null;
    }, []);

    function reSlug() {
        const slug1 = router.query.slug;
        if (slug1) {
            const encodedSlug = base64Encode(slug1.toString());
            makeAPICall(encodedSlug, router.query.method ? router.query.method.toString() : 'GET');
            refreshNavBar();
        }
    }

    function refreshTable(event) {
        event.preventDefault();
        console.log('refresh table');
        reSlug();
    }

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
        inputRef.current?.focus();
        // copyButtonRef.current?.disabled = false;
    }

    // @ts-ignore
    return (
        <>
            <AppShell
              padding="lg"
              navbar={ slug &&
                    <Navbar height="100%" width={{ sm: 300 }} p="md" className={classes.navbar}>
                    <Navbar.Section grow>
                        {navLinks}
                    </Navbar.Section>

                    <Navbar.Section className={classes.footer}>
                       <Center>
                           <Stack>

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
                                <GitHubButton href="https://github.com/hyfather/httpcolon/tree/master/json" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub">
                                     Corrections
                                </GitHubButton>
                           </Stack>

                       </Center>
                    </Navbar.Section>
                    </Navbar>
                }
              header={<Header height={80} p="xs">
                            <form onSubmit={form.onSubmit((values) => {
                                console.log('redirecting', inputValue);
                                const strippedUrl = inputValue.replace(/(^\w+:|^)\/\//, '').split('?')[0];
                                const redirectUrl = methodValue === 'GET' ? (`${baseURL}/${strippedUrl}?refresh=true`) : (`${baseURL}/${strippedUrl}?method=${methodValue}&refresh=true`);
                                console.log(`redirectUrl: ${redirectUrl}/${methodValue}`);
                                setRedirect(redirectUrl);
                            })}
                            >
                                <Group spacing="sm" position="apart">
                                    <Group spacing="sm">
                                        <motion.div
                                          whileHover={{ scale: 1.2, rotate: 90 }}
                                          whileTap={{ scale: 0.7, rotate: -90, borderRadius: '100%' }}
                                        >
                                            <Avatar
                                              className={classes.logo}
                                              src="/httpcolon.png"
                                              alt="it's me, http:colon"
                                              size="lg"
                                              radius="md"
                                            />
                                        </motion.div>
                                        <Text
                                          size={36}
                                          sx={{
                                                fontFamily: 'Monaco, monospace',
                                            }}
                                          variant="gradient"
                                          gradient={{ from: 'grape', to: 'blue', deg: 200 }}
                                        >
                                            http:colon
                                        </Text>
                                    </Group>
                                    <Group spacing="sm">
                                        <NativeSelect variant="filled" color="grape" value={methodValue} data={['GET', 'POST', 'PUT', 'DELETE']} onChange={(event) => setMethodValue(event.currentTarget.value)} ref={methodRef} />
                                        <TextInput className={classes.inputBox} icon={<IconWorld size={18} />} autoComplete="on" value={inputValue} onChange={handleTextInputChange} ref={inputRef} />
                                        <Button type="submit" variant="gradient" gradient={{ from: theme.colors.blue[10], to: theme.colors.grape[7] }} ref={colonizeButtonRef}>
                                            GO
                                        </Button>
                                    </Group>
                                </Group>
                            </form>
                      </Header>}
              styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                })}
            >

                <Analytics />

                { slug ? <Container>
                    <div className={classes.buttonContainer}>
                        {/* <Group position='left'> */}
                            <div />
                            <div>
                                <Button leftIcon={<IconPlus size={14} stroke={2} />} variant="light" color="grape" size="xs" onClick={goHome}>
                                    New URL
                                </Button>
                            </div>
                        {/* </Group> */}
                    </div>
                        <Space h="md" />
                        <Container size={500}>

                         <TaskCard
                           status={response.status}
                           statusMsg={response.statusText}
                           method={response.method}
                           url={response.destination}
                           latency={response.latency}
                           timestamp={response.timestamp}
                           copyURL={copyURL}
                           refreshTable={refreshTable}
                         />
                        </Container>

                        <Space h="md" />
                    <div>
                        {!slug ? <Group position="center">
                            {/*<Alert*/}
                            {/*  icon={<IconInfoSquareRounded size={14} stroke={1.5} />}*/}
                            {/*  color="grape"*/}
                            {/*  variant="light"*/}
                            {/*>*/}
                            {/*    <Text size="sm">*/}
                            {/*        <strong>Tip:</strong> enter a URL to get started.*/}
                            {/*    </Text>*/}
                            {/*</Alert>*/}
                                 </Group> : null}
                        <Space h="md" />
                    </div>
                        <div>
                           <TableSort data={response.payload} headerData={headerData} updateTable={updateTable} />
                        </div>
                         </Container> : <Container>
                                            <Text size={36} weight="bold" variant="gradient" gradient={{ from: 'grape', to: 'blue' }}>
                                                ✨Explore
                                            </Text>
                                            <Space h="xl" />
                                            <Explore refreshTable={refreshTable} />
                                        </Container> }
                <FooterLinks />

            </AppShell>
        </>
    );
}
