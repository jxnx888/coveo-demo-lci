import "@/styles/globals.css";
import Header from "@/components/Header/Header";
import type { AppProps } from "next/app";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles/Accordion.css';
import '@mantine/core/styles/ActionIcon.css';
import '@mantine/core/styles/Affix.css';
import '@mantine/core/styles/Anchor.css';
import '@mantine/core/styles/Alert.css';
import '@mantine/core/styles/AppShell.css';
import '@mantine/core/styles/AspectRatio.css';
import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/Badge.css';
import '@mantine/core/styles/Blockquote.css';
import '@mantine/core/styles/BackgroundImage.css';
import '@mantine/core/styles/Burger.css';
import '@mantine/core/styles/Breadcrumbs.css';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/Card.css';
import '@mantine/core/styles/Center.css';
import '@mantine/core/styles/Checkbox.css';
import '@mantine/core/styles/Chip.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/Code.css';
import '@mantine/core/styles/ColorInput.css';
import '@mantine/core/styles/ColorPicker.css';
import '@mantine/core/styles/ColorSwatch.css';
import '@mantine/core/styles/Container.css';
import '@mantine/core/styles/Combobox.css';
import '@mantine/core/styles/Dialog.css';
import '@mantine/core/styles/Divider.css';
import '@mantine/core/styles/Drawer.css';
import '@mantine/core/styles/Fieldset.css';
import '@mantine/core/styles/Flex.css';
import '@mantine/core/styles/Grid.css';
import '@mantine/core/styles/Group.css';
import '@mantine/core/styles/Indicator.css';
import '@mantine/core/styles/InlineInput.css';
import '@mantine/core/styles/Image.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/List.css';
import '@mantine/core/styles/LoadingOverlay.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Kbd.css';
import '@mantine/core/styles/Mark.css';
import '@mantine/core/styles/Menu.css';
import '@mantine/core/styles/ModalBase.css';
import '@mantine/core/styles/Modal.css';
import '@mantine/core/styles/NavLink.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/Pagination.css';
import '@mantine/core/styles/Overlay.css';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/Pill.css';
import '@mantine/core/styles/PasswordInput.css';
import '@mantine/core/styles/PillsInput.css';
import '@mantine/core/styles/PinInput.css';
import '@mantine/core/styles/Popover.css';
import '@mantine/core/styles/Radio.css';
import '@mantine/core/styles/Progress.css';
import '@mantine/core/styles/Rating.css';
import '@mantine/core/styles/RingProgress.css';
import '@mantine/core/styles/SegmentedControl.css';
import '@mantine/core/styles/ScrollArea.css';
import '@mantine/core/styles/SimpleGrid.css';
import '@mantine/core/styles/Skeleton.css';
import '@mantine/core/styles/Slider.css';
import '@mantine/core/styles/Stack.css';
import '@mantine/core/styles/Stepper.css';
import '@mantine/core/styles/Spoiler.css';
import '@mantine/core/styles/Switch.css';
import '@mantine/core/styles/Table.css';
import '@mantine/core/styles/Tabs.css';
import '@mantine/core/styles/Text.css';
import '@mantine/core/styles/ThemeIcon.css';
import '@mantine/core/styles/Timeline.css';
import '@mantine/core/styles/Title.css';
import '@mantine/core/styles/Tooltip.css';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/TypographyStylesProvider.css';
import '@mantine/core/styles/VisuallyHidden.css';
import React from "react";
export default function App({Component, pageProps}: AppProps) {
  return <MantineProvider
    theme={{
      breakpoints: {xs: '0', sm: '36rem', md: '48rem', lg: '62rem', xl: '75rem'},
      components: {
        Autocomplete: {defaultProps: {comboboxProps: {withinPortal: false}, withScrollArea: false}},
        InputWrapper: {defaultProps: {inputWrapperOrder: ['label', 'input', 'description', 'error']}},
        Select: {defaultProps: {comboboxProps: {withinPortal: false}, withCheckIcon: false, withScrollArea: false}},
        Textarea: {defaultProps: {autosize: true}},
      },
      fontFamily: 'var(--font-default)',
      fontSizes: {xs: '1.4rem', sm: '1.6rem', md: '1.8rem', lg: '2rem', xl: '2.2rem'},
    }}
  >
    <Header />
    <Component {...pageProps} />
  </MantineProvider>;
}
