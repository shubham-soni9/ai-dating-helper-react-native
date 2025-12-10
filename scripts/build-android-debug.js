const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const root = path.resolve(process.cwd());
const androidDir = path.join(root, 'android');
const outputDir = path.join(root, 'apk');
const apkSource = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const apkTarget = path.join(outputDir, 'app-debug.apk');

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clean android directory if it exists to ensure fresh build
if (fs.existsSync(androidDir)) {
  console.log('Cleaning existing android directory...');
  fs.rmSync(androidDir, { recursive: true, force: true });
}

// Run prebuild with --clean flag to generate fresh native code
console.log('Running expo prebuild...');
run('npx', ['expo', 'prebuild', '--platform', 'android', '--clean', '--no-install'], root);

// Create local.properties file with SDK and NDK paths
console.log('Creating local.properties...');
const localPropertiesPath = path.join(androidDir, 'local.properties');
const localPropertiesContent = `sdk.dir=/Users/shubhamsoni/Library/Android/sdk
ndk.dir=/Users/shubhamsoni/Library/Android/sdk/ndk/27.1.12297006/android-ndk-r27b
`;

fs.writeFileSync(localPropertiesPath, localPropertiesContent, 'utf8');
console.log('✅ local.properties created');

// Build the APK
console.log('Building APK...');
const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradleCmd, ['assembleDebug'], androidDir);

if (!fs.existsSync(apkSource)) {
  console.error('Debug APK not found at', apkSource);
  process.exit(1);
}

fs.copyFileSync(apkSource, apkTarget);
console.log('✅ APK copied to', apkTarget);
console.log('\nYou can install it using:');
console.log(`adb install ${apkTarget}`);
