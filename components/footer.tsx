import {
  createStyles,
  Text,
  Container,
  ActionIcon,
  Group,
  Anchor,
  useMantineTheme,
  Stack,
  Badge,
  Tooltip,
  Avatar,
  MediaQuery,
  Space,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandInstagram,
} from '@tabler/icons';
import { useState } from 'react';
import { motion } from 'framer-motion';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
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

  logoborder: {
    background:
      theme.colorScheme === 'dark'
        ? theme.fn.gradient({
            from: theme.colors.grape[3],
            to: theme.colors.blue[3],
            deg: 200,
          })
        : theme.colors.gray[0],
    borderStyle: 'solid',
    borderWidth: theme.colorScheme === 'dark' ? '4px' : '1px',
    borderImage: 'linear-gradient(45deg, #E599F7, #74C0FC) 1',
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

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  wrapper: {
    width: 180,
  },

  link: {
    display: 'block',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.xs,
    paddingTop: 3,
    paddingBottom: 3,

    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'grape',
    },
  },

  title: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    fontFamily: 'Monaco, monospace',
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

const DATA = [
  {
    title: 'Cache Headers',
    links: [
      {
        label: 'cache-control',
        link: '#',
      },
      {
        label: 'expires',
        link: '#',
      },
      {
        label: 'last-modified',
        link: '#',
      },
      {
        label: 'etag',
        link: '#',
      },
    ],
  },
  {
    title: 'Content Headers',
    links: [
      {
        label: 'content-type',
        link: '#',
      },
      {
        label: 'content-length',
        link: '#',
      },
      {
        label: 'content-encoding',
        link: '#',
      },
      {
        label: 'transfer-encoding',
        link: '#',
      },
    ],
  },
  {
    title: 'Security Headers',
    links: [
      {
        label: 'content-security-policy',
        link: '#',
      },
      {
        label: 'x-frame-options',
        link: '#',
      },
      {
        label: 'x-xss-protection',
        link: '#',
      },
      {
        label: 'x-content-type-options',
        link: '#',
      },
    ],
  },
];

interface FooterLinksProps {
  setDrawerOpened: Function;
  setDrawerFocus: Function;
}

export function FooterLinks({
  setDrawerOpened,
  setDrawerFocus,
}: FooterLinksProps) {
  const { classes } = useStyles();

  const groups = DATA.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        sx={{
          fontFamily: 'Monaco, monospace',
        }}
        component="a"
        onClick={() => {
          setDrawerOpened(true);
          setDrawerFocus(link.label + '$');
        }}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text
          className={classes.title}
          variant="gradient"
          gradient={{ from: 'grape', to: 'blue', deg: 200 }}
          sx={{
            fontFamily: 'Monaco, monospace',
          }}
        >
          {group.title}
        </Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Group spacing="xs">
            <Avatar
              className={classes.logoborder}
              src="/httpcolon3.png"
              alt="it's me, http:colon"
              size="sm"
            ></Avatar>

            <Text
              size="xl"
              mt={0}
              weight={700}
              className={classes.title}
              variant="gradient"
              gradient={{ from: 'grape', to: 'blue', deg: 200 }}
              sx={{
                fontFamily: 'Monaco, monospace',
              }}
            >
              HTTP:COLON
            </Text>
            <Text
              size="xs"
              color="dimmed"
              className={classes.description}
              sx={{
                fontFamily: 'Monaco, monospace',
              }}
              mt={-5}
              ml={0}
            >
              The best tool for HTTP
            </Text>
          </Group>

          <Tooltip
            color="gray"
            size="xs"
            label={'may crash your browser tab'}
            inline
          >
            <Badge color="gray" variant="outline" size="xs" radius="sm">
              BETA
            </Badge>
          </Tooltip>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Group className={classes.afterFooter} position="apart">
        <Stack ml="20px">
          <Text
            variant="gradient"
            gradient={{ from: 'grape', to: 'blue', deg: 200 }}
            size={10}
          >
            © 2023 HTTP:COLON // All rights reserved
          </Text>
          <Text
            variant="gradient"
            gradient={{ from: 'grape', to: 'blue', deg: 200 }}
            size={10}
            mt={-15}
            ml={40}
          >
            ✨ Made in San Francisco
          </Text>
        </Stack>
        <Group
          spacing={10}
          className={classes.social}
          position="right"
          noWrap
          mr="20px"
        >
          <Anchor href="https://twitter.com/nmungel" target="_blank">
            <IconBrandTwitter size={18} stroke={1.5} />
          </Anchor>
          <Anchor href="https://github.com/hyfather/httpcolon" target="_blank">
            <IconBrandGithub size={18} stroke={1.5} />
          </Anchor>
        </Group>
      </Group>
    </footer>
  );
}
