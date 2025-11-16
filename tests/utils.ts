import path from "path";

const HomePage = `${process.env.CRM_BASE_URL}/home`;
const LoginPage = `${process.env.CRM_BASE_URL}/login`;
const AgentDesktopPage = `${process.env.CRM_BASE_URL}/agent-desktop`;
const ContactPage = `${process.env.CRM_BASE_URL}/contact`;

const UserCRM = "wittawat+crmv3@cloudsoft.co.th";
const PassCRM = "MAIaam1146!";

// Limit File Size: 5mb
const Files = {
  Equal: "path/to/file1",
  Higher: path.resolve(__dirname, "../../../test-file/higher.pdf"),
  Lower: "path/to/file3",
};

// Timeout Default State
const UrlTimeout = 3000; // 3s
const CloseTimeout = 2000; // 2s

const SetTimeOut = (duration: String): number => {
  const lastChar: string | undefined = duration.at(-1);
  const timeOutStr = duration.slice(0, duration.length);
  const miliTime = 1000;

  if (lastChar?.toLowerCase() == "s") {
    return parseInt(timeOutStr) * miliTime;
  } else if (lastChar?.toLowerCase() == "m") {
    return parseInt(timeOutStr) * miliTime * 60;
  } else if (lastChar?.toLowerCase() == "h") {
    return parseInt(timeOutStr) * miliTime * 60 * 60;
  } else if (lastChar?.toLowerCase() == "d") {
    return parseInt(timeOutStr) * miliTime * 60 * 60 * 24;
  } else {
    throw new Error("Invalid time unit");
  }
};

// export variable
export {
  // page
  HomePage,
  LoginPage,
  AgentDesktopPage,
  ContactPage,
  UserCRM,
  PassCRM,
  UrlTimeout,
  CloseTimeout,
  Files,
};

// export function
export {};
