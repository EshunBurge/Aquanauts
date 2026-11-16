// Preserve the base route; detour only a blocked leg around local furniture.
export function detourRoute(start,route,isFree,obstacles){const result=[];let from=start;
 const clear=(a,b)=>{const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.12);for(let i=0;i<=n;i++)if(!isFree(a[0]+(b[0]-a[0])*i/Math.max(1,n),a[1]+(b[1]-a[1])*i/Math.max(1,n)))return false;return true;};
 for(const goal of route){if(clear(from,goal)){result.push(goal);from=goal;continue;}
 const nodes=[from,goal];for(const o of obstacles){if(o.x<Math.min(from[0],goal[0])-6||o.x>Math.max(from[0],goal[0])+6||o.z<Math.min(from[1],goal[1])-6||o.z>Math.max(from[1],goal[1])+6)continue;for(const dx of [-1,1])for(const dz of [-1,1]){const p=[o.x+dx*(o.w/2+.55),o.z+dz*(o.d/2+.55)];if(isFree(...p))nodes.push(p);}}
 const dist=nodes.map(()=>Infinity),prev=[],todo=new Set(nodes.map((_,i)=>i));dist[0]=0;while(todo.size){const i=[...todo].reduce((a,b)=>dist[a]<dist[b]?a:b);todo.delete(i);if(i===1||!Number.isFinite(dist[i]))break;for(const j of todo)if(clear(nodes[i],nodes[j])){const d=dist[i]+Math.hypot(nodes[i][0]-nodes[j][0],nodes[i][1]-nodes[j][1]);if(d<dist[j]){dist[j]=d;prev[j]=i;}}}
 if(!Number.isFinite(dist[1]))return[];const path=[1];while(path[0]!==0)path.unshift(prev[path[0]]);result.push(...path.slice(1).map(i=>nodes[i]));from=goal;}
 return result;
}
