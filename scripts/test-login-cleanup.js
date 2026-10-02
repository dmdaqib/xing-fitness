import fs from 'fs';

console.log('====================================================');
console.log('   XING FITNESS — MEMBER LOGIN PRODUCTION AUDIT     ');
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

const loginCode = fs.readFileSync('src/pages/auth/LoginPage.tsx', 'utf-8');

console.log('\n[1/3] Verifying Removal of Development Demo UI:');
check('No "Fast Demo Switcher"', !loginCode.includes('Fast Demo Switcher'));
check('No "Instant Verification"', !loginCode.includes('Instant Verification'));
check('No demo name "Arjun Verma"', !loginCode.includes('Arjun Verma'));
check('No demo name "Arjun"', !loginCode.includes('Arjun'));
check('No demo credentials "Member@12345"', !loginCode.includes('Member@12345'));
check('No demo credentials "Staff@12345"', !loginCode.includes('Staff@12345'));
check('No demo credentials "Admin@12345"', !loginCode.includes('Admin@12345'));
check('No handleDemoFill function', !loginCode.includes('handleDemoFill'));
check('No demo role buttons', !loginCode.includes('handleDemoFill('));

console.log('\n[2/3] Verifying Clean Production Sign In Form:');
check('Portal Sign In heading', loginCode.includes('Portal Sign In'));
check('Email Address input field present', loginCode.includes('Email Address'));
check('Password input field present', loginCode.includes('Password'));
check('Forgot password? link present', loginCode.includes('Forgot password?'));
check('Sign In submit button present', loginCode.includes('<span>Sign In</span>'));
check('Create Member Account link present', loginCode.includes('Create Member Account'));
check('Real backend login authentication called', loginCode.includes('await login({ email, password })'));
check('Clean redirect based on authenticated user role', loginCode.includes('authUser.role === \'ADMIN\' || authUser.role === \'STAFF\''));

console.log('\n[3/3] Verifying Navbar & Public Website Separation:');
const navCode = fs.readFileSync('src/components/common/Navbar.tsx', 'utf-8');
check('Navbar primary CTA is "Book A Free Trial"', navCode.includes('id="nav-book-trial-btn"') && navCode.includes('Book A Free Trial'));
check('Portal is not prominent in primary links', navCode.includes("link.label === 'Home'") || !navCode.includes("label: 'Portal'"));
check('Subtle secondary "Member Login" link', navCode.includes('Member Login'));

console.log('\n====================================================');
console.log(`LOGIN PRODUCTION AUDIT: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) process.exit(1);
