/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Component, PureComponent} from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {h} from '@cycle/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Msg, FeedId, PostContent, MsgId} from 'ssb-typescript';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';
import {Likes} from '../../ssb/types';
import React = require('react');

const Touchable = Platform.select<any>({
  android: TouchableNativeFeedback,
  default: TouchableOpacity,
});

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },

  col: {
    flexDirection: 'column',
  },

  likeCount: {
    flexDirection: 'row',
    fontWeight: 'bold',
  },

  likes: {
    paddingTop: Dimensions.verticalSpaceSmall,
    paddingBottom: Dimensions.verticalSpaceSmall,
    paddingRight: Dimensions.horizontalSpaceSmall,
    fontSize: Typography.fontSizeSmall,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.textWeak,
  },

  likesHidden: {
    paddingTop: Dimensions.verticalSpaceSmall,
    paddingBottom: Dimensions.verticalSpaceSmall,
    paddingRight: Dimensions.horizontalSpaceSmall,
    fontSize: Typography.fontSizeSmall,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.backgroundText,
  },

  likeButton: {
    flexDirection: 'row',
    paddingTop: Dimensions.verticalSpaceBig,
    paddingBottom: Dimensions.verticalSpaceBig,
    paddingLeft: 1,
    paddingRight: Dimensions.horizontalSpaceBig,
    marginBottom: -Dimensions.verticalSpaceBig,
  },

  likeButtonLabel: {
    fontSize: Typography.fontSizeSmall,
    fontWeight: 'bold',
    marginLeft: Dimensions.horizontalSpaceSmall,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.textWeak,
  },

  replyButton: {
    flexDirection: 'row',
    paddingTop: Dimensions.verticalSpaceBig,
    paddingBottom: Dimensions.verticalSpaceBig,
    paddingLeft: Dimensions.horizontalSpaceBig,
    paddingRight: Dimensions.horizontalSpaceBig,
    marginBottom: -Dimensions.verticalSpaceBig,
  },

  replyButtonLabel: {
    fontSize: Typography.fontSizeSmall,
    fontWeight: 'bold',
    marginLeft: Dimensions.horizontalSpaceSmall,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.textWeak,
  },
});

const iconProps = {
  noLiked: {
    key: 'icon',
    size: Dimensions.iconSizeSmall,
    color: Palette.textWeak,
    name: 'thumb-up-outline',
  },
  maybeLiked: {
    key: 'icon',
    size: Dimensions.iconSizeSmall,
    color: Palette.foregroundNeutral,
    name: 'thumb-up',
  },
  yesLiked: {
    key: 'icon',
    size: Dimensions.iconSizeSmall,
    color: Palette.backgroundBrandWeak,
    name: 'thumb-up',
  },
  reply: {
    key: 'icon',
    size: Dimensions.iconSizeSmall,
    color: Palette.textWeak,
    name: 'comment-outline',
  },
};

type LCProps = {
  onPress: () => void;
  count: number;
};

class LikeCount extends PureComponent<LCProps> {
  public render() {
    const {count, onPress} = this.props;

    const likesComponent = [
      h(View, {style: styles.col, pointerEvents: 'box-only'}, [
        h(Text, {style: count > 0 ? styles.likes : styles.likesHidden}, [
          h(Text, {key: 'c', style: styles.likeCount}, String(count)),
          count === 1 ? ' like' : ' likes',
        ]),
      ]),
    ];

    const touchableProps: any = {
      onPress,
      accessible: true,
      accessibilityLabel: 'Like Count Button',
    };
    if (Platform.OS === 'android') {
      touchableProps.background = TouchableNativeFeedback.SelectableBackground();
    }

    if (count > 0) {
      return h(Touchable, touchableProps, likesComponent);
    } else {
      return h(React.Fragment, likesComponent);
    }
  }
}

type LBProps = {
  onPress: () => void;
  toggled: boolean;
};

class LikeButton extends PureComponent<LBProps, {maybeToggled: boolean}> {
  public state = {maybeToggled: false};

