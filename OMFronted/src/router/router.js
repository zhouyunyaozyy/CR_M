import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
//        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
//        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
//        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); } }, // 用于展示带参路由
//        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
      { path: 'news_list', title: '文章列表', name: 'news_list', component: resolve => { require(['@/views/marketing/news/news/newsList.vue'], resolve); } },
      { path: 'news_detail', title: '编辑/添加文章', name: 'news_detail', component: resolve => { require(['@/views/marketing/news/news/newsDetail.vue'], resolve); } },
      { path: 'auditManagement_detail', title: '认证详情', name: 'auditManagement_detail', component: resolve => { require(['@/views/applicationPlatform/auditManagement/auditManagementDetail.vue'], resolve); } },
      { path: 'manager_detail', title: '主账号管理', name: 'manager_detail', component: resolve => { require(['@/views/company/manager/managerDetail.vue'], resolve); } },
      { path: 'children_list', title: '子账号管理', name: 'children_list', component: resolve => { require(['@/views/company/children/childrenList.vue'], resolve); } },
      { path: 'job_list', title: '职位管理', name: 'job_list', component: resolve => { require(['@/views/company/job/jobList.vue'], resolve); } },
      { path: 'children_detail', title: '新增/编辑子账号', name: 'children_detail', component: resolve => { require(['@/views/company/children/childrenDetail.vue'], resolve); } },
      { path: 'appRecruit_detail', title: '简历审核', name: 'appRecruit_detail', component: resolve => { require(['@/views/applicationPlatform/appRecruit/appRecruitDetail.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
   // {
   //     path: '/access',
   //     icon: 'key',
   //     name: 'access',
   //     title: '权限管理',
   //     component: Main,
   //     children: [
   //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
   //     ]
   // },
   // {
   //     path: '/access-test',
   //     icon: 'lock-combination',
   //     title: '权限测试页',
   //     name: 'accesstest',
   //     access: 0,
   //     component: Main,
   //     children: [
   //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } }
   //     ]
   // },
//    {
//        path: '/international',
//        icon: 'earth',
//        title: {i18n: 'international'},
//        name: 'international',
//        component: Main,
//        children: [
//            { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: resolve => { require(['@/views/international/international.vue'], resolve); } }
//        ]
//    },
//    {
//        path: '/component',
//        icon: 'social-buffer',
//        name: 'component',
//        title: '组件',
//        component: Main,
//        children: [
//            {
//                path: 'text-editor',
//                icon: 'compose',
//                name: 'text-editor',
//                title: '富文本编辑器',
//                component: resolve => { require(['@/views/my-components/text-editor/text-editor.vue'], resolve); }
//            },
//            {
//                path: 'md-editor',
//                icon: 'pound',
//                name: 'md-editor',
//                title: 'Markdown编辑器',
//                component: resolve => { require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve); }
//            },
//            {
//                path: 'image-editor',
//                icon: 'crop',
//                name: 'image-editor',
//                title: '图片预览编辑',
//                component: resolve => { require(['@/views/my-components/image-editor/image-editor.vue'], resolve); }
//            },
//            {
//                path: 'draggable-list',
//                icon: 'arrow-move',
//                name: 'draggable-list',
//                title: '可拖拽列表',
//                component: resolve => { require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve); }
//            },
//            {
//                path: 'area-linkage',
//                icon: 'ios-more',
//                name: 'area-linkage',
//                title: '城市级联',
//                component: resolve => { require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve); }
//            },
//            {
//                path: 'file-upload',
//                icon: 'android-upload',
//                name: 'file-upload',
//                title: '文件上传',
//                component: resolve => { require(['@/views/my-components/file-upload/file-upload.vue'], resolve); }
//            },
//            {
//                path: 'count-to',
//                icon: 'arrow-graph-up-right',
//                name: 'count-to',
//                title: '数字渐变',
//                component: resolve => { require(['@/views/my-components/count-to/count-to.vue'], resolve); }
//            }
//            // {
//            //     path: 'clipboard-page',
//            //     icon: 'clipboard',
//            //     name: 'clipboard-page',
//            //     title: '一键复制',
//            //     component: resolve => { require(['@/views/my-components/clipboard/clipboard.vue'], resolve); }
//            // }
//        ]
//    },
//     {
//         path: '/form',
//         icon: 'android-checkbox',
//         name: 'form',
//         title: '表单编辑',
//         component: Main,
//         children: [
//             { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['@/views/form/article-publish/article-publish.vue'], resolve); } },
//             { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['@/views/form/work-flow/work-flow.vue'], resolve); } }
//
//         ]
//     },
//    // {
//    //     path: '/charts',
//    //     icon: 'ios-analytics',
//    //     name: 'charts',
//    //     title: '图表',
//    //     component: Main,
//    //     children: [
//    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
//    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }
//
//    //     ]
//    // },
//    {
//        path: '/tables',
//        icon: 'ios-grid-view',
//        name: 'tables',
//        title: '表格',
//        component: Main,
//        children: [
//            { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['@/views/tables/dragable-table.vue'], resolve); } },
//            { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } },
//            { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['@/views/tables/searchable-table.vue'], resolve); } },
//            { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['@/views/tables/exportable-table.vue'], resolve); } },
//            { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['@/views/tables/table-to-image.vue'], resolve); } }
//        ]
//    },
//    {
//        path: '/advanced-router',
//        icon: 'ios-infinite',
//        name: 'advanced-router',
//        title: '高级路由',
//        component: Main,
//        children: [
//            { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['@/views/advanced-router/mutative-router.vue'], resolve); } },
//            { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
//        ]
//    },
//     {
//         path: '/error-page',
//         icon: 'android-sad',
//         title: '错误页面',
//         name: 'errorpage',
//         component: Main,
//         children: [
//             { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
//         ]
//     },

//    {
//        path: '/access',
//        icon: 'key',
//        name: 'access',
//        title: '权限管理',
//        component: Main,
//        children: [
//            { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
//        ]
//    },
    {
        path: '/appSystem',
        icon: 'key',
        name: 'appSystem',
        title: '版本管理',
        access: [0,1],
        component: Main,
        children: [
          { path: 'appSystem_List', title: '历史版本', name: 'appSystem_List', component: resolve => { require(['@/views/system/appSystem/appSystemList.vue'], resolve); } },
          { path: 'appSystem_Detail', title: '新增/编辑版本', name: 'appSystem_Detail', component: resolve => { require(['@/views/system/appSystem/appSystemDetail.vue'], resolve); } }
        ]
    },
    {
        path: '/systemInforms',
        icon: 'key',
        name: 'systemInforms',
        title: '消息通知',
        access: [0,1,4,5,6],
        component: Main,
        children: [
          { path: 'systemInforms_List', title: '消息通知列表', name: 'systemInforms_List', component: resolve => { require(['@/views/marketing/systemInforms/systemInformsList.vue'], resolve); } },
          { path: 'systemInforms_Detail', title: '新增/查看消息通知', name: 'systemInforms_Detail', component: resolve => { require(['@/views/marketing/systemInforms/systemInformsDetail.vue'], resolve); } }
        ]
    },
    // {
    //     path: '/infoPush',
    //     icon: 'key',
    //     name: 'infoPush',
    //     title: '信息推送',
    //     component: Main,
    //     children: [
    //       { path: 'infoPush_List', title: '推送列表', name: 'infoPush_List', component: resolve => { require(['@/views/marketing/infoPush/infoPushList.vue'], resolve); } },
    //       { path: 'infoPush_Detail', title: '新增/查看推送', name: 'infoPush_Detail', component: resolve => { require(['@/views/marketing/infoPush/infoPushDetail.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/banner',
        icon: 'key',
        name: 'banner',
        title: 'Banner管理',
        access: [0,1,2,4,5,6],
        component: Main,
        children: [
          { path: 'banner_List', title: 'banner列表', name: 'banner_List', component: resolve => { require(['@/views/marketing/banner/bannerList.vue'], resolve); } },
          { path: 'banner_Detail', title: '新增/编辑banner', name: 'banner_Detail', component: resolve => { require(['@/views/marketing/banner/bannerDetail.vue'], resolve); } }
        ]
    },
    {
        path: '/theme',
        icon: 'key',
        name: 'theme',
        title: '资讯管理',
        component: Main,
        access: [0,1,2,4,5,6],
        children: [
          { path: 'theme_List', title: '栏目列表', name: 'theme_List', component: resolve => { require(['@/views/marketing/news/themeList.vue'], resolve); } }
        ]
    },
    {
        path: '/companyControl',
        icon: 'key',
        name: 'companyControl',
        title: '企业平台',
        access: [0,1,2,3,6],
        component: Main,
        children: [
          { path: 'company_list', title: '企业列表', name: 'company_list', component: resolve => { require(['@/views/company/companyControl/companyList.vue'], resolve); } },
          { path: 'company_Detail', title: '新增/编辑企业', name: 'company_Detail', component: resolve => { require(['@/views/company/companyControl/companyDetail.vue'], resolve); } }
        ]
    },
    {
        path: '/applicationPlatform',
        icon: 'key',
        name: 'applicationPlatform',
        title: '审核管理',
        access: [0,1,2,3,4,5,6],
        component: Main,
        children: [
          { path: 'auditManagement_list', title: '实名审核列表', name: 'auditManagement_list', component: resolve => { require(['@/views/applicationPlatform/auditManagement/auditManagementList.vue'], resolve); } },
          { path: 'appRecruit_list', title: '简历审核列表', name: 'appRecruit_list', component: resolve => { require(['@/views/applicationPlatform/appRecruit/appRecruitList.vue'], resolve); } }
        ]
    },
    {
        path: '/launchImage',
        icon: 'key',
        name: 'launchImage',
        title: '开屏页管理',
        access: [0,1,5,6],
        component: Main,
        children: [
          { path: 'launchImage_list', title: '开屏页列表', name: 'launchImage_list', component: resolve => { require(['@/views/marketing/launchImage/launchImageList.vue'], resolve); } },
          { path: 'launchImage_detail', title: '新增/编辑开屏页', name: 'launchImage_detail', component: resolve => { require(['@/views/marketing/launchImage/launchImagedetail.vue'], resolve); } }
        ]
    },
    {
        path: '/competency',
        icon: 'key',
        name: 'competency',
        title: '职能管理',
        access: [0,1],
        component: Main,
        children: [
          { path: 'competency_list', title: '职能列表', name: 'competency_list', component: resolve => { require(['@/views/marketing/competency/competencyList.vue'], resolve); } },
          { path: 'competency_detail', title: '新增/编辑职能', name: 'competency_detail', component: resolve => { require(['@/views/marketing/competency/competencydetail2.vue'], resolve); } }
        ]
    },
    {
        path: '/appList',
        icon: 'key',
        name: 'appList',
        title: '用户管理',
        access: [0,1,3,6],
        component: Main,
        children: [
          { path: 'app_list', title: 'ca用户列表', name: 'app_list', component: resolve => { require(['@/views/applicationPlatform/appList/appList.vue'], resolve); } }
        ]
    },
    {
        path: '/feedbackList',
        icon: 'key',
        name: 'feedbackList',
        title: '反馈管理',
        access: [0,1,2,3,4,5,6],
        component: Main,
        children: [
          { path: 'hrFeedback_list', title: 'hr反馈', name: 'hrFeedback_list', component: resolve => { require(['@/views/feedback/hrFeedback.vue'], resolve); } },
          { path: 'appFeedback_list', title: 'app反馈', name: 'appFeedback_list', component: resolve => { require(['@/views/feedback/appFeedback.vue'], resolve); } }
        ]
    },
    {
        path: '/omUser',
        icon: 'key',
        name: 'omUser',
        title: '账号管理',
        access: [0],
        component: Main,
        children: [
          { path: 'user_list', title: '账号列表', name: 'user_list', component: resolve => { require(['@/views/om-user/userList.vue'], resolve); } },
          { path: 'user_detail', title: '新增/编辑账号', name: 'user_detail', component: resolve => { require(['@/views/om-user/userDetail.vue'], resolve); } }
        ]
    },
    {
        path: '/statistics',
        icon: 'key',
        name: 'statistics',
        title: '数据统计',
        access: [0],
        component: Main,
        children: [
          { path: 'userStatistics', title: '用户数据日报', name: 'userStatistics', component: resolve => { require(['@/views/statistics/userStatistics.vue'], resolve); } },
          // { path: 'user_detail', title: '新增/编辑账号', name: 'user_detail', component: resolve => { require(['@/views/om-user/userDetail.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
