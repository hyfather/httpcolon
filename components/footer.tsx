import {createStyles, Text, Container, ActionIcon, Group, Anchor, useMantineTheme} from '@mantine/core';
import { IconBrandTwitter, IconBrandGithub, IconBrandInstagram } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: 120,
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    logo: {
        maxWidth: 200,

        [theme.fn.smallerThan('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },

    description: {
        marginTop: 5,

        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
            textAlign: 'center',
        },
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
    },

    groups: {
        display: 'flex',
        flexWrap: 'wrap',

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    wrapper: {
        width: 180,
    },

    link: {
        display: 'block',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        fontSize: theme.fontSizes.sm,
        paddingTop: 3,
        paddingBottom: 3,

        '&:hover': {
            textDecoration: 'underline',
        },
    },

    title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        marginBottom: theme.spacing.xs / 2,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

    afterFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },

    social: {
        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.xs,
        },
    },

}));

const DATA =  [
        {
            "title": "Cache Headers",
            "links": [
                {
                    "label": "cache-control",
                    "link": "#"
                },
                {
                    "label": "expires",
                    "link": "#"
                },
                {
                    "label": "last-modified",
                    "link": "#"
                },
                {
                    "label": "etag",
                    "link": "#"
                }
            ]
        },
        {
            "title": "Content Headers",
            "links": [
                {
                    "label": "content-type",
                    "link": "#"
                },
                {
                    "label": "content-length",
                    "link": "#"
                },
                {
                    "label": "content-encoding",
                    "link": "#"
                },
                {
                    "label": "transfer-encoding",
                    "link": "#"
                }
            ]
        },
        {
            "title": "Security Headers",
            "links": [
                {
                    "label": "content-security-policy",
                    "link": "#"
                },
                {
                    "label": "x-frame-options",
                    "link": "#"
                },
                {
                    "label": "x-xss-protection",
                    "link": "#"
                },
                {
                    "label": "x-content-type-options",
                    "link": "#"
                }
            ]
        }
    ];

interface FooterLinksProps {
    data: {
        title: string;
        links: { label: string; link: string }[];
    }[];
}

export function FooterLinks() {
    const { classes } = useStyles();
    const groups = DATA.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<'a'>
                key={index}
                className={classes.link}
                component="a"
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title} variant="gradient" gradient={{ from: "grape", to: "blue", deg: 200 }}>{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Text size="xl" weight={700} className={classes.title} variant="gradient" gradient={{ from: "grape", to: "blue", deg: 200 }}
                        sx={{
                        fontFamily: 'Monaco, monospace',
                    }}>
                        HTTP:COLON
                    </Text>
                    <Text size="xs" color="dimmed" className={classes.description}>
                        The very best tool for HTTP headers
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text variant="gradient" gradient={{ from: "grape", to: "blue", deg: 200 }} size="sm">
                    Made in San Francisco
                    <br />
                    © 2023 httpcolon.dev. All rights reserved.
                </Text>
                <Group spacing={10} className={classes.social} position="right" noWrap>
                        <Anchor href="https://twitter.com/nmungel" target="_blank">
                            <IconBrandTwitter size={18} stroke={1.5} />
                        </Anchor>
                        <Anchor href="https://github.com/hyfather/httpcolon" target="_blank">
                            <IconBrandGithub size={18} stroke={1.5} />
                        </Anchor>
                </Group>
            </Container>
        </footer>
    );
}