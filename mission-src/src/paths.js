// Vite's relative build works at both /mission/ and /Aquanauts/mission/.
export function publicPath(path, base=import.meta.env?.BASE_URL??'/') {
 return base+path.replace(/^\/+/, '');
}
export function websiteLinks(missionURL) {
 const home=new URL('../',missionURL);
 return {home:home.href,dashboard:new URL('dashboard.html',home).href};
}
