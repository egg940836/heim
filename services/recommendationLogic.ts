
import { AIRecommendation, MattressConfig } from "../types";

interface UserAnswers {
  position?: string[];
  firmness?: string[];
  concern?: string[];
}

export const getRuleBasedRecommendation = (answers: Record<string, string[]>): AIRecommendation => {
  // Default Config (Baseline)
  let config: Partial<MattressConfig> = {
    sizeId: 'double',
    coverId: 'soft_fabric',
    comfortLayerIds: ['latex_1'],
    supportLayerId: 'spring_20',
  };

  let reasoningParts: string[] = [];
  let suggestedPillowId = 'neck_pillow';

  // --- 1. Analyze Concerns (Highest Priority) ---
  const concerns = answers.concern || [];
  const isHot = concerns.includes('hot_sleeper');
  const isAllergy = concerns.includes('allergy');
  const isBackPain = concerns.includes('back_pain');
  const isLightSleeper = concerns.includes('light_sleeper');

  // --- 2. Analyze Position ---
  const position = answers.position?.[0] || 'combo_sleeper';
  const isSide = position === 'side_sleeper';
  const isStomach = position === 'stomach_sleeper';

  // --- Logic Engine ---

  // Step A: Cover Selection
  if (isHot) {
    config.coverId = 'cooling';
    reasoningParts.push("既然怕熱，當然要選「極地冰川涼感表布」，瞬間降溫超有感！");
  } else if (isAllergy) {
    config.coverId = 'sanitized';
    reasoningParts.push("為了鼻子過敏的你，哈姆推薦「山寧泰抗菌表布」，壞菌通通退散！");
  } else {
    // Default based on firmness preference
    const firmness = answers.firmness?.[0];
    if (firmness === 'soft') {
       config.coverId = 'soft_fabric'; // Cozy
       reasoningParts.push("選了柔軟的「豆狸絨毛表布」，摸起來像雲朵一樣舒服是也。");
    } else {
       config.coverId = 'tencel'; // Smooth/Durable
       reasoningParts.push("這款「奧地利天絲表布」滑順又耐用，是很棒的基礎選擇喔！");
    }
  }

  // Step B: Support Layer (Springs)
  if (isBackPain) {
    config.supportLayerId = 'spring_23'; // Hardest
    reasoningParts.push("腰痠背痛的話，基底一定要穩！「2.3mm 硬式獨立筒」能好好撐住你的脊椎。");
  } else if (isLightSleeper) {
    config.supportLayerId = 'spring_uk'; // Anti-disturbance
    reasoningParts.push("淺眠的你最適合「橄欖球型獨立筒」，抗干擾效果一級棒，翻身也不會吵到人。");
  } else {
     // Based on firmness preference
     const firmness = answers.firmness?.[0];
     if (firmness === 'firm') {
         config.supportLayerId = 'spring_honeycomb';
         reasoningParts.push("喜歡硬一點的睡感，排列密集的「蜂巢式獨立筒」最適合你了。");
     } else {
         config.supportLayerId = 'spring_20';
         reasoningParts.push("標準的「2.0mm 獨立筒」軟硬適中，是海姆島最經典的選擇！");
     }
  }

  // Step C: Comfort Layers (The Toppings)
  // We stack up to 2-3 layers based on needs.
  const layers: string[] = [];

  if (isHot) {
      layers.push('hydro_foam'); // Cooling foam
      reasoningParts.push("再加上「親水棉」，透氣不悶熱，夏天也能睡得香甜。");
  }

  if (isSide) {
      // Side sleepers need pressure relief (Thick layers)
      if (!layers.includes('hydro_foam')) layers.push('latex_5'); // 5cm Latex
      else layers.push('latex_25'); // Add more bounce
      
      reasoningParts.push("側睡容易壓迫肩膀，所以舒適層要厚一點，讓身體能溫柔地陷進去。");
      suggestedPillowId = 'cooling_pillow'; // Higher pillow for side sleepers
  } else if (isStomach) {
      // Stomach needs flat/firm
      layers.push('latex_1'); // Thin latex
      suggestedPillowId = 'potato_pillow'; // Low pillow
  } else {
      // Back or Combo
      if (isBackPain) {
          layers.push('relief_foam_25'); // Basic cushioning but not too deep
      } else {
          // Default / Comfort seeker
          layers.push('latex_25');
          layers.push('relief_foam_25');
      }
      suggestedPillowId = 'neck_pillow';
  }

  // Add horsehair for luxury/hot if space permits
  if (isHot && layers.length < 3) {
      layers.unshift('horsehair'); // Put horsehair on top/middle for breathability
      reasoningParts.push("哈姆還偷偷幫你加了「馬尾毛」，這可是頂級的排濕神器喔！");
  }

  config.comfortLayerIds = layers;

  // --- Final Reasoning Construction ---
  const intro = "吱吱！經過哈姆精密的計算...";
  const body = reasoningParts.join("");
  const outro = " 這樣的組合絕對能讓你一覺到天亮是也！";

  return {
    reasoning: `${intro}${body}${outro}`,
    config: config,
    suggestedPillowId: suggestedPillowId
  };
};
