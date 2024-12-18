import React, { useState, type FormEvent, type ReactElement } from 'react';
import classNames from 'classnames';
import { useViewSize, ViewSize } from '../../../hooks';
import { Modal, type ModalProps } from '../common/Modal';
import { ButtonVariant } from '../../buttons/common';
import { ModalHeader } from '../common/ModalHeader';
import { TextField } from '../../fields/TextField';
import {
  Typography,
  TypographyColor,
  TypographyTag,
  TypographyType,
} from '../../typography/Typography';
import { Button } from '../../buttons/Button';
import { emojiOptions } from '../../../lib/constants';
import { DevPlusIcon, HashtagIcon } from '../../icons';
import { IconSize } from '../../Icon';
import type { BookmarkFolder } from '../../../graphql/bookmarks';

type NewFeedProps = Pick<BookmarkFolder, 'id' | 'name' | 'icon'>;

type AddToCustomFeedModalProps = Omit<ModalProps, 'children'> & {
  onSubmit: (feed: NewFeedProps) => void;
  feed?: NewFeedProps;
};

const ModalTitle = () => (
  <>
    <ModalHeader.Title className="typo-title3">
      New Custom Feed
    </ModalHeader.Title>
    <Typography
      tag={TypographyTag.Span}
      type={TypographyType.Caption1}
      className="flex items-center rounded-4 bg-action-plus-float px-1"
      bold
      color={TypographyColor.Plus}
    >
      <DevPlusIcon size={IconSize.Size16} />
      Plus
    </Typography>
  </>
);

const AddToCustomFeedModal = ({
  feed,
  onSubmit,
  ...rest
}: AddToCustomFeedModalProps): ReactElement => {
  const [icon, setIcon] = useState(feed?.icon || '');
  const [name, setName] = useState(feed?.name || '');
  const isMobile = useViewSize(ViewSize.MobileL);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ ...feed, name, icon });
  };

  return (
    <Modal
      formProps={{
        form: 'create_new_feed',
        title: (
          <div className="flex gap-1 px-4">
            <ModalTitle />
          </div>
        ),
        rightButtonProps: {
          variant: ButtonVariant.Primary,
          disabled: name.length === 0,
        },
        copy: { right: `${feed ? 'Update' : 'Create'} feed` },
      }}
      kind={Modal.Kind.FlexibleCenter}
      size={Modal.Size.Small}
      {...rest}
    >
      <form onSubmit={handleSubmit} id="create_feed">
        <ModalHeader showCloseButton={!isMobile} className="gap-2">
          <ModalTitle />
        </ModalHeader>
        <Modal.Body className="flex flex-col gap-5 tablet:gap-4">
          <TextField
            maxLength={50}
            label="Give your feed a name..."
            name="name"
            inputId="newCustomFeed"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoComplete="off"
            autoFocus
          />
          <Typography bold type={TypographyType.Body}>
            Choose an icon
          </Typography>
          <ul
            className="flex flex-wrap gap-4 laptop:justify-evenly"
            role="radiogroup"
          >
            {emojiOptions.map((emoji) => (
              <Button
                type="button"
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={classNames(
                  '!size-12',
                  icon === emoji && 'border-surface-focus',
                )}
                variant={ButtonVariant.Float}
                aria-checked={icon === emoji || (!emoji && icon === '')}
                role="radio"
              >
                {!emoji ? (
                  <HashtagIcon size={IconSize.Large} />
                ) : (
                  <Typography
                    tag={TypographyTag.Span}
                    type={TypographyType.Title1}
                  >
                    {emoji}
                  </Typography>
                )}
              </Button>
            ))}
          </ul>
          {!isMobile && (
            <Button
              type="submit"
              disabled={name.length === 0}
              variant={ButtonVariant.Primary}
            >
              Create feed
            </Button>
          )}
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default AddToCustomFeedModal;
