import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const apiKey = process.env.ARK_API_KEY!;
const modelId = process.env.ARK_MODEL_ID!;
const endpoint = process.env.ARK_API_ENDPOINT || "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

const prompt = `用户库存食材：柠檬, 猪肉, 菠萝, 鱼, 威士忌
用户偏好：2人份，30分钟内，正餐，咸香
候选菜品：
1. 威士忌酸 - 鸡尾酒/调酒
2. 冬阴功海鲜汤 - 汤羹/麻辣
3. 烟熏三文鱼沙拉 - 西餐/轻食
4. 鱼香肉丝 - 家常菜/川菜
5. 百香果柠檬蜜 - 饮品/茶饮

从上述候选中选3道，返回JSON：[{"index":1,"recommendationReason":"理由","matchPercentage":85}]`;

const start = Date.now();
console.log("测试关闭 thinking 模式...\n");

const resp = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: modelId,
    messages: [
      { role: "system", content: "你是美食推荐助手。只输出JSON，不要任何额外文字。" },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 512,
    thinking: { type: "disabled" },
  }),
});

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`响应: ${resp.status} (${elapsed}秒)`);

if (resp.ok) {
  const data = await resp.json();
  console.log("回复:", data.choices?.[0]?.message?.content);
  console.log("用量:", JSON.stringify(data.usage));
} else {
  console.log("错误:", await resp.text());
}
