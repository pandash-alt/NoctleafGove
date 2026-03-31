<%* 
/** 1. 时间（东八区） **/ 
const time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");

/** 2. 描述输入（可空，给默认值） **/ 
let desc = await tp.system.prompt("请输入描述（可留空）"); 

let descTag = "";
if (!desc || desc.trim() === "") { 
	descTag = " @desc(未填写描述)"; 
} else {
	descTag = ` @desc(${desc})`; 
}

/** 3. 心情单选（可取消，取消则为空） **/ 
const moodOptions = [ 
	"🚀 能量爆棚", 
	"⚡ 兴致勃勃", 
	"🎵 轻松愉快", 
	"🧘 内心安宁", 
	"📄 日常在线", 
	"🔍 正在加载", 
	"📉 兴致缺缺", 
	"🎒 负重前行", 
	"🌪️ 焦躁不安", 
	"🛑 想要逃离", 
	"🪨 沉重无力", 
	"🕳️ 彻底宕机" ];

let mood = await tp.system.suggester( moodOptions, moodOptions, false, "选择心情（可取消）" );

// 如果取消选择（mood为null），则不输出 @mood() 字段
let moodTag = "";
if (mood) {
	moodTag = ` @mood(${mood})`;
}

/** 4. 输出 **/ 
// 拼接时直接使用变量 moodTag
tR += `[Timelog::${time} -${descTag}${moodTag}]` + "\n"; 
%>