/**
 * 批量为菜谱添加图片
 *
 * 使用方法:
 *   1. 在 .env.local 中添加 UNSPLASH_ACCESS_KEY="your-key"
 *   2. 运行: npx tsx scripts/batch-add-images.ts
 *   3. 预览模式(不写入): npx tsx scripts/batch-add-images.ts --dry-run
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

// ═══════════════════════════════════════════════════
// 中文菜名 → 英文搜索词映射表
// ═══════════════════════════════════════════════════
const DISH_NAME_MAP: Record<string, string> = {
  // ── 家常菜 ──
  "西红柿炒鸡蛋": "tomato scrambled eggs chinese",
  "西红柿炒蛋": "tomato scrambled eggs chinese",
  "麻婆豆腐": "mapo tofu",
  "鱼香肉丝": "yuxiang shredded pork",
  "红烧肉": "braised pork belly chinese",
  "酸辣土豆丝": "shredded potato chinese stir fry",
  "宫保鸡丁": "kung pao chicken",
  "回锅肉": "twice cooked pork sichuan",
  "农家小炒肉": "stir fried pork with chili peppers",
  "辣椒炒肉": "pepper stir fried pork chinese",
  "香菇炒油菜": "mushroom bok choy stir fry",
  "青椒肉丝": "green pepper shredded pork",
  "清炒时蔬": "stir fried vegetables chinese",
  "尖椒土豆丝": "spicy shredded potato",

  // ── 硬菜 ──
  "剁椒鱼头": "steamed fish head with chili",
  "清蒸鲈鱼": "steamed sea bass chinese",
  "清蒸鳕鱼": "steamed cod fish",
  "白灼虾": "blanched shrimp chinese",
  "水煮肉片": "sichuan boiled pork slices",
  "水煮牛肉": "sichuan boiled beef",
  "卤排骨": "braised spare ribs chinese",
  "牛腩炒青椒": "beef brisket green pepper stir fry",
  "番茄肥牛锅": "tomato beef hotpot",
  "口水鸡": "mouthwatering chicken sichuan",

  // ── 蒸菜 ──
  "蒸水蛋": "steamed egg custard chinese",
  "虾皮蒸蛋羹": "steamed egg custard shrimp",
  "清蒸枸杞鸡肉": "steamed chicken with goji berries",

  // ── 轻食/沙拉 ──
  "蒜蓉西兰花": "garlic broccoli chinese",
  "香煎鸡胸肉": "pan seared chicken breast",
  "蔬菜沙拉": "fresh vegetable salad",
  "鸡胸肉沙拉": "grilled chicken salad",
  "烤鸡胸沙拉": "grilled chicken breast salad",
  "烟熏三文鱼沙拉": "smoked salmon salad avocado",
  "西兰花炒虾仁": "broccoli shrimp stir fry",
  "鸡肉蔬菜卷": "chicken vegetable wrap",

  // ── 西餐 ──
  "黑椒牛排": "black pepper steak",
  "经典意面": "creamy pasta",
  "海鲜番茄意面": "seafood tomato pasta",
  "牛排意面": "steak with pasta",
  "香煎三文鱼波奇饭": "pan seared salmon poke bowl",
  "意式番茄肉酱面": "spaghetti bolognese",

  // ── 日料 ──
  "寿司卷": "sushi roll",
  "三文鱼刺身": "salmon sashimi",
  "三文鱼寿司拼盘": "salmon sushi platter",
  "日式豚骨拉面": "tonkotsu ramen",
  "照烧鸡排饭": "teriyaki chicken rice bowl",
  "三文鱼饭团": "salmon onigiri",

  // ── 韩餐 ──
  "韩式拌饭": "korean bibimbap",
  "韩式石锅拌饭": "korean stone pot bibimbap",
  "辣炒年糕": "tteokbokki korean rice cake",
  "韩式部队锅": "budae jjigae army stew",
  "韩式炸鸡年糕": "korean fried chicken tteokbokki",

  // ── 主食/面条 ──
  "扬州炒饭": "yangzhou fried rice",
  "油泼面": "oil splashed noodles chinese",
  "老北京炸酱面": "zhajiang noodles beijing",
  "红烧牛肉面": "braised beef noodle soup",
  "葱油拌面": "scallion oil noodles",
  "酱油炒面": "soy sauce fried noodles",
  "清汤青菜面": "chinese vegetable noodle soup",
  "台式卤肉饭": "taiwanese braised pork rice",
  "鲜肉粽子": "chinese zongzi rice dumpling",
  "螺蛳粉": "luosifen river snails noodle",
  "麻酱凉皮": "sesame cold noodles chinese",

  // ── 早餐/小吃 ──
  "煎饼果子": "chinese jianbing crepe",
  "鲜肉小笼包": "xiaolongbao soup dumpling",
  "鸡蛋小饼": "egg pancake chinese",
  "儿童鸡蛋卷": "egg roll chinese kids",
  "烤肠花菜": "roasted sausage cauliflower",
  "奶香玉米烙": "sweet corn pancake",
  "鸡肉蔬菜饼": "chicken vegetable pancake",

  // ── 汤羹 ──
  "紫菜蛋花汤": "seaweed egg drop soup",
  "番茄排骨汤": "tomato pork rib soup",
  "萝卜排骨汤": "daikon radish pork rib soup",
  "冬阴功海鲜汤": "tom yum seafood soup",

  // ── 粥 ──
  "小米南瓜粥": "millet pumpkin porridge",
  "南瓜小米粥": "pumpkin millet porridge",
  "红豆薏米粥": "red bean barley porridge",

  // ── 凉菜 ──
  "凉拌黄瓜": "smashed cucumber salad chinese",
  "蒜泥凉拌黄瓜": "garlic cucumber salad chinese",
  "凉拌粉丝": "cold glass noodle salad chinese",

  // ── 甜品/饮品 ──
  "珍珠奶茶": "bubble tea boba",
  "黑糖珍珠奶茶": "brown sugar bubble tea",
  "鲜榨橙汁": "fresh orange juice",
  "鲜橙胡萝卜汁": "orange carrot juice",
  "芒果慕斯蛋糕": "mango mousse cake",
  "银耳莲子糖水": "white fungus lotus seed soup dessert",
  "莫吉托鸡尾酒": "mojito cocktail",
  "青柠莫吉托": "mojito cocktail lime mint",
  "龙舌兰日出": "tequila sunrise cocktail",
  "水果茶": "fruit tea",
  "茉莉葡萄茶": "jasmine grape tea",
  "微醺果味鸡尾酒": "fruity cocktail peach",
  "红糖冰粉": "chinese jelly dessert brown sugar",
  "酒酿小圆子": "sweet rice wine dumpling dessert",
  "杨枝甘露": "mango pomelo sago dessert",
  "提拉米苏": "tiramisu cake",
  "巴斯克芝士蛋糕": "basque burnt cheesecake",
  "红豆双皮奶": "double skin milk pudding red bean",
  "蒸南瓜布丁": "steamed pumpkin pudding",

  // ── 儿童餐/辅食 ──
  "土豆牛肉泥": "mashed potato beef puree baby food",
};

// ═══════════════════════════════════════════════════
// Unsplash 搜索
// ═══════════════════════════════════════════════════
async function searchUnsplash(query: string): Promise<string | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`  ❌ Unsplash API 错误 (${res.status}): ${errText}`);
      return null;
    }
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // 使用 regular 尺寸 (1080px 宽)，适合移动端
      return data.results[0].urls.regular as string;
    }
    return null;
  } catch (err: any) {
    console.error(`  ❌ 搜索失败: ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════
// 获取英文搜索词
// ═══════════════════════════════════════════════════
function getSearchQuery(dishName: string): string {
  // 精确匹配
  if (DISH_NAME_MAP[dishName]) {
    return DISH_NAME_MAP[dishName];
  }
  // 模糊匹配：尝试部分匹配
  for (const [cn, en] of Object.entries(DISH_NAME_MAP)) {
    if (dishName.includes(cn) || cn.includes(dishName)) {
      return en;
    }
  }
  // 兜底：直接用中文 + "food" 搜索
  return `${dishName} chinese food`;
}

// ═══════════════════════════════════════════════════
// 主流程
// ═══════════════════════════════════════════════════
async function run() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("❌ 请在 .env.local 中设置 UNSPLASH_ACCESS_KEY");
    console.error("   获取方式: https://unsplash.com/developers");
    console.error('   添加一行: UNSPLASH_ACCESS_KEY="your-access-key"');
    process.exit(1);
  }

  console.log("🔍 查询缺少图片的菜谱...\n");

  // 查询所有没有图片的菜谱
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, name, image")
    .or("image.is.null,image.eq.");

  if (error) {
    console.error("❌ 查询失败:", error.message);
    return;
  }

  if (!recipes || recipes.length === 0) {
    console.log("✅ 所有菜谱都已有图片，无需更新！");
    return;
  }

  console.log(`📋 找到 ${recipes.length} 道菜谱需要添加图片\n`);

  if (DRY_RUN) {
    console.log("🔍 [预览模式] 仅显示搜索词，不写入数据库\n");
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const query = getSearchQuery(recipe.name);
    console.log(`[${i + 1}/${recipes.length}] ${recipe.name} → 搜索: "${query}"`);

    if (DRY_RUN) {
      continue;
    }

    // 搜索图片
    const imageUrl = await searchUnsplash(query);

    if (imageUrl) {
      // 更新数据库
      const { error: updateError } = await supabase
        .from("recipes")
        .update({ image: imageUrl })
        .eq("id", recipe.id);

      if (updateError) {
        console.error(`  ❌ 更新失败: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`  ✅ 已添加图片`);
        successCount++;
      }
    } else {
      console.log(`  ⚠️  未找到匹配图片，跳过`);
      failCount++;
    }

    // Unsplash 免费版限制 50次/小时，每次请求间隔 1.5 秒
    if (!DRY_RUN && i < recipes.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\n════════════════════════════════");
  if (DRY_RUN) {
    console.log("🔍 预览完成。去掉 --dry-run 参数即可正式运行。");
  } else {
    console.log(`✅ 成功: ${successCount} 道`);
    if (failCount > 0) console.log(`❌ 失败: ${failCount} 道`);
    console.log(`📊 总计处理: ${recipes.length} 道菜谱`);
  }

  // 统计当前有图片的菜谱数量
  const { count: withImage } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .neq("image", "");
  const { count: total } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true });
  console.log(`\n📸 当前有图片: ${withImage}/${total} 道菜谱`);
}

run();
