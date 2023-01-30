export const adminMenu = [
    { //Quản lí người dùng
        name: 'menu.admin.header', menus: [
            {
                name: 'menu.admin.crud',
                link: '/system/user-manage'
            },
            {
                name: 'menu.admin.crud-redux',
                link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/system/doctor-manage'
                // subMenus: [
                //     { name: 'menu.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin',
            //     link: '/system/admin-manage'
            // },
            // { name: 'menu.system-parameter.header', link: '/system/system-parameter' },
            { //Quản lí kees hoachj khams beenhj
                name: 'menu.doctor.manage-schedule',
                link:'/doctor/manage-schedule'
                    // { name: 'menu.system-parameter.header', livnk: '/system/system-parameter' },
            },
            {
                name: 'menu.home',
                link: '/home'
            }

        ]
    },
    {//Quản lí phòng khám
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic',
                link: '/system/manage-clinic'
            }
        ]
    },
    {//Quản lí chuyên khoa
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/system/manage-specialty'
            }
        ]
    },
    {//Quản lí cẩm nang
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-hand-book',
                link: '/system/hand-book'
            }
        ]
    },
    
];

export const doctorMenu = [
    { //Quản lí kees hoachj khams beenhj
        name: 'menu.admin.header', menus: [
            {
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient',
                link: '/doctor/manage-patient'
            },
            {
                name: 'menu.home',
                link: '/home'
            }

        ]
    },
    
];

export const patientMenu = [
    { //Quản lí kees hoachj khams beenhj
        name: 'menu.admin.header', menus: [
            {
                name: 'menu.home',
                link: '/home'
            }

        ]
    },
    
];