const s=(t,r)=>{if(!t)return"";if(typeof t=="string")return t;const o=r==null?void 0:r.split("-")[0];return t[o]??t.en??Object.values(t).find(Boolean)??""};export{s as g};
