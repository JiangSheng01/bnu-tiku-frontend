interface loginParam {
  userName: string;
  userPassword: string;
}

interface registerParam {
  userName: string;
  userPassword: string;
  email: string;
  checkPassword: string;
}

interface UserInfo {
  id: number;
  name: string;
  role: string;
}

export { loginParam, UserInfo, registerParam };
