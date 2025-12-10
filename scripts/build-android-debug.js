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

if (!fs.existsSync(androidDir)) {
  run(
    'npx',
    ['expo', 'prebuild', '--platform', 'android', '--no-install', '--non-interactive'],
    root
  );
}

const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradleCmd, ['assembleDebug'], androidDir);

if (!fs.existsSync(apkSource)) {
  console.error('Debug APK not found at', apkSource);
  process.exit(1);
}

fs.copyFileSync(apkSource, apkTarget);
console.log('APK copied to', apkTarget);
