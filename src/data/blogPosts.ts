export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  publishedAt: string;
  readTime: string;
  category: string;
  excerpt: string;
  coverGradient: string;
  content: BlogPostSection[];
}

export type BlogPostSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'pullquote'; text: string }
  | { type: 'highlightbox'; label: string; text: string }
  | { type: 'stats'; items: { number: string; label: string }[] }
  | { type: 'timeline'; items: { title: string; description: string }[] }
  | { type: 'cta' };

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'from-lagos-to-the-world',
    title: 'From Lagos to the World: How a Failed Hedge Fund Became a Global Investment Platform',
    subtitle: 'The origin story of PortfoliX — from a Nigerian neighborhood to a B2C fintech pivot that changed everything.',
    author: 'Roland Peter',
    authorRole: 'Founder & CEO, PortfoliX',
    authorInitials: 'RP',
    publishedAt: 'February 22, 2026',
    readTime: '12 min read',
    category: "Founder's Story",
    excerpt:
      'Growing up in Nigeria, I watched hard workers die broke and asked why. That question led me to investing, entrepreneurship, a failed hedge fund — and eventually, a platform that gives anyone a personalized investment portfolio in three minutes.',
    coverGradient: 'from-teal-900/40 via-emerald-900/20 to-gray-900',
    content: [
      {
        type: 'paragraph',
        text: 'I grew up watching people work themselves to exhaustion and still die broke. Not lazy people. Not careless people. Hard workers. People who gave everything to their jobs, woke before dawn, returned after dark — and still had nothing to show for it at the end of the month. That used to haunt me.',
      },
      {
        type: 'paragraph',
        text: "As a kid in Nigeria, that image planted a question in me I couldn't shake: Why does working hard not guarantee getting rich? And what would it look like if money worked for you instead of the other way around? I didn't have the vocabulary for it back then. But the obsession was already alive.",
      },
      {
        type: 'pullquote',
        text: "I wasn't trying to get rich. I was trying to understand something most people around me had never been taught — that money, if placed correctly, could compound into freedom.",
      },
      {
        type: 'paragraph',
        text: 'That question pulled me into books, communities, rabbit holes. While other kids were chasing other things, I was reading about assets, dividends, markets. And as I grew older, I tried to test what I was learning. I ran businesses. Small ones. Then bigger ones. Some worked. Many failed. But every attempt taught me something: how people make decisions, how value gets created, how systems behave under pressure. Entrepreneurship became my education — the real one.',
      },
      {
        type: 'heading',
        text: 'The Hedge Fund Dream — and Its Beautiful Collapse',
      },
      {
        type: 'paragraph',
        text: 'Then came what felt like the turning point. I attended an investment masterclass that cracked something open in me. The strategies, the frameworks, the structured thinking around capital allocation — it was everything I\'d been orbiting on my own, now crystallized. I met people who thought the same way. We talked about building something real. We talked about a hedge fund — the Roland Investment Fund.',
      },
      {
        type: 'paragraph',
        text: 'The ambition was genuine. The documentation was meticulous. I spent months studying and cataloguing investment strategies: growth portfolios, dividend portfolios, index strategies, risk-adjusted return frameworks for different time horizons. I was building the intellectual infrastructure for something I genuinely believed could work.',
      },
      {
        type: 'paragraph',
        text: "And then it didn't. The fund never launched. Capital, regulatory complexity, operational barriers — the classic wall that kills great ideas before they breathe. There's a specific grief that comes with a dream that dies in the planning stage. You can see clearly what it would have been. You just can't get there.",
      },
      {
        type: 'highlightbox',
        label: 'The Turning Point',
        text: "The hedge fund failed. But everything I'd built to run it — the research, the strategy frameworks, the investment thesis documentation — didn't disappear. It became the engine for something else entirely.",
      },
      {
        type: 'paragraph',
        text: "Here's what I realized sitting with that failure: the problem I was trying to solve for institutions was the exact same problem retail investors faced every day, just at a different scale. Millions of people open brokerage accounts and then… freeze. They don't know what to buy. They're paralyzed by complexity, afraid of getting it wrong, and slowly talked out of acting by the sheer volume of conflicting information online.",
      },
      {
        type: 'paragraph',
        text: "Portfolio construction paralysis. That's the real enemy of retail wealth-building. And I had spent months building a system to solve exactly that — I'd just aimed it at the wrong target.",
      },
      {
        type: 'heading',
        text: 'Building PortfoliX',
      },
      {
        type: 'paragraph',
        text: "PortfoliX was born from that redirect. The proprietary research I'd documented for the hedge fund — the investment strategy frameworks, the asset allocation logic, the risk-return thinking — became the foundation of something far more accessible. A platform that could take a user's goals, timeline, and risk tolerance, and return a personalized, intelligent portfolio recommendation in under three minutes.",
      },
      {
        type: 'paragraph',
        text: 'No finance degree. No advisor relationship. No minimum investment. Just clarity, fast. The mission felt obvious the moment it crystallized: make investing profitable, fast, and easy for people everywhere — especially in places like Nigeria, India, and Southeast Asia, where the gap between financial access and financial knowledge has historically been the widest.',
      },
      {
        type: 'stats',
        items: [
          { number: '500+', label: 'Portfolios Created' },
          { number: '75%', label: 'Onboarding Completion' },
          { number: '3 min', label: 'Time to Portfolio' },
        ],
      },
      {
        type: 'paragraph',
        text: "Early signals were encouraging. Users completed onboarding. They saved portfolios. They came back. Not because we had million-dollar marketing budgets — we had almost none — but because the product solved something real. People who had been sitting on the sidelines of investing for years were finally getting a clear starting point.",
      },
      {
        type: 'heading',
        text: 'The Two-Week Pivot That Changed Everything',
      },
      {
        type: 'paragraph',
        text: "Building a startup fast means you sometimes build in the wrong direction — and you have to be honest enough with yourself to stop and correct. Earlier this year, we hit that moment. PortfoliX had been registered as a B2B platform targeting financial advisors and institutions. But the product we'd actually built? Unmistakably B2C. The mismatch was invisible until we looked directly at it: documentation pointed one way, the codebase another, and users were falling somewhere in the middle — confused.",
      },
      {
        type: 'paragraph',
        text: 'With our Delaware C-Corp incorporation deadline forcing a product audit, we made the call in one conversation: commit fully to B2C. Then we executed that decision in fourteen days.',
      },
      {
        type: 'timeline',
        items: [
          {
            title: "Days 1–4 · Delete Everything That Shouldn't Exist",
            description: "Removed all B2B infrastructure — advisor portals, institutional dashboards, enterprise routes. Over 2,000 lines of code serving zero actual users, deleted without ceremony. Killed the broken dashboard showing users fictional portfolio values we didn't actually track. When a product lies — even accidentally — trust is the first casualty.",
          },
          {
            title: 'Days 5–8 · Fix the Things Quietly Destroying Trust',
            description: 'Found a critical pricing bug: the website said $15/month Pro, the checkout charged $25. A pricing lie — even accidental — is still a lie. Fixed it across every touchpoint in a day. Rebuilt onboarding to three clean, clear questions with no text truncation, no contrast failures, no confusion.',
          },
          {
            title: 'Days 9–11 · Go Global, For Real',
            description: 'Added Bamboo and Trove Finance for Nigerian investors. Added Tiger Brokers for Asian markets. Rewrote our headline to four words that actually mean something: "Build Portfolios in Minutes." Stopped being vague about what we do.',
          },
          {
            title: 'Days 12–14 · Build What You Can Measure',
            description: "Implemented full analytics tracking across nine conversion events — from first click to upgrade completed. For the first time, we could answer an investor's question about our funnel with data instead of a guess. Then polished the entire visual language: typography system, color hierarchy, motion design.",
          },
        ],
      },
      {
        type: 'paragraph',
        text: "Fourteen days. One clear decision. The product that came out the other side was leaner, more honest, more focused, and more ready for the world than anything we'd shipped before. Subtraction, it turns out, is a design tool — and often the most powerful one you have.",
      },
      {
        type: 'heading',
        text: 'Where We Are Now',
      },
      {
        type: 'paragraph',
        text: "PortfoliX is incorporated as a Delaware C-Corp. We have early users, real data, and a product that does exactly what it says on the tin. But we're also at the beginning — and we know it. We're currently applying to accelerators, building out the team, and having early conversations with angel investors who understand what it means to back a mission-driven product at the earliest stage.",
      },
      {
        type: 'paragraph',
        text: "We're not looking for people who just want to write a check into another fintech. We're looking for partners who believe — as we do — that access to great investment guidance should not be a function of how much money you already have or where you were born.",
      },
      {
        type: 'pullquote',
        text: "We're not building the next Robinhood. We're building the product that should have existed before Robinhood — one that tells you what to buy before you ever open a brokerage account.",
      },
      {
        type: 'paragraph',
        text: "The roadmap ahead is ambitious but grounded: referrals done right, portfolio comparison tools, rebalancing alerts, a real content engine, and eventually an advisor marketplace for investors who want a human in the loop. We're going to get there by doing fewer things better, not more things faster.",
      },
      {
        type: 'cta',
      },
    ],
  },
];
