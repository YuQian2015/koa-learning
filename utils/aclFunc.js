const aclFunc = {
  isAllowed: async (aclInstence, user, url, method) => {
    try {
      let respon;
      let result = await aclInstence.isAllowed(user, url, method);

      if (!result) {
        console.log(`User ${user} is not allowed to ${method} ${url}`)
        respon = false;
      }
      if (result) {
        console.log(`User ${user} is allowed to ${method} ${url}`)
        respon = true;
      }
      return respon;
    } catch (err) {
      console.log(err)
      return false;
    }
  },
  areAnyRolesAllowed: async (aclInstence, roles, url, method) => {
    try {
      let respon;
      let result = await aclInstence.areAnyRolesAllowed(roles, url, method);

      if (!result) {
        console.log(`${roles} is not allowed to ${method} ${url}`)
        respon = false;
      }
      if (result) {
        console.log(`${roles} is allowed to ${method} ${url}`)
        respon = true;
      }
      return respon;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
}
module.exports = aclFunc;
