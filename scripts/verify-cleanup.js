import fs from 'fs';

console.log('====================================================');
console.log('   XING FITNESS — 7-PILLAR IA REBUILD AUDIT         ');
console.log('====================================================');

let passed = 0;
let failed = 0;

function check(title, condition) {
  if (condition) {
    console.log(`  ✓ PASS: ${title}`);
    passed++;
  } else {
    console.log(`  ✗ FAIL: ${title}`);
    failed++;
  }
}

// 1. Audit HomePage.tsx
const homeCode = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');
console.log('\n[1/7] Auditing Homepage Structure:');
check('1. Hero section present with trial CTA', homeCode.includes('<Hero'));
check('2. BrandIntro short introduction present', homeCode.includes('<BrandIntro'));
check('3. WhyChoosePreview present', homeCode.includes('<WhyChoosePreview'));
check('4. ProgramsPreview (3 categories) present', homeCode.includes('<ProgramsPreview'));
check('5. OffersPreview present', homeCode.includes('<OffersPreview'));
check('6. BlogPreview present', homeCode.includes('<BlogPreview'));
check('7. FinalCTASection present', homeCode.includes('<FinalCTASection'));
check('No calculators on homepage', !homeCode.includes('Calculator'));
check('No transformations on homepage', !homeCode.includes('Transformation'));
check('No class timetable on homepage', !homeCode.includes('ClassSchedule'));

// 2. Audit WhyChoosePage.tsx
const whyCode = fs.readFileSync('src/pages/WhyChoosePage.tsx', 'utf-8');
console.log('\n[2/7] Auditing Why Choose Xing Page:');
check('Training environment pillar present', whyCode.includes('training-environment'));
check('Equipment & facilities pillar present', whyCode.includes('equipment-facilities'));
check('Coaching support pillar present', whyCode.includes('coaching-support'));
check('Structured programs pillar present', whyCode.includes('structured-programs'));
check('Hygiene standards pillar present', whyCode.includes('hygiene-standards'));
check('Location convenience pillar present', whyCode.includes('location-convenience'));
check('Member-focused culture present', whyCode.includes('member-experience'));
check('Real Xing Fitness photos used', whyCode.includes('/images/real/'));
check('Free trial CTA present', whyCode.includes('onOpenTrialModal'));

// 3. Audit ProgramsPage.tsx (3 Distinct Pillars)
const progCode = fs.readFileSync('src/pages/ProgramsPage.tsx', 'utf-8');
console.log('\n[3/7] Auditing Programs Page (3 Distinct Categories):');
check('Clear distinction banner: Classes ≠ Memberships ≠ Outcomes', progCode.includes('GROUP CLASSES') || progCode.includes('Three Distinct Ways'));
check('Category A: Group Studio Classes present', progCode.includes('GROUP STUDIO CLASSES'));
check('Category B: Facility Memberships present', progCode.includes('FACILITY MEMBERSHIPS'));
check('Category C: Outcome-Based Packages present', progCode.includes('OUTCOME-BASED PACKAGES'));
check('No invented membership prices (enquiry/contact flow)', progCode.includes('onOpenEnquiryModal'));

// 4. Audit BlogPage.tsx
const blogCode = fs.readFileSync('src/pages/BlogPage.tsx', 'utf-8');
console.log('\n[4/7] Auditing Fitness Blog:');
check('Categories include Strength Training, Nutrition, Recovery, etc.', blogCode.includes('Strength Training') && blogCode.includes('Nutrition'));
check('Search query filtering implemented', blogCode.includes('searchQuery'));
check('Category filtering implemented', blogCode.includes('selectedCategory'));
check('Featured article highlight present', blogCode.includes('featuredPost'));
check('Individual article reader view present', blogCode.includes('selectedPost'));

// 5. Audit AboutPage.tsx (About Us + Trainers Combined)
const aboutCode = fs.readFileSync('src/pages/AboutPage.tsx', 'utf-8');
console.log('\n[5/7] Auditing About Us + Trainers (Combined Area):');
check('Xing Fitness story present', aboutCode.includes('The Xing Story'));
check('Gym philosophy present', aboutCode.includes('Core Gym Philosophy'));
check('Facilities showcase with real photos present', aboutCode.includes('/images/real/'));
check('Location information present', aboutCode.includes('VISIT US IN BROOKEFIELD'));
check('Coaches section combined', aboutCode.includes('OUR COACHING ROSTER'));
check('Trainer placeholders used honestly without fake claims', aboutCode.includes('TRAINERS.map'));

// 6. Audit OffersPage.tsx
const offersCode = fs.readFileSync('src/pages/OffersPage.tsx', 'utf-8');
console.log('\n[6/7] Auditing Dedicated Offers Page:');
check('Fetches dynamic offers from /api/public/offers', offersCode.includes('/api/public/offers'));
check('Founder 40% OFF Special presented', offersCode.includes('40% OFF'));
check('Eligibility criteria specified', offersCode.includes('eligibility'));
check('Connected to enquiry & trial CTAs', offersCode.includes('onOpenEnquiryModal') && offersCode.includes('onOpenTrialModal'));

// 7. Audit Navbar & Routing
const navCode = fs.readFileSync('src/components/common/Navbar.tsx', 'utf-8');
const appCode = fs.readFileSync('src/App.tsx', 'utf-8');
console.log('\n[7/7] Auditing Simplified Navigation & App Routing:');
check('Primary link: Home ("/")', navCode.includes("path: '/'"));
check('Primary link: Why Xing ("/why-xing")', navCode.includes("path: '/why-xing'"));
check('Primary link: Programs ("/programs")', navCode.includes("path: '/programs'"));
check('Primary link: Blog ("/blog")', navCode.includes("path: '/blog'"));
check('Primary link: About & Trainers ("/about")', navCode.includes("path: '/about'"));
check('Primary link: Offers ("/offers")', navCode.includes("path: '/offers'"));
check('Primary link: Contact ("/contact")', navCode.includes("path: '/contact'"));
check('Prominent Book A Free Trial button in navbar', navCode.includes('id="nav-book-trial-btn"'));
check('Route /why-xing mapped to WhyChoosePage', appCode.includes('path="/why-xing"') && appCode.includes('<WhyChoosePage'));
check('Route /offers mapped to OffersPage', appCode.includes('path="/offers"') && appCode.includes('<OffersPage'));

console.log('\n====================================================');
console.log(`TOTAL AUDIT: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) process.exit(1);
