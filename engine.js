(function(root){
 const END=49;
 function walk(position,steps,direction=1){const path=[];let p=position,d=direction;for(let i=0;i<steps;i++){if(p===END&&d===1)d=-1;if(p===0&&d===-1){path.push(0);continue}p+=d;path.push(p)}return path}
 function create(names){return {version:1,players:names.map((name,id)=>({id,name,pos:0,minus:0,shield:0})),turn:0,round:1,dice:0,pending:null,ended:false,notes:[],bomb:null,prediction:null,twins:[]}}
 function roll(state,value,extra=false){if(state.ended||state.pending)throw Error('请先完成当前格子');const p=state.players[state.turn];const penalty=extra?0:p.minus;const steps=Math.max(0,value-penalty);if(!extra)p.minus=0;const path=walk(p.pos,steps);state.dice=value;if(path.length)p.pos=path[path.length-1];state.pending={tile:p.pos,extra,originalRoll:value,steps};return path}
 function next(state){state.pending=null;state.turn=(state.turn+1)%state.players.length;if(state.turn===0)state.round++;state.twins=state.twins.filter(t=>t.until>=state.round)}
 const engine={END,walk,create,roll,next};if(typeof module!=='undefined')module.exports=engine;else root.GameEngine=engine;
})(typeof window!=='undefined'?window:globalThis);
