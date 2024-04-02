# 项目启动
```
// 安装依赖
pnpm install
// 启动项目
pnpm dev
```
# 注意事项

> PS：mongo.js文件需要连接自己的mongdb数据库

# 数据库表设计
| 表明 | 说明 | 
| ---- | ---- | 
| base_account | 用户表  | 
| base_role | 角色表   | 
| base_account_role | 用户关联角色表   | 
| base_menu | 菜单表   | 
| base_role_menu | 角色关联菜单表   | 
# 内置数据
用户表内置超管账号
```json
{
  "id": "admin001",
  "account": "admin",
  "password": "123456",
  "name": "超级管理员",
  "phone": "",
  "email": "",
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0,
  "is_admin": 1
}
```
菜单表内置数据
```json
[{
  "id": "menu001",
  "parent_id": "root",
  "title": "系统设置",
  "type": 1,
  "name": "",
  "route_path": "",
  "component_path": "",
  "icon": "Setting",
  "is_keepalive": false,
  "is_left_menu": true,
  "level": 0,
  "sort": 20,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0
},
{
  "id": "menu001001",
  "parent_id": "menu001",
  "title": "用户管理",
  "type": 2,
  "name": "accountAuthority",
  "route_path": "/admin/accountAuthority",
  "component_path": "/src/pages/views/accountAuthority/accountAuthority.vue",
  "icon": "",
  "is_keepalive": true,
  "is_left_menu": true,
  "level": 1,
  "sort": 10,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": {
    "$date": "2024-04-02T01:01:29.863Z"
  },
  "update_user_id": "admin001",
  "update_user_account": "admin",
  "update_user_name": "超级管理员",
  "is_delete": 0
},
{
  "id": "menu000",
  "parent_id": "root",
  "title": "首页",
  "type": 2,
  "name": "index",
  "route_path": "/",
  "component_path": "/src/pages/views/index/index.vue",
  "icon": "DocumentCopy",
  "is_keepalive": false,
  "is_left_menu": true,
  "level": 0,
  "sort": 10,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0
},
{
  "id": "menu001002",
  "parent_id": "menu001",
  "title": "角色管理",
  "type": 2,
  "name": "roleAuthority",
  "route_path": "/admin/roleAuthority",
  "component_path": "/src/pages/views/roleAuthority/roleAuthority.vue",
  "icon": "",
  "is_keepalive": true,
  "is_left_menu": true,
  "level": 1,
  "sort": 10,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": {
    "$date": "2024-04-02T07:42:12.687Z"
  },
  "update_user_id": "admin001",
  "update_user_account": "admin",
  "update_user_name": "超级管理员",
  "is_delete": 0
},
{
  "id": "menu001003",
  "parent_id": "menu001",
  "title": "关联角色",
  "type": 2,
  "name": "associationRole",
  "route_path": "/admin/associationRole",
  "component_path": "/src/pages/views/associationRole/associationRole.vue",
  "icon": "",
  "is_keepalive": false,
  "is_left_menu": false,
  "level": 1,
  "sort": 10,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0
},
{
  "id": "menu001004",
  "parent_id": "menu001",
  "title": "菜单管理",
  "type": 2,
  "name": "menuAuthority",
  "route_path": "/admin/menuAuthority",
  "component_path": "/src/pages/views/menuAuthority/menuAuthority.vue",
  "icon": "",
  "is_keepalive": false,
  "is_left_menu": true,
  "level": 1,
  "sort": 30,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0
},
{
  "id": "1182fc37-49a9-4263-bb09-da63dcfc54b8",
  "parent_id": "menu001",
  "title": "菜单&按钮权限配置",
  "type": 2,
  "name": "permissionsConfig",
  "route_path": "/admin/permissionsConfig",
  "component_path": "/src/pages/views/permissionsConfig/permissionsConfig.vue",
  "icon": "",
  "is_keepalive": false,
  "is_left_menu": false,
  "level": 1,
  "sort": 10,
  "create_date": null,
  "create_user_id": "",
  "create_user_account": "",
  "create_user_name": "",
  "update_date": null,
  "update_user_id": "",
  "update_user_account": "",
  "update_user_name": "",
  "is_delete": 0,
}]
```