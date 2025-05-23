import classNames from 'classnames';
import type { ReactElement } from 'react';
import React from 'react';
import type { IconType } from '../../buttons/Button';
import type { SearchPanelItemContainerProps } from './SearchPanelInputContainer';
import { SearchPanelItemContainer } from './SearchPanelInputContainer';

export type SearchPanelItemProps = {
  icon?: IconType;
} & SearchPanelItemContainerProps;

export const SearchPanelItem = ({
  icon,
  children,
  ...props
}: SearchPanelItemProps): ReactElement => {
  return (
    <SearchPanelItemContainer
      {...props}
      className={classNames(
        props.className,
        'flex w-full items-center gap-2 overflow-hidden rounded-12 p-2 hover:bg-surface-float focus:bg-surface-float laptop:text-text-tertiary',
      )}
    >
      {!!icon && icon}
      {children}
    </SearchPanelItemContainer>
  );
};
