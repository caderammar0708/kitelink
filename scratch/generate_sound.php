<?php

// Ensure output directory exists
$dir = __DIR__.'/../../public/sounds';
if (! is_dir($dir)) {
    mkdir($dir, 0755, true);
}

// Generate a 0.5s pleasant two-tone chime (F#5 to C#6 bell)
$sampleRate = 44100;
$duration = 0.45; // seconds
$numSamples = (int) ($sampleRate * $duration);

$data = '';

for ($i = 0; $i < $numSamples; $i++) {
    $t = $i / $sampleRate;

    // Envelope: quick exponential decay
    $envelope = exp(-$t * 9.0);

    // Fundamental: 880 Hz (A5) with slight overtone at 1760 Hz
    $freq1 = 880.0;
    $freq2 = 1320.0; // E6

    $wave = 0.65 * sin(2 * M_PI * $freq1 * $t) + 0.35 * sin(2 * M_PI * $freq2 * $t);
    $sample = (int) ($wave * $envelope * 28000);

    // Clamp to 16-bit signed integer
    $sample = max(-32767, min(32767, $sample));
    $data .= pack('v', $sample);
}

// WAV Header
$byteRate = $sampleRate * 2; // 1 channel, 16-bit (2 bytes)
$dataLen = strlen($data);
$fileSize = 36 + $dataLen;

$header = 'RIFF'.pack('V', $fileSize).'WAVE';
$header .= 'fmt '.pack('V', 16).pack('v', 1).pack('v', 1); // PCM, 1 channel
$header .= pack('V', $sampleRate).pack('V', $byteRate).pack('v', 2).pack('v', 16); // sample rate, byte rate, block align, bits/sample
$header .= 'data'.pack('V', $dataLen);

$wavContent = $header.$data;

// Save as both notification.mp3 and notification.wav for universal browser compatibility
file_put_contents($dir.'/notification.mp3', $wavContent);
file_put_contents($dir.'/notification.wav', $wavContent);

echo 'Sound files generated successfully: '.strlen($wavContent)." bytes\n";
