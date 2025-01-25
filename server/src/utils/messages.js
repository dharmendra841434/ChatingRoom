const messages = (lang = "en") => {
  const user_already_found = {
    en: "User already found with given username, Try again after new username!",
  };

  const success = {
    en: "success",
  };

  const logout = {
    en: "logout successfully",
  };

  const invalid_token = {
    en: "invalid token",
  };

  const users_list = {
    en: "users list",
  };

  const user_not_found = {
    en: "user detail not found!",
  };

  const groups_not_found = {
    en: "You have not created any groups yet!",
  };

  const group_not_found = {
    en: "This group does not exist!",
  };
  const username_not_found = {
    en: "Useraneme not found!",
  };

  const forbidden = {
    en: "forbidden",
  };

  const ac_deleted = {
    en: "Your account has been deleted. If you wish to regain access, please contact us!",
  };

  const incorrect_password = {
    en: "Incorrect password, try again!",
  };

  return {
    user_already_found: user_already_found[lang],
    success: success[lang],
    logout: logout[lang],
    invalid_token: invalid_token[lang],
    users_list: users_list[lang],
    user_not_found: user_not_found[lang],
    forbidden: forbidden[lang],
    ac_deleted: ac_deleted[lang],
    incorrect_password: incorrect_password[lang],
    username_not_found: username_not_found[lang],
    groups_not_found: groups_not_found[lang],
    group_not_found: group_not_found[lang],
  };
};

export default messages;