  private onPress = () => {
    if (this.state.maybeToggled) return;

    this.setState({maybeToggled: true});
    this.props.onPress();
  };

  public render() {
    const {toggled} = this.props;
    const {maybeToggled} = this.state;
    const ilike: 'no' | 'maybe' | 'yes' = maybeToggled
      ? 'maybe'
      : toggled
      ? 'yes'
      : 'no';

    const touchableProps: any = {
      onPress: this.onPress,
      accessible: true,
      accessibilityLabel: 'Like Button',
    };
    if (Platform.OS === 'android') {
      touchableProps.background = TouchableNativeFeedback.SelectableBackground();
    }

    return h(Touchable, touchableProps, [
      h(View, {style: styles.likeButton, pointerEvents: 'box-only'}, [
        h(Icon, iconProps[ilike + 'Liked']),
        h(Text, {key: 't', style: styles.likeButtonLabel}, 'Like'),
      ]),
    ]);
  }
}

type RProps = {
  onPress: () => void;
};

class ReplyButton extends PureComponent<RProps> {
  public render() {
    const touchableProps: any = {
      onPress: this.props.onPress,
      accessible: true,
      accessibilityLabel: 'Reply Button',
    };
    if (Platform.OS === 'android') {
      touchableProps.background = TouchableNativeFeedback.SelectableBackground();
    }

    return h(Touchable, touchableProps, [
      h(View, {style: styles.replyButton, pointerEvents: 'box-only'}, [
        h(Icon, iconProps.reply),
        h(Text, {key: 't', style: styles.replyButtonLabel}, 'Comment'),
      ]),
    ]);
  }
}

export type Props = {
  msg: Msg;
  selfFeedId: FeedId;
  likes: Likes;
  onPressLikeCount?: (ev: {msgKey: MsgId; likes: Likes}) => void;
  onPressLike?: (ev: {msgKey: MsgId; like: boolean}) => void;
  onPressReply?: (ev: {msgKey: MsgId; rootKey: MsgId}) => void;
};

export default class MessageFooter extends Component<Props> {
  private likeToggled: boolean = false;

  private onPressLikeCountHandler = () => {
    const onPressLikeCount = this.props.onPressLikeCount;
    if (!onPressLikeCount) return;

    const msgKey = this.props.msg.key;
    const likes = this.props.likes;
    onPressLikeCount({msgKey, likes});
  };

  private onPressLikeHandler = () => {
    const onPressLike = this.props.onPressLike;
    if (!onPressLike) return;

    onPressLike({
      msgKey: this.props.msg.key,
      like: this.likeToggled ? false : true,
    });
  };

  private onPressReplyHandler = () => {
    const msg = this.props.msg;
    const msgKey = msg.key;
    const rootKey = (msg?.value?.content as PostContent)?.root ?? msgKey;
    this.props.onPressReply?.({msgKey, rootKey});
  };

  public shouldComponentUpdate(nextProps: Props) {
    const prevProps = this.props;
    return (
      (nextProps.likes ?? []).length !== (prevProps.likes ?? []).length ||
      nextProps.msg.key !== prevProps.msg.key
    );
  }

  public render() {
    const timestamp = Date.now();
    const props = this.props;
    const shouldShowReply = !!props.onPressReply;
    const likes = props.likes ?? [];
    const likeCount = likes.length;
    this.likeToggled = likes.some(feedId => feedId === props.selfFeedId);

    return h(View, {style: styles.col}, [
      h(View, {key: 'count', style: styles.row}, [
        h(LikeCount, {count: likeCount, onPress: this.onPressLikeCountHandler}),
      ]),
      h(View, {key: 'button', style: styles.row}, [
        h(LikeButton, {
          onPress: this.onPressLikeHandler,
          toggled: this.likeToggled,
          key: timestamp,
        }),

        shouldShowReply
          ? h(ReplyButton, {key: 'reply', onPress: this.onPressReplyHandler})
          : null,
      ]),
    ]);
  }
}
