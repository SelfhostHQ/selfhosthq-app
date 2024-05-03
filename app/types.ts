export enum PROJECT_ACCESS_TYPE {
  OWNER = 'owner',
  STAFF = 'staff',
}

export enum PROJECT_PERMISSIONS {
  //Permissions for apps
  READ_ALL_APPS = 'read_all_apps',
  MODIFY_APP_SETTINGS = 'modify_app_settings',
  INITIATE_REDEPLOY = 'initiate_redeploy',
  DEPLOY_NEW_APPS = 'deploy_new_apps',

  FULL_ACCESS = 'full_access',
}

export enum PROJECT_DEPLOY_TYPE {
  GITHUB_PERSONAL_ACCESS_TOKEN = 'github_personal_access_token',
}
