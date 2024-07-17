import { JSONValue } from '@growthbook/growthbook';
import { ShortcutsUIExperiment } from './featureValues';
import { cloudinary } from './image';

export class Feature<T extends JSONValue> {
  readonly id: string;

  readonly defaultValue?: T;

  constructor(id: string, defaultValue?: T) {
    this.id = id;
    this.defaultValue = defaultValue;
  }
}

const feature = {
  feedVersion: new Feature('feed_version', 15),
  onboardingVisual: new Feature('onboarding_visual', {
    showCompanies: true,
    fullBackground: false,
    image: cloudinary.onboarding.default,
  }),
  feedAdSpot: new Feature('feed_ad_spot', 0),
  searchVersion: new Feature('search_version', 1),
  readingReminder: new Feature('reading_reminder', false),
  featureTheme: new Feature('feature_theme', {}),
  shortcutsUI: new Feature('shortcuts_ui', ShortcutsUIExperiment.Control),
  showRoadmap: new Feature('show_roadmap', false),
  onboardingChecklist: new Feature('onboarding_checklist', false),
  bookmarkReminder: new Feature('bookmark_reminder', false),
  animatedUpvote: new Feature('animated_upvote', false),
  mobileExploreTab: new Feature('mobile_explore_tab', false),
};

export { feature };
