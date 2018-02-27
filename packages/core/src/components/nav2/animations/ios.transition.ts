import { Animation, AnimationOptions } from '../../../index';
import { isDef } from '../../../utils/helpers';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';

export default function iosTransitionAnimation(Animation: Animation, _: HTMLElement, opts: AnimationOptions): Promise<Animation> {
  const rootTransition = new Animation();

  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  const nav = opts.nav;


  const isRTL = document.dir === 'rtl';
  const OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
  const OFF_LEFT = isRTL ? '31%' : '-31%';

  rootTransition.duration(isDef(opts.duration) ? opts.duration : DURATION);
  rootTransition.easing(isDef(opts.easing) ? opts.easing : EASING);


  rootTransition.addElement(enteringEl);
  rootTransition.beforeRemoveClass('hide-page');

  if (leavingEl) {
    const navEl = leavingEl.closest('ion-nav');
    if (navEl) {
      const navDecor = new Animation();
      navDecor.addElement(navEl).duringAddClass('show-decor');
      rootTransition.add(navDecor);
    }
  }

  const backDirection = (opts.direction === 'back');
  // setting up enter view
  if (enteringEl) {
    const contentEl = enteringEl.querySelector('ion-content');
    const headerEls = enteringEl.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *');
    const enteringToolBarEle = enteringEl.querySelector('ion-toolbar');
    const enteringContent = new Animation();

    if (!contentEl && !enteringToolBarEle && headerEls.length === 0) {
      enteringContent.addElement(enteringEl.querySelector('ion-page,ion-nav,ion-tabs'));
    } else {
      enteringContent.addElement(contentEl);
      enteringContent.addElement(headerEls);
    }

    rootTransition.add(enteringContent);

    if (backDirection) {
      enteringContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
        .fromTo(OPACITY, OFF_OPACITY, 1, true);
    } else {
      // entering content, forward direction
      enteringContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

    }

    if (enteringToolBarEle) {
      const enteringToolBar = new Animation();
      enteringToolBar.addElement(enteringToolBarEle);
      rootTransition.add(enteringToolBar);

      const enteringTitle = new Animation();
      enteringTitle.addElement(enteringToolBarEle.querySelector('ion-title'));

      const enteringToolBarItems = new Animation();
      enteringToolBarItems.addElement(enteringToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const enteringToolBarBg = new Animation();
      enteringToolBarBg.addElement(enteringToolBarEle.querySelector('.toolbar-background'));

      const enteringBackButton = new Animation();
      enteringBackButton.addElement(enteringToolBarEle.querySelector('.back-button'));

      enteringToolBar
        .add(enteringTitle)
        .add(enteringToolBarItems)
        .add(enteringToolBarBg)
        .add(enteringBackButton);

      enteringTitle.fromTo(OPACITY, 0.01, 1, true);
      enteringToolBarItems.fromTo(OPACITY, 0.01, 1, true);

      if (backDirection) {
        enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

        if (nav.canGoBack()) {
          // back direction, entering page has a back button
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS).fromTo(OPACITY, 0.01, 1, true);
        }
      } else {
        // entering toolbar, forward direction
        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        enteringToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        if (nav.canGoBack()) {

          // forward direction, entering page has a back button
          enteringBackButton
            .beforeAddClass(SHOW_BACK_BTN_CSS)
            .fromTo(OPACITY, 0.01, 1, true);


          const enteringBackBtnText = new Animation();
          enteringBackBtnText.addElement(enteringToolBarEle.querySelector('.back-button .button-text'));

          enteringBackBtnText.fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');
          enteringToolBar.add(enteringBackBtnText);
        } else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }
  }

  // setup leaving view
  if (leavingEl) {

    const leavingContent = new Animation();
    leavingContent.addElement(leavingEl.querySelector('ion-content'));
    leavingContent.addElement(leavingEl.querySelectorAll('ion-header > *:not(ion-toolbar),ion-footer > *'));
    rootTransition.add(leavingContent);

    if (backDirection) {
      // leaving content, back direction
      leavingContent
        .beforeClearStyles([OPACITY])
        .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));


    } else {
      // leaving content, forward direction
      leavingContent
        .fromTo(TRANSLATEX, CENTER, OFF_LEFT, true)
        .fromTo(OPACITY, 1, OFF_OPACITY, true);
    }

    const leavingToolBarEle = leavingEl.querySelector('ion-toolbar');
    if (leavingToolBarEle) {
      const leavingToolBar = new Animation();
      leavingToolBar.addElement(leavingToolBarEle);

      const leavingTitle = new Animation();
      leavingTitle.addElement(leavingToolBarEle.querySelector('ion-title'));

      const leavingToolBarItems = new Animation();
      leavingToolBarItems.addElement(leavingToolBarEle.querySelectorAll('ion-buttons,[menuToggle]'));

      const leavingToolBarBg = new Animation();
      leavingToolBarBg.addElement(leavingToolBarEle.querySelector('.toolbar-background'));

      const leavingBackButton = new Animation();
      leavingBackButton.addElement(leavingToolBarEle.querySelector('.back-button'));

      leavingToolBar
        .add(leavingTitle)
        .add(leavingToolBarItems)
        .add(leavingBackButton)
        .add(leavingToolBarBg);

      rootTransition.add(leavingToolBar);

      // fade out leaving toolbar items
      leavingBackButton.fromTo(OPACITY, 0.99, 0, true);
      leavingTitle.fromTo(OPACITY, 0.99, 0, true);
      leavingToolBarItems.fromTo(OPACITY, 0.99, 0, true);

      if (backDirection) {
        // leaving toolbar, back direction
        leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        // leaving toolbar, back direction, and there's no entering toolbar
        // should just slide out, no fading out
        leavingToolBarBg
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));

        const leavingBackBtnText = new Animation();
        leavingBackBtnText.addElement(leavingToolBarEle.querySelector('.back-button .button-text'));
        leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -115 : 115) + 'px');
        leavingToolBar.add(leavingBackBtnText);

      } else {
        // leaving toolbar, forward direction
        leavingTitle
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .afterClearStyles([TRANSFORM]);

        leavingBackButton.afterClearStyles([OPACITY]);
        leavingTitle.afterClearStyles([OPACITY]);
        leavingToolBarItems.afterClearStyles([OPACITY]);
      }
    }
  }
  // Return the rootTransition promise
  return Promise.resolve(rootTransition);
}