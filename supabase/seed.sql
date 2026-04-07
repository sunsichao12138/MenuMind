-- ============================================
-- Zenith Culinaria - Seed Data
-- ============================================

-- 食材种子数据
INSERT INTO ingredients (id, name, amount, expiry_days, category, image, suggestions) VALUES
  (gen_random_uuid(), '西红柿', '3 个', 3, '蔬菜', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw92LeduIFGMJ3Fl-AMj9sd06Xuecxg0JYhCdRjzJz1LwvdudKquejHmaFeRkEY2M_qlP7OSWAZTQkk5KWXU5KHbaqaopTkilog3E0Xmj2NfAnLW3ymTthVjkZ2HLoVGjxB6elzpW4j9H4q7iGXAR3_VGvRqYOE0IBJgJVN-ArSUt8j0UgE2u7yy3bMxm0LHTvhHD5wmdLHBreTvCY-IBK82JqFXBDpCkmvWExK4oU6N2d9odq2rSh4vZvn_bF6c2K55twGsyZqsyc', ARRAY['番茄炒蛋', '汤面', '凉拌']),
  (gen_random_uuid(), '牛油果', '2 个', 7, '蔬菜', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-66hL6Vm_2rFaGJsPWtj2edtRW-EDlUJXIs6C_M2Duzrnp0FLfPNUT6mtVD_15tPtSyCELtI0mx6BgFWsHWrJ8aDV8sdbr6S2_HR1BJ0hGvTDZP2jQ7LOCj-MkfNc3UaTX4k0zxNkq6uxZchPqu5gMPBaKCYjfwH3ZKXtSpUr-sU2rCkp0I0wWpDaQUCSYVlAB2S8f7REqX98NizuXNbyotCD3pH9miey73wZXjXoGIJ5Y0QljJbz5Ik0kIJzynlZlAXU2T5emHeS', ARRAY['沙拉', '奶昔', '吐司涂层']),
  (gen_random_uuid(), '小油菜', '1 把', 1, '蔬菜', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1xB_FTZuKFlp10gAbs-7Gn5uwYWFCxy_r-MA2QbNmSaT5FUGE9BKmLMPv5FtMCCOwcAEtMZHktPxezkyB2JJ47Tc9_OshH_BZOOvYCbP3sOScOHTkCPMf6aA_xfOJog1Ch2odjFogsinFLw0ESD44i-n9W4k67oeaPNOWET4H8id29CLxrToB2hSQQMDOz_9M2DAqa667JrmqBdirsQ8sR16C19xU67JbBbdoLyg6u2dGnc9NqrTPlY8rPgbARq4FEFia-zdlLcK0', ARRAY['清炒油菜', '香菇菜心', '面条辅菜']),
  (gen_random_uuid(), '鸡蛋', '10 个', 15, '蛋奶肉类', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_h_L_n_l_m_o_p_q_r_s_t_u_v_w_x_y_z_0_1_2_3_4_5_6_7_8_9_A_B_C_D_E_F', ARRAY['水煮蛋', '煎蛋', '蛋花汤']),
  (gen_random_uuid(), '牛奶', '1 盒', 5, '蛋奶肉类', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_h_L_n_l_m_o_p_q_r_s_t_u_v_w_x_y_z_0_1_2_3_4_5_6_7_8_9_A_B_C_D_E_F', ARRAY['直接饮用', '麦片', '拿铁']),
  (gen_random_uuid(), '鸡胸肉', '500 g', 2, '蛋奶肉类', 'https://lh3.googleusercontent.com/aida-public/AB6AXuE1_h_L_n_l_m_o_p_q_r_s_t_u_v_w_x_y_z_0_1_2_3_4_5_6_7_8_9_A_B_C_D_E_F', ARRAY['香煎鸡胸', '宫保鸡丁', '沙拉'])
ON CONFLICT DO NOTHING;

-- 菜谱种子数据
INSERT INTO recipes (id, name, description, image, tags, time, difficulty, calories, recommendation_reason, match_percentage, inventory_match, ingredients_have, ingredients_missing, steps) VALUES
  ('qjrs', '青椒肉丝', '经典家常川菜，咸鲜适口，脆嫩多汁，是极佳的下饭之选。',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCVxzIuSrqv6jivulrOt0NUzn3BWcBx3O02SjeBJ0jAGL0J9hMkDdMovqOAeGqQ2QoQG3Z84c6V-_RzFn14KckdRUGuikBGNyTHZOTFveWr_mFrqKot-eNsdkCUvR9QR4bXaRQEJoXmoIrFB1yckMH0hKc9cTopWrlP5burcIkQ0PMEVkGiuSDDUPCMn4Z_Erkki9CloOW9KvDIFE4_F6KXBkGO7pXBZmd4KS_bNtxIeJVby3NkVvOm_5rF9HHW_L7AQU9xFlyh4Upa',
   ARRAY['正餐下饭'], '15分钟', '中等难度', '280 kcal',
   '青椒富含维生素C，肉丝提供优质动物蛋白。大火快炒锁住食材水分，保持了青椒的脆爽和肉丝的滑嫩，开胃又健康。',
   NULL, NULL,
   '[{"name":"里脊肉","amount":"200g"},{"name":"青椒","amount":"2个"},{"name":"大蒜","amount":"3瓣"}]'::jsonb,
   '[{"name":"生抽","amount":"1勺"},{"name":"老抽","amount":"1/2勺"},{"name":"淀粉","amount":"1勺"},{"name":"料酒","amount":"1勺"}]'::jsonb,
   ARRAY['里脊肉切丝，加入生抽、料酒、淀粉腌制10分钟', '青椒去籽切丝，大蒜切片备用', '大火热油，爆香蒜片，下肉丝快炒至变色，加入青椒翻炒均匀即可']),

  ('swy', '香煎三文鱼波奇饭', '使用您库存中的最后 200g 三文鱼。清新咸香，搭配 AI 特制酱汁。',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAXBf4rxx6i3gGvkMld_3TAHTub6p05x7EPvns5rUlmeQhBqilEKokMCNaZLAq3m7P8GYVWN3oNYMsB8BFgAm9to23ZpDuOkcreZvAlYrgN6jD-yCzJdJJhVCmv5XKR5ZkILgOW8ImfxS1kTppQg6oGs0yvVUs7qeYfzL_C1dWlosCnMbCnazUJ5p2YXpkiPU31jW5oZTMZ3FVcoMtm9itFosQIFO73n9I8H8ylpLY-GSxk-drp8ZsstiH7Pw0ntI8gJD8pIj8OCYLH',
   ARRAY['轻食'], '15分钟', '简单', '450 kcal',
   '三文鱼富含不饱和脂肪酸，搭配新鲜蔬菜，营养均衡且口感丰富。',
   96, 4,
   '[{"name":"三文鱼","amount":"200g"}]'::jsonb,
   '[]'::jsonb,
   ARRAY['三文鱼两面撒少许盐和黑胡椒腌制5分钟', '平底锅中火加少许油，煎至两面金黄', '米饭盛入碗中，摆上三文鱼和配菜，淋上酱汁即可']),

  ('rjm', '意式番茄肉酱面', '利用现有的干意面和牛肉末，AI 建议加入一点柠檬皮提味。',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDHabKLtsNc16gFjKZ9N9MzoSW6kP9wTWftFGRZOXM5UtxlXM738OIHxU2iGp5CJkIxDm-WvixgWyb9mm53cErLkPmLeCOWDMQc5Sp0j51QHk_rlX-tVwPSiFLP-BU--ulMDW-QbNxkDW7XDRf645XLt-b2j-z8H_Y5L8yGl8fnsCTPFoTXvIKw8oTyDXwTqhGDBVQ5m0mKNWU_6DxX-MM3EoLXdjo1hOKLqE8aZz-Fh7E0pteNke_glaoBdWnIT9pQPAr1jAsT31ld',
   ARRAY['正餐'], '25分钟', '中等', '520 kcal',
   '经典的番茄肉酱面，加入柠檬皮能提升风味的层次感。',
   89, 2,
   '[]'::jsonb, '[]'::jsonb,
   ARRAY['煮意面至八分熟捞出备用', '锅中加油炒香洋葱和蒜，加入牛肉末炒散', '加入番茄酱和调味料炖煮15分钟，浇在意面上即可']),

  ('cqsz', '清炒时蔬', '清爽口感，锁住食材原味。',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCus7eVdxZLWSx9XyVNYTdkr8iiHiGz1GZpSoQ-vNXr8brFHhT2aGBShRsX8reSV0-OhxE8I_DPGdLo_vDhH5DNMKCMOKtXA7pqihgw_C7XXJxrkCZJGioaXPvbi93yOlIz87sb-ejNNsAPKUVtlp1UxoKvfKc1B-rMN0vrBvJfRNUN9KLpls5V9oOOvaDln2glfMricbRMauEIganLbS0oyLYU-wcNMkRSYznjeb2c7dH76f6Bp-8ePr7FJY9OZSsCcohwUrBCPC36',
   ARRAY['家常'], '10分钟', '简单', '120 kcal',
   '大火快炒，保留蔬菜的清脆和营养。',
   NULL, NULL,
   '[]'::jsonb, '[]'::jsonb,
   ARRAY['蔬菜洗净切好备用', '大火热锅加油，放入蔬菜快速翻炒', '加入少许盐和鸡精调味，出锅即可']),

  ('gbjd', '宫保鸡丁', '酸辣适口，经典川味名菜。',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDe1YuI2QQ1qxevPczY6CJDZI2LAryZRt26nl3OKRKOdtVO0GiLgFe5IIw79g3X3VQxMC0faFl_KgrAphXxHHCulSzkuXul4pPztv8-3q-yjk1nM7KnNDgkxhMpiWWvzQQp57ljjNq8PuVOKVZCVcouQ4LfGfL4UQMXsQN1Xt7U0QTN3C8KDh75fJ8_WTkomUelYN2KcaWTuFrbk0G9UuZvVDjApvYIRJnhY0CJdvf7ZNwui2CKBT134FdBgWedn8_NRN3P6Bm33eOf',
   ARRAY['经典'], '15分钟', '中等', '350 kcal',
   '鸡肉滑嫩，花生酥脆，酸甜微辣，非常下饭。',
   NULL, NULL,
   '[]'::jsonb, '[]'::jsonb,
   ARRAY['鸡胸肉切丁，加入淀粉、料酒、盐腌制15分钟', '调制宫保汁：醋、酱油、糖、淀粉水混合', '热油炒花椒干辣椒出香，下鸡丁炒熟，加入花生米和宫保汁翻炒均匀'])
ON CONFLICT (id) DO NOTHING;
