import { SearchBoxState as SearchBoxStateType } from '@coveo/headless';
import { Box, LoadingOverlay, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { v5 as uuidv5 } from 'uuid';

import {
  clearSearch,
  coveoOnChangeHandler,
  coveoOnSubmitHandler,
  searchBox,
  searchEngine,
  searchPathRegex,
  tabList,
} from '@/coveo/headless';
import { Button } from '@mantine/core';
import { getUrlParam } from '@/utils/urlParam';

import styles from './CoveoSearchBox.module.css';

export type CoveoSearchBoxProps = {
  accessibilitySearch: string,
  closeSearchModule?: () => void,
  error: string,
  placeholder: string,
  querySummary?: ReactNode,
  // need to pass when the variant is Button
  submitButtonLabel?: string,
  searchSuggestionTitle?: string,
  variant?: 'findProgram' | 'icon',
};

export function CoveoSearchBox({
  accessibilitySearch,
  closeSearchModule,
  error,
  placeholder,
  querySummary,
  submitButtonLabel,
  searchSuggestionTitle = 'Suggested searches',
  variant = 'icon',
}: CoveoSearchBoxProps) {
  const router = useRouter();

  const headlessSearchBox = useMemo(
    () => searchBox,
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine, router.locale],
  );

  const [defaultValue, setDefaultValue] = useState<string>('');
  const [value, setValue] = useState<string>(defaultValue);
  const [opened, setOpened] = useState<boolean>(false);
  const [focused, setFocused] = useState(false);
  const [searchBoxState, setSearchBoxState] = useState<SearchBoxStateType>(headlessSearchBox.state);
  const programTab = `&tab=${tabList.programs}`;

  const form = useForm({
    initialValues: { search: value },
    validate: {
      search: isNotEmpty(error),
    },
  });

  const hasValue = value !== '' && value !== null;

  const closeSearchHeaderModule = () => {
    if (closeSearchModule) {
      setTimeout(() => closeSearchModule(), 1000);
    }
  };

  const onSubmitHandler = () => {
    if (!hasValue) {
      form.validate();
      return;
    }
    setOpened(true);
    coveoOnSubmitHandler({
      router,
      setLoading: setOpened,
      query: variant === 'findProgram' ? programTab : '',
    });
    closeSearchHeaderModule();
  };

  const restSearchHandler = () => {
    form.reset();
    setValue('');
    clearSearch();
  };

  const rightSection = (
    <>
      {hasValue && (
        <Button
          className={clsx(styles.button)}
          onClick={restSearchHandler}
          type="reset"
          variant="unstyled"
        />
      )}

      <Button
        className={clsx(
          styles.button,
          { [styles.submitButton]: variant === 'findProgram' },
          { 'theme theme__white': variant === 'findProgram' },
          { [styles.submitIcon]: variant === 'icon' },
        )}
        variant={variant === 'findProgram' ? 'default' : 'unstyled'}
        onClick={onSubmitHandler}
      >
        {variant === 'findProgram' && submitButtonLabel}
      </Button>
    </>
  );

  const onChangeHandler = (val: string) => {
    coveoOnChangeHandler(val);
    setValue(val);
    form.setValues({
      search: val,
    });
  };

  const selectSuggestionHandler = (val: string) => {
    headlessSearchBox.selectSuggestion(val);
    onChangeHandler(val);
    closeSearchHeaderModule();
    router
      .push(`/search?q=${val}${variant === 'findProgram' ? programTab : ''}`)
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Error when redirect to search page: ', e);
      });
  };

  useEffect(() => {
    /* Add the search query to the searchbox */
    if (router.asPath && searchPathRegex.test(router.asPath)) {
      const defaultV = getUrlParam('q', router);
      setDefaultValue(defaultV);
      form.setValues({
        search: defaultV,
      });
    }
  }, [router.asPath]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    headlessSearchBox.subscribe(() => setSearchBoxState(headlessSearchBox.state));
    return headlessSearchBox.subscribe(() => {});
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <Box pos="relative" className={clsx(styles.searchBox)}>
      <form
        className={clsx(styles.form)}
        onSubmit={form.onSubmit(() => {
          onSubmitHandler();
        })}
      >
        <TextInput
          {...form.getInputProps('search')}
          autoComplete="off"
          className={clsx(
            styles.input,
            'rounded',
            { hasValue },
            { isFocused: focused },
            { [styles.input__isButton]: variant === 'findProgram' },
          )}
          value={value}
          onChange={(e) => onChangeHandler(e.currentTarget.value)}
          label={accessibilitySearch}
          placeholder={placeholder}
          rightSection={rightSection}
          type="text"
          variant="default"
          onBlur={() => {
            /* set time out is for the search suggestions' onClick function */
            setTimeout(() => setFocused(false), 200);
          }}
          onFocus={() => {
            setFocused(true);
          }}
        />
        <div className={clsx(styles.querySummary)}>{querySummary}</div>
        {/* Suggestions */}
        {searchBoxState.suggestions.length > 0 && focused && (
          <div
            className={clsx(styles.suggestedSearches)}
          >
            <div className={clsx(styles.title, 'body-s-compact')}>
              {searchSuggestionTitle}
            </div>
            <div className={clsx(styles.items)}>
              {searchBoxState.suggestions.map((suggestion, index) => (
                <Button
                  variant="unstyled"
                  onClick={() => selectSuggestionHandler(suggestion.rawValue)}
                  className={clsx(styles.item, styles.link)}
                  key={uuidv5(`item-${index}`, uuidv5.URL)}
                >
                  {/* example: highlightedValue: <strong>stu</strong>dent */}
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: suggestion?.highlightedValue }} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </form>
      <LoadingOverlay
        visible={opened}
        zIndex={1000}
        overlayProps={{ radius: '50px', blur: 1 }}
      />
    </Box>
  );
}
