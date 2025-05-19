import {
  Card,
  Container,
  Text,
  Progress,
  Badge,
  Group,
  ActionIcon,
  Code,
  Button,
  Popover,
  CopyButton,
  Avatar,
  Space,
  Divider,
  createStyles,
  NativeSelect,
  TextInput,
} from '@mantine/core';
import {
  IconCopy,
  IconEdit,
  IconLink,
  IconRefresh,
  IconUpload,
  IconWorld,
} from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { useEventListener } from '@mantine/hooks';

interface ColonizeProps {
  focus: boolean;
  setRedirect: Function;
  onSubmit: Function;
}

const useStyles = createStyles((theme) => ({
  inputBox: {
    width: '300px',
  },
}));

const INTERESTING_URLS = [
  'www.google.com',
  'www.facebook.com',
  'www.youtube.com',
  'www.amazon.com',
  'www.wikipedia.org',
  'www.reddit.com',
  'www.twitter.com',
  'www.instagram.com',
  'www.netflix.com',
  'www.yahoo.com',
  'www.microsoft.com',
  'www.tiktok.com',
  'www.linkedin.com',
  'www.ebay.com',
  'www.tumblr.com',
  'www.pinterest.com',
  'www.paypal.com',
  'www.imgur.com',
  'www.apple.com',
  'www.craigslist.org',
  'www.stackoverflow.com',
];

function placeholderURL() {
  return INTERESTING_URLS[Math.floor(Math.random() * INTERESTING_URLS.length)];
}

export function ColonizeForm({ setRedirect, focus, onSubmit }: ColonizeProps) {
  const [inputValue, setInputValue] = useState('');
  const [methodValue, setMethodValue] = useState('GET');
  const [baseURL, setBaseURL] = useState<string>('');
  const { classes, theme } = useStyles();
  const inputRef = useEventListener('keydown', handleInputChange);
  const [placeHolder, setPlaceHolder] = useState('');

  useEffect(() => {
    setBaseURL(window.location.origin);
    focus ? inputRef.current?.focus() : null;
    placeHolder === '' ? setPlaceHolder(placeholderURL()) : null;
  }, [focus]);

  const form = useForm({
    initialValues: { url: '', method: '' },
  });

  function handleInputChange(event) {
    const TABKEY = 9;
    if (event.keyCode === TABKEY) {
      // console.log('tab key pressed', inputValue.length);
      if (inputValue.length === 0) {
        event.preventDefault();
        setInputValue(placeHolder);
        return;
      }
    }
    setInputValue(event.target.value);
  }

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        // console.log('redirecting', inputValue);
        const strippedUrl = inputValue
          .replace(/(^\w+:|^)\/\//, '')
          .split('?')[0];
        if (onSubmit != null) {
          setInputValue(strippedUrl);
          onSubmit(strippedUrl, methodValue);
        } else {
          const redirectUrl =
            methodValue === 'GET'
              ? `${baseURL}/${strippedUrl}`
              : `${baseURL}/${strippedUrl}?method=${methodValue}`;
          // console.log(`redirectUrl: ${redirectUrl}/${methodValue}`);
          setRedirect(redirectUrl);
        }
      })}
    >
      <Group spacing="sm">
        <NativeSelect
          size="xs"
          variant="filled"
          value={methodValue}
          data={['GET', 'POST', 'PUT', 'DELETE']}
          onChange={(event) =>
            event.currentTarget.value &&
            setMethodValue(event.currentTarget.value)
          }
        />
        <TextInput
          placeholder={placeHolder}
          // className={classes.inputBox}
          width={{ sm: 200, lg: 400 }}
          icon={<IconWorld size={12} />}
          size="xs"
          autoComplete="on"
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
          rightSection={
            inputValue.length === 0 ? (
              <Badge
                color="gray"
                variant="outline"
                size="xs"
                radius="xs"
                ml={-5}
                mr={5}
              >
                TAB
              </Badge>
            ) : (
              <Badge
                color="gray"
                variant="outline"
                size="xs"
                radius="xs"
                pt={2}
              >
                ↵
              </Badge>
            )
          }
        />
        <Button
          size="xs"
          type="submit"
          variant="gradient"
          gradient={{ from: theme.colors.blue[10], to: theme.colors.grape[7] }}
        >
          GO
        </Button>
      </Group>
    </form>
  );
}
