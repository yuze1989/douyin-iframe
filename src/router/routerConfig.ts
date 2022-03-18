import { lazy } from 'react';

const BasicLayout = lazy(() => import(/* webpackChunkName: 'BasicLayout' */ 'layout/index'));
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ 'page/home')); // 首页
const SaveCommentRules = lazy(() => import(/* webpackChunkName: 'SaveCommentRules' */ 'page/rules/CommentRules')); // 评论规则
const SaveConversationRules = lazy(() => import(/* webpackChunkName: 'SaveConversationRules' */ 'page/rules/ConversationRules')); // 会话规则
const SavePrivateLetterRules = lazy(() => import(/* webpackChunkName: 'SavePrivateLetterRules' */ 'page/rules/PrivateLetterRules')); // 私信规则

const routes = [
  {
    path: '',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        title: '首页-抖音',
      },
      {
        path: '/comment-rules',
        name: 'commentRules',
        component: SaveCommentRules,
        title: '回复规则-抖音',
      },
      {
        path: '/save-rules-conversation',
        name: 'SaveConversationRules',
        component: SaveConversationRules,
        title: '会话规则-抖音',
      },
      {
        path: '/save-rules-private-letter',
        name: 'SavePrivateLetterRules',
        component: SavePrivateLetterRules,
        title: '私信规则-抖音',
      },
    ],
  },
];

export default routes;
