(function(root){
 const END=49;
 const SAFE=[25,37,48];
 function isProtected(player){return player.safe===undefined?SAFE.includes(player.pos):!!player.safe}
 function land(player,position){player.pos=position;player.safe=SAFE.includes(position)}
 function targets(state,ids){return state.players.filter(p=>p.id!==state.turn&&!isProtected(p)&&(!ids||ids.includes(p.id)))}
 function walk(position,steps,direction=1){const path=[];let p=position,d=direction;for(let i=0;i<steps;i++){if(p===END&&d===1)d=-1;if(p===0&&d===-1){path.push(0);continue}p+=d;path.push(p)}return path}
 function create(names){return {version:1,players:names.map((name,id)=>({id,name,pos:0,minus:0,shield:0,safe:false})),turn:0,round:1,dice:0,pending:null,ended:false,notes:[],bomb:null,prediction:null,twins:[]}}
 function roll(state,value,extra=false){if(state.ended||state.pending)throw Error('请先完成当前格子');const p=state.players[state.turn];const penalty=extra?0:p.minus;const steps=Math.max(0,value-penalty);if(!extra){p.minus=0;p.safe=false}const path=walk(p.pos,steps);state.dice=value;land(p,path.length?path[path.length-1]:p.pos);state.pending={tile:p.pos,extra,originalRoll:value,steps};if(p.pos===END){state.ended=true;state.loser=p.id}return path}
 function next(state){state.pending=null;state.turn=(state.turn+1)%state.players.length;if(state.turn===0)state.round++;state.twins=state.twins.filter(t=>t.until>=state.round)}
 const engine={END,SAFE,isProtected,land,targets,walk,create,roll,next};if(typeof module!=='undefined')module.exports=engine;else root.GameEngine=engine;
})(typeof window!=='undefined'?window:globalThis);
