/* Selected short topics, not full reproductions of the referenced compilations. */
(function(root){
function extend(data){
 const checked='2026-10-02';
 const sources={
  have:{name:'二两小酒桶 · 我有你没有',likes:'1956',saves:'758',checked,url:'https://www.xiaohongshu.com/search_result/690ab6ab0000000004023be8?xsec_token=ABvIMrVN2LaKUZmWc7sRNXD8Bb8MZRRGfoaLlFHxT28BM=&xsec_source='},
  haveFun:{name:'黑话乐园 · 我有你没有',likes:'1万',saves:'2938',checked,url:'https://www.xiaohongshu.com/search_result/680e12f2000000002100526f?xsec_token=ABi771k_6QQhiPAk1c9euVu0EavqI-hxLk84TqSgCbGfU=&xsec_source='},
  likely:{name:'有氧漂浮 · 谁最有可能（温和版）',likes:'6225',saves:'5266',checked,url:'https://www.xiaohongshu.com/search_result/694dda81000000001d03d783?xsec_token=ABWQ_On4aDA8DaaJaoh8xf2s79FBg1gN3jY34rYfPARQs=&xsec_source='},
  taboo:{name:'嗨马团建 · 害你在心口难开',likes:'3132',saves:'1693',checked,url:'https://www.xiaohongshu.com/search_result/68a67de8000000001d02fde7?xsec_token=AB6c3Rpxt19P9PhMyOsERzpAPBVkvedxR4XLxTSmZGsJE=&xsec_source='},
  irrelevant:{name:'二十 · 无意义100问',likes:'1358',saves:'694',checked,adaptation:'普通问答话题，改用于答非所问',url:'https://www.xiaohongshu.com/search_result/6878f141000000000b02c411?xsec_token=ABojxu-gBdANZ1rWWuV2DIEbADN1ZVSUTKfwr1M3SI7sQ=&xsec_source='}
 };
 const game=id=>data.games.find(g=>g.id===id);
 function add(id,cards,source,category){const g=game(id);g.cardSources??={};const target=category?(g.categories[category]??=[]):g.cards;const existing=new Set(g.categories?Object.values(g.categories).flat():g.cards);cards.forEach(text=>{if(existing.has(text))return;target.push(text);existing.add(text);g.cardSources[text]=source})}
 add('have',[
  '连续追同一部剧超过24小时','有过不属于自己星座的幸运物','开会时睡着并打过呼噜','尝过鲱鱼罐头或崂山白花蛇草水','因迷路急得哭出来','有一个保存超过10年的毛绒玩具','在电影院接过吻','与最好的朋友相识超过15年','特别爱吃别人嫌弃的香菜或折耳根','给前任准备过最终没送出的信或礼物','用社交平台小号与人争论过','在机场拿错行李箱，到酒店才发现','参加过前任的婚礼','模仿过某位明星','走错过公共卫生间','替同事背过黑锅','生气时删掉或拉黑过好朋友','有过网恋见面的经历','认真研究过塔罗牌','梦到过在场朋友扮演反派','打游戏生气时摔过手柄'
 ],sources.have);
 add('have',['把老板误叫成“宝贝”','刷牙时错把洗面奶当牙膏','单身超过二十年，仍期待一见钟情'],sources.haveFun);
 add('likely',[
  '谁最喜欢替朋友分析感情？','谁最容易恋爱上头？','谁最容易因为小事生气？','谁吵架时反应最快？','谁最爱打听新鲜八卦？','谁最容易相信别人的玩笑？','谁最容易忘事？','谁最爱公开秀恩爱？','谁最会撒娇？','谁最容易在深夜伤感？','谁最喜欢照镜子打扮？','谁最容易被故事感动哭？','谁最有审美品位？','谁最能熬夜？','谁最可能聚会迟到？','谁最喜欢把事情拖到最后？','谁最会一本正经地说谎？','谁聊天最有梗？','谁最容易弄丢东西？','谁的手机最容易没电？','谁最会忙里偷闲？','谁最经常低头看手机？','谁最容易冲动购物？','谁一天到晚精力充沛？','谁做手工最拿手？','谁情绪最稳定？','谁最经常忘记回复消息？','谁发朋友圈最勤？','谁最爱给朋友的动态点赞？','谁最可能第一个结婚？','谁最可能留着前任送的礼物？','谁最可能和前任成为普通朋友？','谁最容易对别人心动？','谁喜欢比自己年长的对象？','谁喜欢比自己年幼的对象？','谁表达喜欢时最直接？'
 ],sources.likely);
 add('irrelevant',[
  '日出和日落，你更喜欢哪个？','你最喜欢哪位歌手？','你最讨厌什么颜色？','你最喜欢什么颜色？','你更喜欢城市还是乡村？','你做过什么傻事？','你最怕失去什么？','你最想得到什么？','你将来想成为怎样的人？','一个人待着会无聊吗？','火锅和烧烤，你选哪个？','你不喜欢别人怎么称呼你？','你对什么东西过敏？','你最喜欢哪道菜？','你有耐心吗？','你最喜欢什么运动？','巧克力和饼干，你选哪个？','你最擅长什么？','你更喜欢冷饮还是热饮？','甜口和辣口，你选哪个？','中餐和西餐，你选哪个？','你喜欢自拍吗？','有烦恼时，你会找谁聊？','你更喜欢出门还是宅家？','你最近过得怎么样？','你对未来有期待吗？','你最希望发生什么事？','你觉得什么食物最难吃？','薯片和薯条，你选哪个？','你喜欢水煮蛋吗？','你最晚几点睡过？','你喜欢热闹吗？','你擅长安慰别人吗？','你的MBTI是什么？','你喜欢什么花？','雨天和晴天，你更喜欢哪个？'
 ],sources.irrelevant);
 add('taboo',['吃饭','睡觉','游戏','手机','电视','电影','跳舞','跑步','漂亮','帅','学习','工作','但是','因为','所以','然后','当然','结束','考试','朋友'],sources.taboo,'帖子补充 · 禁词');
 add('taboo',['举手','比耶','托下巴','跺脚','歪头','打哈欠','揉眼睛','舔嘴唇','转身','坐下','伸懒腰','插口袋','打响指','假装打电话','单脚站立','原地转圈','用手扇风','假装擦汗','叹气','耸肩'],sources.taboo,'帖子补充 · 动作');
 game('taboo').actionCategories=['经典动作','帖子补充 · 动作'];
 data.researchSources=sources;
 return data;
}
if(typeof module!=='undefined')module.exports=extend;else extend(root.PartySocial);
})(typeof window!=='undefined'?window:globalThis);
