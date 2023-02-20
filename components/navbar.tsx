import {
    Anchor,
    Badge,
    Center,
    Container,
    createStyles,
    Group,
    Navbar,
    Progress,
    SegmentedControl,
    Space,
    Stack, Text
} from '@mantine/core';
import {IconClock, IconEdit, IconMoon, IconSun} from '@tabler/icons';
import GitHubButton from 'react-github-btn';
import {useEffect, useState} from 'react';
import {bool} from "prop-types";

interface ColonNavbarProps {
    navLinks: [];
    themeSwich: JSX.Element;
    data: [];
    setResponse: Function;

    refreshActive: string,

    setRefreshActive: Function,

}

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
                navbar: {
                    zIndex: 'unset',
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
                    },
                },

                linkActive: {
                    ...theme.fn.focusStyles(),
                    display: 'flex',
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

export function ColonNavbar({ themeSwich, data, setResponse, refreshActive, setRefreshActive }: ColonNavbarProps) {
    const { classes, themes } = useStyles();
    const [navLinks, setNavLinks] = useState([]);
    const [active, setActive] = useState('');
    const [updateState, setUpdateState] = useState(true);

    useEffect(() => {
        console.log('refresh navbar');
        if (data != null && data.instances != null) {
            setUpdateState(false);
            const instances = data.instances.slice().reverse();
            console.log('setting active', instances[0].timestamp, instances);

            const _links = instances.map((item) => {
                const timestamp = new Date(item.timestamp);
                const timestampLabel = timestamp.getDay() === new Date().getDay() ? timestamp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }) : timestamp.toLocaleString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' });
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
                        <Badge
                            radius="xs"
                            size="md"
                            variant={item.timestamp === active ? 'filled' : 'light'}
                            color='gray'
                        >
                            {timestampLabel}
                        </Badge>
                        <Badge
                            radius="sm"
                            size="xs"
                            variant={item.timestamp === active ? 'filled' : 'light'}
                            color={item.status < 300 ? 'green' : item.status < 400 ? 'pink' : item.status < 500 ? 'orange' : 'red'}
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
            <Center>
                <Container className={classes.linkTitle}>
                    <Badge
                        radius="sm"
                        size="sm"
                        variant='outline'
                        color='gray'
                    >
                        {data.destination}
                    </Badge>
                </Container>
            </Center>
            <Space h="sm" />
            {navLinks}
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
            <Center>
                <Stack>
                    {themeSwich}
                    <GitHubButton href="https://github.com/hyfather/httpcolon/tree/master/json" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub">
                        Corrections
                    </GitHubButton>
                </Stack>
            </Center>
        </Navbar.Section>
            </Navbar>);
}
