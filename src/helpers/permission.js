export const verifyPermission = (userPermissions, permission) => {
  for (let i = 0; i < userPermissions?.length; i++) {
    if (userPermissions[i] === permission) return true;
  }
  return false;
};
export const verifyIfAnyPermission = (userPermissions, permission = []) => {
  let haveIt = false;
  if (!Array.isArray(permission) || !Array.isArray(userPermissions)) {
    haveIt = false;
  } else {
    for (let i = 0; i < permission?.length; i++) {
      const found = userPermissions.find((perm) => {
        return permission[i] === perm;
      });
      if (found) {
        haveIt = true;
        break;
      }
    }
  }

  return haveIt;
};
