// Common tech logos from the Devicon CDN
const i = (path) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

const SKILL_ICONS = {
  // languages
  javascript: i("javascript/javascript-original.svg"),
  typescript: i("typescript/typescript-original.svg"),
  python: i("python/python-original.svg"),
  java: i("java/java-original.svg"),
  c: i("c/c-original.svg"),
  cplusplus: i("cplusplus/cplusplus-original.svg"),
  r: i("r/r-original.svg"),
  matlab: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png",
  sql: i("mysql/mysql-original.svg"),

  // frontend
  react: i("react/react-original.svg"),
  nextjs: i("nextjs/nextjs-original.svg"),
  tailwind: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg",
  html: i("html5/html5-original.svg"),
  css: i("css3/css3-original.svg"),
  streamlit: "https://streamlit.io/images/brand/streamlit-mark-color.png",

  // backend
  nodejs: i("nodejs/nodejs-original.svg"),
  express: i("express/express-original.svg"),
  fastapi: "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg",
  flask: i("flask/flask-original.svg"),
  playframework: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Play_Framework_logo.svg",

  // cloud / tools
  aws: ("https://www.svgrepo.com/show/448266/aws.svg"),
  azure: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  git: i("git/git-original.svg"),
  supabase: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
  docker: "https://www.svgrepo.com/show/448221/docker.svg",

  // data
  pandas: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  scikitlearn: "https://icon.icepanel.io/Technology/svg/scikit-learn.svg",
  selenium: "https://www.svgrepo.com/show/354321/selenium.svg",
  powerbi: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg",
  powerautomate: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Microsoft_Power_Automate.svg",
  openai: "https://www.svgrepo.com/show/306500/openai.svg",
};


export default SKILL_ICONS;
