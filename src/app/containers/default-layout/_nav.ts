import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Esim Activation History',
    url: '/esim-activation',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Esim Topup/1Yr Activation',
    url: '/esim-topup-oneyear-activation',
    iconComponent: { name: 'cil-drop' },
  },
  {
    name: 'Esim Topup Details',
    url: '/esim-topup-details',
    iconComponent: { name: 'cil-pencil' },
  },
  {
    name: 'Esim Extend 1Yr Details',
    url: '/esim-extend-oneyear-details',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Esim Billing Plan',
    url: '/esim-billing-plan',
    iconComponent: { name: 'cil-cursor' },
  },
  {
    name: 'Sim Details Upload',
    url: '/sim-details-upload',
    iconComponent: { name: 'cilGroup' },
  },
  {
    name: 'Advance Payment',
    url: '/esim-advance-payment',
    iconComponent: { name: 'cil-pencil' },
  },
  {
    name: 'Esim Account Mapping',
    url: '/esim-account-mapping',
    iconComponent: { name: 'cil-notes' },
  },

  {
    name: 'Esim Billing Generation',
    url: '/esim-billing-generation',
    iconComponent: { name: 'cil-calculator' },
  },

  {
    name: 'Products',
    iconComponent: { name: 'cil-calculator' },
    children: [
      {
        name: 'Product Detail',
        url: '/esim-product-details',
      },
      {
        name: 'Customer Price Mapping',
        url: '/esim-customer-price-mapping',
      },
    ],
  },
  {
    name: 'Esim Request',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'CA Request',
        url: '/esim-ca-request',
        attributes: {
          title: 'Commercial Requests',
        },
      },
      {
        name: 'Renewal Request',
        url: '/esim-renewal-request',
      },
      {
        name: 'Topup Request',
        url: '/esim-topup-request',
      },
      {
        name: 'Extend 1 Year Request',
        url: '/esim-extend-validity-request',
      },
      {
        name: 'BSNL Certificate',
        url: '/esim-bsnl-certificate',
      },
    ],
  },
  {
    name: 'Company Creation',
    url: '/esim-company-creation',
    iconComponent: { name: 'cilGroup' },
  },
  // {
  //   name: 'Company Activation',
  //   url: '/esim-company-activation',
  //   iconComponent: { name: 'cil-puzzle' },
  // },
  // {
  //   name: 'Esim User',
  //   url: '/esim-users',
  //   iconComponent: { name: 'cilGroup' },
  // },
  {
    name: 'Esim User',
    url: '/esim-user',
    iconComponent: { name: 'cilGroup' },
  },

  // {
  //   name: 'Esim Invoice',
  //   url: '/esim-invoice',
  //   iconComponent: { name: 'cil-calculator' },
  // },
  {
    name: 'Esim Change Password',
    url: '/esim-change-password',
    iconComponent: { name: 'cilLoopCircular' },
  },
  {
    name: 'Role Group',
    url: '/role-management',
    iconComponent: { name: 'cilGroup' },
  },
  {
    name: 'Assign Stocks',
    url: '/esim-assign-stocks',
    iconComponent: { name: 'cilGroup' },
  },
  {
    name: 'Esim Request Details',
    url: '/esim-request-details',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'Esim Dashboard',
    url: '/esim-dashboard',
    iconComponent: { name: 'cil-notes' },
  },

  {
    name: 'Purchase Order',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Create Purchase Order',
        url: '/sales-order',
        // attributes: {
        //   'title': 'Create Purchase and I will have Order',
        // }
      },
      {
        name: 'View Purchase Order',
        url: '/sales-order-view',
      },
      {
        name: 'Purchase Details',
        url: '/esim-purchase-details',
      },
    ],
  },

  {
    name: 'Invoices',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'PO Invoice',
        url: '/po-invoice',
      },
      {
        name: 'CA Invoice',
        url: '/ca-invoice',
      },
      {
        name: 'Renewal Invoice',
        url: '/renewal-invoice',
      },
      {
        name: 'Topup Invoice',
        url: '/topup-invoice',
      },
      {
        name: 'Extend 1 Year Invoice',
        url: '/extend-invoice',
      },
      {
        name: 'BSNL Certificate Invoice',
        url: '/bsnl-invoice',
      },
    ],
  },
  //   name: 'Logout',
  //   url: '/login',
  //   iconComponent: { name: 'cil-drop' },
  // },

  // {
  //   title: true,
  //   name: 'Theme'
  // },
  // {
  //   name: 'Colors',
  //   url: '/theme/colors',
  //   iconComponent: { name: 'cil-drop' }
  // },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   linkProps: { fragment: 'someAnchor' },
  //   iconComponent: { name: 'cil-pencil' }
  // },
  // {
  //   name: 'Components',
  //   title: true
  // },
  // {
  //   name: 'Base',
  //   url: '/base',
  //   iconComponent: { name: 'cil-puzzle' },
  //   children: [
  //     {
  //       name: 'Accordion',
  //       url: '/base/accordion'
  //     },
  //     {
  //       name: 'Breadcrumbs',
  //       url: '/base/breadcrumbs'
  //     },
  //     {
  //       name: 'Cards',
  //       url: '/base/cards'
  //     },
  //     {
  //       name: 'Carousel',
  //       url: '/base/carousel'
  //     },
  //     {
  //       name: 'Collapse',
  //       url: '/base/collapse'
  //     },
  //     {
  //       name: 'List Group',
  //       url: '/base/list-group'
  //     },
  //     {
  //       name: 'Navs & Tabs',
  //       url: '/base/navs'
  //     },
  //     {
  //       name: 'Pagination',
  //       url: '/base/pagination'
  //     },
  //     {
  //       name: 'Placeholder',
  //       url: '/base/placeholder'
  //     },
  //     {
  //       name: 'Popovers',
  //       url: '/base/popovers'
  //     },
  //     {
  //       name: 'Progress',
  //       url: '/base/progress'
  //     },
  //     {
  //       name: 'Spinners',
  //       url: '/base/spinners'
  //     },
  //     {
  //       name: 'Tables',
  //       url: '/base/tables'
  //     },
  //     {
  //       name: 'Tabs',
  //       url: '/base/tabs'
  //     },
  //     {
  //       name: 'Tooltips',
  //       url: '/base/tooltips'
  //     }
  //   ]
  // },
  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   iconComponent: { name: 'cil-cursor' },
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons'
  //     },
  //     {
  //       name: 'Button groups',
  //       url: '/buttons/button-groups'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns'
  //     },
  //   ]
  // },
  // {
  //   name: 'Forms',
  //   url: '/forms',
  //   iconComponent: { name: 'cil-notes' },
  //   children: [
  //     {
  //       name: 'Form Control',
  //       url: '/forms/form-control'
  //     },
  //     {
  //       name: 'Select',
  //       url: '/forms/select'
  //     },
  //     {
  //       name: 'Checks & Radios',
  //       url: '/forms/checks-radios'
  //     },
  //     {
  //       name: 'Range',
  //       url: '/forms/range'
  //     },
  //     {
  //       name: 'Input Group',
  //       url: '/forms/input-group'
  //     },
  //     {
  //       name: 'Floating Labels',
  //       url: '/forms/floating-labels'
  //     },
  //     {
  //       name: 'Layout',
  //       url: '/forms/layout'
  //     },
  //     {
  //       name: 'Validation',
  //       url: '/forms/validation'
  //     }
  //   ]
  // },
  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   iconComponent: { name: 'cil-chart-pie' }
  // },
  // {
  //   name: 'Icons',
  //   iconComponent: { name: 'cil-star' },
  //   url: '/icons',
  //   children: [
  //     {
  //       name: 'CoreUI Free',
  //       url: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'FREE'
  //       }
  //     },
  //     {
  //       name: 'CoreUI Flags',
  //       url: '/icons/flags'
  //     },
  //     {
  //       name: 'CoreUI Brands',
  //       url: '/icons/brands'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   iconComponent: { name: 'cil-bell' },
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges'
  //     },
  //     {
  //       name: 'Modal',
  //       url: '/notifications/modal'
  //     },
  //     {
  //       name: 'Toast',
  //       url: '/notifications/toasts'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500'
  //     }
  //   ]
  // },
];
