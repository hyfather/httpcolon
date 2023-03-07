import {
    ActionIcon,
    Anchor,
    Badge,
    Button,
    Center,
    Container,
    createStyles, Divider,
    Group,
    Navbar,
    Progress,
    SegmentedControl,
    Space,
    Stack, Text
} from '@mantine/core';
import {IconBrandGithub, IconClock, IconEdit, IconMoon, IconSun, IconX} from '@tabler/icons';
import GitHubButton from 'react-github-btn';
import {useEffect, useState} from 'react';
import {bool} from "prop-types";
import { format } from 'timeago.js';

interface ColonNavbarProps {
    navLinks: [];
    themeSwich: JSX.Element;
    data: [];
    setResponse: Function;

    refreshActive: string,

    setRefreshActive: Function,

    setNavOpened: Function,
}

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
                navbar: {
                    zIndex: 1,
                },

                footer: {
                    paddingTop: theme.spacing.md,
                    marginBottom: 80,
                    marginTop: theme.spacing.md,
                    // height: 500,
                    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                    }`,
                },

                linkTitle: {
                    ...theme.fn.focusStyles(),
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    fontSize: theme.fontSizes.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
                    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                    borderRadius: theme.radius.sm,
                    fontWeight: 500,
                },


                link: {
                    ...theme.fn.focusStyles(),
                    display: 'block',
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
                    },
                },

                linkActive: {
                    ...theme.fn.focusStyles(),
                    display: 'block',
                    alignItems: 'center',
                    textDecoration: 'none',
                    fontSize: theme.fontSizes.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.grape[1] : theme.colors.grape[7],
                    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                    borderRadius: theme.radius.sm,
                    fontWeight: 500,
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.grape[8] : theme.colors.grape[1],
                },
    };
    });

export function ColonNavbar({ themeSwich, data, setResponse, refreshActive, setRefreshActive, setNavOpened }: ColonNavbarProps) {
    const { classes, themes } = useStyles();
    const [navLinks, setNavLinks] = useState([]);
    const [active, setActive] = useState('');
    const [updateState, setUpdateState] = useState(true);

    useEffect(() => {
        if (data != null && data.instances != null) {
            setUpdateState(false);
            const instances = data.instances.slice().reverse();

            const _links = instances.map((item) => {
                return <Anchor
                    className={item.timestamp === active ? classes.linkActive : classes.link}
                    key={item.timestamp}
                    variant='text'
                    onClick={(event) => {
                        event.preventDefault();
                        setResponse(item);
                        setActive(item.timestamp);
                        setUpdateState(true);
                    }}
                >
                    <Group position="apart">
                        <Group>
                            <Badge
                                radius="sm"
                                size="xs"
                                variant={item.timestamp === active ? 'filled' : 'light'}
                                color={item.status < 300 ? 'green' : 'red'}
                            >
                                {item.method}
                            </Badge>
                            <Badge
                                radius="sm"
                                size="xs"
                                variant={item.timestamp === active ? 'filled' : 'light'}
                                color={item.latency < 200 ? 'green' : item.latency < 600 ? 'yellow' : item.latency < 800 ? 'orange' : 'red'}
                            >
                                {item.latency} ms
                            </Badge>
                        </Group>
                        <Badge
                            radius="sm"
                            size="xs"
                            variant={item.timestamp === active ? 'filled' : 'light'}
                            color='gray'
                        >
                            {format(item.timestamp)}
                        </Badge>
                    </Group>
                 </Anchor>;
            });
            console.log('ilinks', _links);
            setNavLinks(_links);
            if (active === '') {
                setActive(instances[0].timestamp);
            }
            if (refreshActive) {
                setActive(refreshActive);
                setRefreshActive('');
            }
        }
    }, [data, updateState, refreshActive]);

    return (<Navbar height="100%" width={{ sm: 300 }} p="md" className={classes.navbar}>
        <Navbar.Section grow>
            <Group spacing="xs" position="right">
                <Text
                    size={24}
                    sx={{
                        fontFamily: 'Monaco, monospace',
                        fontWeight: 600,
                    }}
                    variant="gradient"
                    gradient={{ from: 'gray', to: 'gray', deg: 160 }}
                >
                    <span user-select="none">
                    HISTORY
                    </span>
                </Text>
                <ActionIcon
                    mr={10}
                    variant="filled"
                    size="sm"
                    color="gray"
                    onClick={(e) => {
                        e.preventDefault();
                        setNavOpened(false);
                    }}
                >
                    <IconX size={20} />
                </ActionIcon>
            </Group>
            <Divider size="xs" mt={10} mb={10} color="gray" />

            <Center>
                <Group className={classes.linkTitle} position="left">
                    <Text
                        className={classes.title}
                        sx={{
                            fontFamily: 'Monaco, monospace',
                        }}
                    >
                        {data.destination}
                    </Text>
                </Group>
            </Center>
            <Space h="sm" />
            {navLinks}
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
            <Center>
                <Stack>
                    {themeSwich}
                    <Anchor href="https://github.com/hyfather/httpcolon/tree/master/json" target="_blank" rel="noopener noreferrer">
                    <Button
                    variant="outline"
                    color="dark"
                    size="sm"
                    compact
                    leftIcon={
                        <IconBrandGithub size={18} stroke={2} color="black" />}
                    >
                         Corrections
                    </Button>
                    </Anchor>
                </Stack>
            </Center>
        </Navbar.Section>
            </Navbar>);
}
