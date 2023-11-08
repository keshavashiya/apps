import React, { ReactElement, useEffect } from 'react';
import { Button } from '@dailydotdev/shared/src/components/buttons/Button';
import { ProfileImageLink } from '@dailydotdev/shared/src/components/profile/ProfileImageLink';
import KeyIcon from '@dailydotdev/shared/src/components/icons/Key';
import { AuthTriggers } from '@dailydotdev/shared/src/lib/auth';
import { feature } from '@dailydotdev/shared/src/lib/featureManagement';
import { SearchExperiment } from '@dailydotdev/shared/src/lib/featureValues';
import { ActionType } from '@dailydotdev/shared/src/graphql/actions';
import { cloudinary } from '@dailydotdev/shared/src/lib/image';
import { ReferralCampaignKey } from '@dailydotdev/shared/src/hooks';
import { useFeature } from '@dailydotdev/shared/src/components/GrowthBookProvider';
import { useRouter } from 'next/router';
import { ComponentConfig, InviteComponentProps, DailyDevLogo } from './common';

export const AISearchInviteConfig: ComponentConfig = {
  actionType: ActionType.AcceptedSearch,
  feature: feature.search,
  featureControl: SearchExperiment.Control,
  campaignKey: ReferralCampaignKey.Search,
  authTrigger: AuthTriggers.SearchReferral,
};

export function AISearchInvite({
  referringUser,
  handleAcceptClick,
  isLoading,
  isSuccess,
  redirectTo,
}: InviteComponentProps): ReactElement {
  const router = useRouter();
  const featureValue = useFeature(AISearchInviteConfig.feature);

  useEffect(() => {
    if (featureValue === AISearchInviteConfig.featureControl) {
      return;
    }

    router.push(redirectTo);
    // router is an unstable dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectTo, featureValue]);

  return (
    <div className="flex overflow-hidden relative flex-col flex-1 justify-center items-center laptop:items-start p-6 h-full min-h-page">
      <DailyDevLogo />
      <div className="flex relative z-1 flex-col laptop:ml-3 w-full tablet:max-w-[27.5rem] laptopL:ml-[9.75rem]">
        <span className="flex flex-col laptop:flex-row gap-3 tablet:gap-4 laptop:gap-2 items-center laptop:items-start mb-6 tablet:mb-10 laptop:mb-8">
          <ProfileImageLink user={referringUser} />
          <p className="text-center laptop:text-left text-theme-label-tertiary typo-callout">
            {referringUser.name}
            <br />
            invites you to try daily.dev search
          </p>
        </span>
        <h1 className="w-full font-bold text-center laptop:text-left break-words-overflow typo-large-title tablet:typo-mega3">
          {referringUser.name.split(' ')[0]} gave you early access to daily.dev
          search!
        </h1>
        <p className="mt-6 text-center laptop:text-left text-theme-label-secondary">
          This isn’t just another search engine; it’s a search engine that’s
          both fine-tuned for developers and fully integrated into the daily.dev
          ecosystem.
        </p>
        <Button
          icon={<KeyIcon secondary />}
          className="mt-12 btn-primary"
          onClick={handleAcceptClick}
          type="button"
          loading={isLoading}
          disabled={isLoading || isSuccess}
        >
          Accept invitation ➔
        </Button>
      </div>
      <img
        src={cloudinary.referralCampaign.search.bg}
        alt="search input depicting our new AI search feature"
        className="hidden laptop:block absolute right-0 z-0 tablet:w-1/2"
      />
      <img
        src={cloudinary.referralCampaign.search.bgPopupMobile}
        alt="search input depicting our new AI search feature"
        className="hidden tablet:block laptop:hidden max-w-[27.5rem]"
      />
      <img
        src={cloudinary.referralCampaign.search.bgMobile}
        alt="search input depicting our new AI search feature"
        className="block tablet:hidden absolute inset-0 z-0 w-full translate-y-1/2 top-[unset]"
      />
    </div>
  );
}
