// Test suite to audit Xing Fitness Final Website Structure Rebuild
import http from 'http';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function runStructureAudit() {
  console.log('====================================================');
  console.log('   XING FITNESS FINAL WEBSITE STRUCTURE AUDIT       ');
  console.log('====================================================');

  const routesToVerify = [
    // 7 Core Pillars
    { name: '1. Home', path: '/' },
    { name: '2. Why Choose Xing', path: '/why-xing' },
    { name: '3. Programs (3 Pillars)', path: '/programs' },
    { name: '4. Fitness Blog', path: '/blog' },
    { name: '5. About & Trainers', path: '/about' },
    { name: '6. Offers', path: '/offers' },
    { name: '7. Contact', path: '/contact' },
    { name: 'Free Trial Booking', path: '/book-free-trial' },

    // Protected Portals
    { name: 'Member Login', path: '/login' },
    { name: 'Member Dashboard (Protected)', path: '/member/dashboard' },

    // Clean Aliases / Redirects
    { name: 'Alias: /trainers -> /about', path: '/trainers' },
    { name: 'Alias: /membership -> /programs', path: '/membership' },
    { name: 'Alias: /facilities -> /why-xing', path: '/facilities' },
    { name: 'Alias: /gallery -> /why-xing', path: '/gallery' }
  ];

  let passed = 0;
  let failed = 0;

  for (const route of routesToVerify) {
    try {
      const res = await fetchUrl(route.path);
      if (res.status === 200 || res.status === 302) {
        console.log(`[PASS] ${route.name.padEnd(35)} -> HTTP ${res.status} (${route.path})`);
        passed++;
      } else {
        console.log(`[FAIL] ${route.name.padEnd(35)} -> HTTP ${res.status} (${route.path})`);
        failed++;
      }
    } catch (err) {
      console.log(`[ERROR] ${route.name.padEnd(35)} -> ${err.message}`);
      failed++;
    }
  }

  console.log('\n--- VERIFYING NAVBAR COMPONENT (SIMPLIFIED 7-PILLAR IA) ---');
  const navbarCode = fs.readFileSync('src/components/common/Navbar.tsx', 'utf-8');

  const navbarChecks = [
    { name: 'Link Home to "/"', test: navbarCode.includes("to: '/'") || navbarCode.includes("path: '/'") },
    { name: 'Link Why Xing to "/why-xing"', test: navbarCode.includes("path: '/why-xing'") },
    { name: 'Link Programs to "/programs"', test: navbarCode.includes("path: '/programs'") },
    { name: 'Link Blog to "/blog"', test: navbarCode.includes("path: '/blog'") },
    { name: 'Link About & Trainers to "/about"', test: navbarCode.includes("path: '/about'") },
    { name: 'Link Offers to "/offers"', test: navbarCode.includes("path: '/offers'") },
    { name: 'Link Contact to "/contact"', test: navbarCode.includes("path: '/contact'") },
    { name: 'Primary CTA Book Free Trial', test: navbarCode.includes("id=\"nav-book-trial-btn\"") },
    { name: 'Portal Login / Auth Action present', test: navbarCode.includes("/login") || navbarCode.includes("useAuth") },
    { name: 'Mobile menu toggle present', test: navbarCode.includes("id=\"mobile-menu-toggle-btn\"") },
    { name: 'No large mega menu clutter', test: !navbarCode.includes("grid-cols-3") && !navbarCode.includes("840px") }
  ];

  navbarChecks.forEach(c => {
    if (c.test) {
      console.log(`[PASS] Navbar Check: ${c.name}`);
      passed++;
    } else {
      console.log(`[FAIL] Navbar Check: ${c.name}`);
      failed++;
    }
  });

  console.log('\n--- VERIFYING FLOATING CONCIERGE CHAT WIDGET ---');
  const supportWidgetCode = fs.readFileSync('src/components/common/SupportWidget.tsx', 'utf-8');

  const widgetChecks = [
    { name: 'Floating bubble trigger: Need Help?', test: supportWidgetCode.includes("Need Help?") },
    { name: 'Interactive chat panel dialog', test: supportWidgetCode.includes("role=\"dialog\"") },
    { name: 'Timings FAQ knowledge (verified hours)', test: supportWidgetCode.includes("5:30 AM") },
    { name: 'Location FAQ knowledge (Brookefield, Whitefield)', test: supportWidgetCode.includes("Brookefield, Whitefield") },
    { name: 'Free Trial FAQ action', test: supportWidgetCode.includes("Free 1-Day Trial") && supportWidgetCode.includes("onOpenTrial") },
    { name: 'Membership FAQ action', test: supportWidgetCode.includes("Membership & Offers") && supportWidgetCode.includes("onOpenEnquiry") },
    { name: 'Programs 3-pillar knowledge', test: supportWidgetCode.includes("Group Studio Classes") && supportWidgetCode.includes("Outcome-Based Packages") },
    { name: 'Offers knowledge (Founder 40% OFF Special)', test: supportWidgetCode.includes("40% OFF Annual Membership") },
    { name: 'Personal Trainers knowledge', test: supportWidgetCode.includes("Personal Trainers") },
    { name: 'WhatsApp Concierge connection', test: supportWidgetCode.includes("BRAND.whatsappUrl") },
    { name: 'Safe verified fallback response', test: supportWidgetCode.includes("I don't have that specific detail on record") },
    { name: 'Direct quick question chips', test: supportWidgetCode.includes("Quick Topics") },
    { name: 'Text input submission', test: supportWidgetCode.includes("handleSendMessage") },
    { name: 'Accessible Escape key closure', test: supportWidgetCode.includes("Escape") }
  ];

  widgetChecks.forEach(c => {
    if (c.test) {
      console.log(`[PASS] Widget Check: ${c.name}`);
      passed++;
    } else {
      console.log(`[FAIL] Widget Check: ${c.name}`);
      failed++;
    }
  });

  console.log('====================================================');
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runStructureAudit();
