import type { ReactElement } from 'react';
import React from 'react';
import type { IconProps } from '../../Icon';
import Icon from '../../Icon';
import PrimaryIcon from './primary.svg';
import SecondaryIcon from './secondary.svg';

export const TelegramIcon = (props: IconProps): ReactElement => (
  <Icon {...props} IconPrimary={PrimaryIcon} IconSecondary={SecondaryIcon} />
);
