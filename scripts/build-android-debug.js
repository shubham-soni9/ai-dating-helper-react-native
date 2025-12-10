const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const root = path.resolve(process.cwd());
const androidDir = path.join(root, 'android');
const outputDir = path.join(root, 'apk');
const apkSource = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');

// Read app.json or app.config.js to get app name and version
function getAppConfig() {
  const appJsonPath = path.join(root, 'app.json');
  const appConfigPath = path.join(root, 'app.config.js');

  if (fs.existsSync(appJsonPath)) {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    return {
      name: appJson.expo?.name || appJson.name || 'app',
      version: appJson.expo?.version || '1.0.0',
    };
  } else if (fs.existsSync(appConfigPath)) {
    const appConfig = require(appConfigPath);
    const config = typeof appConfig === 'function' ? appConfig() : appConfig;
    return {
      name: config.expo?.name || config.name || 'app',
      version: config.expo?.version || '1.0.0',
    };
  }

  return { name: 'app', version: '1.0.0' };
}

const appConfig = getAppConfig();
const sanitizedAppName = appConfig.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
const apkFileName = `${sanitizedAppName}-${appConfig.version}-debug.apk`;
const apkTarget = path.join(outputDir, apkFileName);

let stepNumber = 0;
function logStep(message) {
  stepNumber++;
  console.log(`\n📍 Step ${stepNumber}: ${message}`);
  console.log('─'.repeat(60));
}

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

console.log('\n🚀 Building Android APK');
console.log('═'.repeat(60));
console.log(`📱 App Name: ${appConfig.name}`);
console.log(`📦 Version: ${appConfig.version}`);
console.log(`🏷️  Output: ${apkFileName}`);
console.log('═'.repeat(60));

logStep('Preparing output directory');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✓ Created apk/ directory');
} else {
  // Delete old APKs from output directory
  console.log('Cleaning old APKs from output directory...');
  const files = fs.readdirSync(outputDir);
  const apkFiles = files.filter((file) => file.endsWith('.apk'));
  if (apkFiles.length > 0) {
    apkFiles.forEach((file) => {
      fs.unlinkSync(path.join(outputDir, file));
      console.log(`  ✓ Deleted: ${file}`);
    });
  } else {
    console.log('  ✓ No old APKs found');
  }
}

logStep('Cleaning existing android directory');
if (fs.existsSync(androidDir)) {
  fs.rmSync(androidDir, { recursive: true, force: true });
  console.log('✓ Removed android/ directory');
} else {
  console.log('✓ No existing android/ directory found');
}

logStep('Running expo prebuild');
run('npx', ['expo', 'prebuild', '--platform', 'android', '--clean', '--no-install'], root);
console.log('✓ Prebuild completed');

logStep('Creating local.properties');
const localPropertiesPath = path.join(androidDir, 'local.properties');
const localPropertiesContent = `sdk.dir=/Users/shubhamsoni/Library/Android/sdk
ndk.dir=/Users/shubhamsoni/Library/Android/sdk/ndk/27.1.12297006/android-ndk-r27b
`;

fs.writeFileSync(localPropertiesPath, localPropertiesContent, 'utf8');
console.log('✓ local.properties created');

logStep('Building debug APK with Gradle');
const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradleCmd, ['assembleDebug'], androidDir);
console.log('✓ Gradle build completed');

console.log('✓ Gradle build completed');

logStep('Copying APK to output directory');
if (!fs.existsSync(apkSource)) {
  console.error('❌ Debug APK not found at', apkSource);
  process.exit(1);
}

fs.copyFileSync(apkSource, apkTarget);
console.log(`✓ APK copied successfully`);

console.log('\n' + '═'.repeat(60));
console.log('✅ BUILD SUCCESSFUL!');
console.log('═'.repeat(60));
console.log(`📦 APK Location: ${apkTarget}`);
console.log(`📱 APK Name: ${apkFileName}`);
console.log(`💾 APK Size: ${(fs.statSync(apkTarget).size / (1024 * 1024)).toFixed(2)} MB`);
console.log('\n📲 Install using:');
console.log(`   adb install "${apkTarget}"`);
console.log('═'.repeat(60) + '\n');
