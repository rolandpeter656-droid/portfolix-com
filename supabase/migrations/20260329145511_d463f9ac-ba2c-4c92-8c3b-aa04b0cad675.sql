
-- Remove old placeholder archetypes
DELETE FROM portfolio_archetypes;

-- Insert 12 real archetypes
INSERT INTO portfolio_archetypes (archetype_code, goal, timeline, risk_tolerance, allocations, target_return_min, target_return_max, max_drawdown, risk_flag, risk_flag_message, is_active, version, last_reviewed_at, updated_by) VALUES
('C1', 'capital_preservation', 'short', 'conservative',
 '[{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":60,"rationale":"Core stability anchor"},{"ticker":"VGSH","name":"Vanguard Short-Term Treasury ETF","percentage":20,"rationale":"Liquidity and capital safety"},{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":10,"rationale":"Modest growth exposure"},{"ticker":"TIPS","name":"iShares TIPS Bond ETF","percentage":10,"rationale":"Inflation protection"}]',
 4.0, 5.0, -8.0, false, NULL, true, 1, now(), 'system'),

('C2', 'capital_preservation', 'medium', 'conservative',
 '[{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":50,"rationale":"Bond core for stability"},{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":20,"rationale":"Equity for moderate growth"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":15,"rationale":"International diversification"},{"ticker":"TIPS","name":"iShares TIPS Bond ETF","percentage":10,"rationale":"Inflation hedge"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":5,"rationale":"Real estate income"}]',
 5.0, 6.0, -12.0, false, NULL, true, 1, now(), 'system'),

('C3', 'passive_income', 'short', 'conservative',
 '[{"ticker":"VYM","name":"Vanguard High Dividend Yield ETF","percentage":40,"rationale":"High dividend yield equities"},{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":30,"rationale":"Bond income stability"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":15,"rationale":"Real estate dividend income"},{"ticker":"SCHD","name":"Schwab US Dividend Equity ETF","percentage":10,"rationale":"Dividend growth ETF"},{"ticker":"TIPS","name":"iShares TIPS Bond ETF","percentage":5,"rationale":"Inflation protection"}]',
 5.0, 7.0, -15.0, false, NULL, true, 1, now(), 'system'),

('B1', 'wealth_building', 'medium', 'balanced',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":40,"rationale":"US market core growth"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":20,"rationale":"Global diversification"},{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":20,"rationale":"Volatility buffer"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":10,"rationale":"Small cap growth upside"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":10,"rationale":"Real estate exposure"}]',
 7.0, 9.0, -22.0, false, NULL, true, 1, now(), 'system'),

('B2', 'retirement', 'long', 'balanced',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":45,"rationale":"Long-term US equity compounding"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":25,"rationale":"International diversification"},{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":15,"rationale":"Retirement stability buffer"},{"ticker":"VWO","name":"Vanguard FTSE Emerging Markets ETF","percentage":10,"rationale":"Emerging market growth"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":5,"rationale":"Real estate income"}]',
 8.0, 10.0, -25.0, false, NULL, true, 1, now(), 'system'),

('B3', 'passive_income', 'medium', 'balanced',
 '[{"ticker":"VYM","name":"Vanguard High Dividend Yield ETF","percentage":35,"rationale":"Core dividend income"},{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":20,"rationale":"Total market growth base"},{"ticker":"BND","name":"Vanguard Total Bond Market ETF","percentage":20,"rationale":"Fixed income stability"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":15,"rationale":"Real estate income"},{"ticker":"SCHD","name":"Schwab US Dividend Equity ETF","percentage":10,"rationale":"Dividend growth compounding"}]',
 6.0, 8.0, -18.0, false, NULL, true, 1, now(), 'system'),

('A1', 'wealth_building', 'long', 'aggressive',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":50,"rationale":"Maximum US market exposure"},{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":20,"rationale":"Tech and innovation growth"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":15,"rationale":"Global growth diversification"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":10,"rationale":"Small cap high growth"},{"ticker":"VWO","name":"Vanguard FTSE Emerging Markets ETF","percentage":5,"rationale":"Emerging market upside"}]',
 10.0, 13.0, -35.0, false, NULL, true, 1, now(), 'system'),

('A2', 'retirement', 'long', 'aggressive',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":45,"rationale":"Long-term equity wealth engine"},{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":20,"rationale":"Growth sector concentration"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":15,"rationale":"International equity exposure"},{"ticker":"VWO","name":"Vanguard FTSE Emerging Markets ETF","percentage":10,"rationale":"Emerging market premium"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":10,"rationale":"Small cap growth kicker"}]',
 10.0, 12.0, -35.0, false, NULL, true, 1, now(), 'system'),

('A3', 'wealth_building', 'medium', 'aggressive',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":40,"rationale":"US equity core"},{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":25,"rationale":"High growth tech sector"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":15,"rationale":"International growth"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":10,"rationale":"Small cap acceleration"},{"ticker":"VWO","name":"Vanguard FTSE Emerging Markets ETF","percentage":10,"rationale":"Emerging market exposure"}]',
 9.0, 12.0, -32.0, false, NULL, true, 1, now(), 'system'),

('A4', 'wealth_building', 'short', 'aggressive',
 '[{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":50,"rationale":"Broad market liquidity"},{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":30,"rationale":"Growth sector exposure"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":20,"rationale":"Small cap upside"}]',
 8.0, 12.0, -38.0, true, 'Important: Your short timeline combined with an aggressive risk tolerance creates meaningful downside exposure. A market correction could reduce your portfolio value significantly before your target date. Consider a balanced approach instead.', true, 1, now(), 'system'),

('A5', 'passive_income', 'long', 'aggressive',
 '[{"ticker":"VYM","name":"Vanguard High Dividend Yield ETF","percentage":30,"rationale":"Core high dividend income"},{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":25,"rationale":"Total market growth base"},{"ticker":"SCHD","name":"Schwab US Dividend Equity ETF","percentage":20,"rationale":"Dividend growth compounding"},{"ticker":"VNQ","name":"Vanguard Real Estate ETF","percentage":15,"rationale":"Real estate income premium"},{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":10,"rationale":"Growth kicker for long horizon"}]',
 8.0, 10.0, -28.0, false, NULL, true, 1, now(), 'system'),

('A6', 'wealth_building', 'long', 'aggressive',
 '[{"ticker":"QQQ","name":"Invesco QQQ Trust","percentage":35,"rationale":"Maximum growth sector concentration"},{"ticker":"VTI","name":"Vanguard Total Stock Market ETF","percentage":30,"rationale":"Broad market diversification"},{"ticker":"VBK","name":"Vanguard Small-Cap Growth ETF","percentage":20,"rationale":"Small cap high growth"},{"ticker":"VWO","name":"Vanguard FTSE Emerging Markets ETF","percentage":10,"rationale":"Emerging market premium"},{"ticker":"VXUS","name":"Vanguard Total International Stock ETF","percentage":5,"rationale":"Developed market diversification"}]',
 11.0, 14.0, -40.0, false, NULL, true, 1, now(), 'system');
