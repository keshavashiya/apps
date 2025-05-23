import type { ReactElement, ReactNode } from 'react';
import React, { Fragment } from 'react';
import type { UseInfiniteQueryResult } from '@tanstack/react-query/build/legacy/types';
import type { InfiniteData } from '@tanstack/react-query';
import classed from '../../lib/classed';
import { IconSize } from '../Icon';
import type { FeedData } from '../../graphql/feed';
import type { Post } from '../../graphql/posts';
import type { WithClassNameProps } from '../utilities';

export const ActivityContainer = classed('section', 'flex flex-col');

export const ActivitySectionTitle = classed(
  'h2',
  'flex items-center mb-4 text-text-primary font-bold typo-body',
);

export const ActivitySectionSubTitle = classed(
  'span',
  'mt-1 text-text-tertiary typo-callout font-normal',
);

export const ActivitySectionTitleStat = classed(
  'span',
  'ml-1 text-text-secondary font-normal',
);

interface ActivitySectionHeaderProps {
  title: string;
  children?: ReactNode;
  Icon?: React.ElementType;
}

export const ActivitySectionHeader = ({
  title,
  children,
  Icon,
  className,
}: ActivitySectionHeaderProps & WithClassNameProps): ReactElement => {
  return (
    <ActivitySectionTitle className={className}>
      <span className="flex align-middle">
        {Icon && <Icon size={IconSize.Small} secondary className="mr-2" />}
        {title}
      </span>
      {children}
    </ActivitySectionTitle>
  );
};

export const LoadMore = classed(
  'button',
  'mt-3 self-start p-0 bg-none border-none text-text-link cursor-pointer typo-callout font-outline',
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ActivitySectionProps<TElement, TError> {
  title: string;
  count?: number;
  query: UseInfiniteQueryResult<InfiniteData<FeedData>>;
  emptyScreen: ReactNode;
  elementToNode: (element: Post) => ReactNode;
}

export default function ActivitySection<TElement, TError>({
  title,
  count,
  query,
  emptyScreen,
  elementToNode,
}: ActivitySectionProps<TElement, TError>): ReactElement {
  const showEmptyScreen =
    !query.isFetchingNextPage &&
    !query.isLoading &&
    !query?.data?.pages?.[0]?.page?.edges.length;
  const showLoadMore =
    !query.isLoading && !query.isFetchingNextPage && query.hasNextPage;

  return (
    <ActivityContainer>
      <ActivitySectionTitle>
        {title}
        {count >= 0 && (
          <ActivitySectionTitleStat>({count})</ActivitySectionTitleStat>
        )}
      </ActivitySectionTitle>
      {showEmptyScreen && emptyScreen}
      {!showEmptyScreen &&
        query.data?.pages?.map((page) => (
          <Fragment key={page.page.pageInfo.endCursor}>
            {page.page.edges.map(({ node }) => elementToNode(node))}
          </Fragment>
        ))}
      {!showEmptyScreen && query.hasNextPage && (
        <LoadMore
          onClick={() => query.fetchNextPage()}
          style={{ visibility: showLoadMore ? 'unset' : 'hidden' }}
        >
          Load more ▸
        </LoadMore>
      )}
    </ActivityContainer>
  );
}
