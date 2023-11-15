import React, { ReactElement, useContext, useMemo } from 'react';
import classNames from 'classnames';
import request from 'graphql-request';
import { useQuery } from 'react-query';
import AuthContext from '../../contexts/AuthContext';
import {
  FURTHER_READING_QUERY,
  FurtherReadingData,
} from '../../graphql/furtherReading';
import { graphqlUrl } from '../../lib/config';
import { Post, PostType } from '../../graphql/posts';
import { FeedData, SOURCE_FEED_QUERY } from '../../graphql/feed';
import LeanFeed from '../feed/LeanFeed';
import { FeedItem } from '../../hooks/useFeed';
import { ActiveFeedContextProvider } from '../../contexts';
import LeanFeedItemComponent from '../feed/LeanFeedItemComponent';
import { Card } from '../feed/cards/atoms/Card';
import { CardButton } from '../feed/cards/atoms/CardAction';
import { Flag } from '../feed/cards/atoms/Flag';
import styles from '../cards/Card.module.css';
import { RaisedLabelType } from '../cards/RaisedLabel';
import { FlagContainer } from '../feed/cards/atoms/FlagContainer';
import SourceButton from '../cards/SourceButton';
import { ProfilePicture } from '../ProfilePicture';
import {
  Typography,
  TypographyElement,
  TypographyType,
} from '../feed/cards/atoms/Typography';

export type FurtherReadingProps = {
  currentPost: Post;
  className?: string;
};

export default function FurtherReadingSquad({
  currentPost,
  className,
}: FurtherReadingProps): ReactElement {
  const postId = currentPost.id;
  const { tags } = currentPost;
  const queryKey = ['furtherReading', postId];
  const { user, isLoggedIn } = useContext(AuthContext);

  const { data: posts, isFetching } = useQuery<FurtherReadingData>(
    queryKey,
    async () => {
      const squad = currentPost.source;

      const squadPostsResult = await request<FeedData>(
        graphqlUrl,
        SOURCE_FEED_QUERY,
        {
          first: 3,
          loggedIn: isLoggedIn,
          source: squad.id,
          ranking: 'TIME',
          supportedTypes: [PostType.Article, PostType.Share, PostType.Freeform],
        },
      );
      const similarPosts =
        squadPostsResult?.page?.edges
          ?.map((item) => item.node)
          ?.filter((item) => item.id !== currentPost.id) || [];

      return {
        trendingPosts: [],
        similarPosts,
        discussedPosts: [],
      };

      return request(graphqlUrl, FURTHER_READING_QUERY, {
        loggedIn: !!user,
        post: postId,
        trendingFirst: 1,
        similarFirst: 3,
        discussedFirst: 4,
        tags,
      });
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnMount: false,
    },
  );

  const similarPosts = useMemo(() => {
    let newItems: FeedItem[] = [];

    if (posts?.similarPosts) {
      newItems = posts.similarPosts.map((post, index) => ({
        type: 'post',
        post,
        page: 0,
        index,
      }));
    }

    if (isFetching) {
      newItems.push(...Array(1).fill({ type: 'placeholder' }));
    }
    return newItems;
  }, [isFetching, posts]);

  const altOnClick = (e) => {
    alert('some overwrite value');
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-theme-overlay-float-avocado">
      <div className="w-full border-b border-b-theme-divider-tertiary">
        <p className="p-4 tablet:px-8 font-bold typo-callout text-theme-label-tertiary">
          More posts from squad_name
        </p>
      </div>
      <div className={classNames(className, 'flex flex-col gap-6')}>
        {/* Card related stuff */}
        <FlagContainer>
          <Flag type={RaisedLabelType.Hot} description="Some text" />
          <Card>
            <div className="relative z-1">
              <CardButton />
              <SourceButton
                source={{
                  id: '1',
                  image: 'https://picsum.photos/200/300',
                  name: 'test',
                  handle: 'test',
                  permalink: 'https://daily.dev/test',
                }}
              />
              <ProfilePicture
                user={{
                  id: '1',
                  username: 'test',
                  image: 'https://picsum.photos/200/300',
                }}
              />
              <Typography type={TypographyType.Giga1} bold>
                Big one
              </Typography>
              <Typography>Some text</Typography>
              <Typography
                element={TypographyElement.H1}
                type={TypographyType.Callout}
                bold
              >
                Some text
              </Typography>
            </div>
          </Card>
        </FlagContainer>

        <ActiveFeedContextProvider items={similarPosts} queryKey={queryKey}>
          <LeanFeed>
            <p className="col-span-2">Some extra element</p>
            {similarPosts.map((item, i) => {
              return <LeanFeedItemComponent key={i} item={item} />;
            })}
            <div className="col-span-2">Maybe a load more trigger here</div>
          </LeanFeed>
        </ActiveFeedContextProvider>

        <p className="typo-title3">Alternative feed</p>
        <ActiveFeedContextProvider items={similarPosts} queryKey={queryKey}>
          <LeanFeed>
            {similarPosts.map((item, i) => {
              return <LeanFeedItemComponent key={i} item={item} />;
            })}
          </LeanFeed>
        </ActiveFeedContextProvider>
      </div>
    </div>
  );
}
