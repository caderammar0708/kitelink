<?php

$dir = __DIR__.'/../public/sounds';
if (! is_dir($dir)) {
    mkdir($dir, 0777, true);
}

// Generate a simple valid RIFF/WAV file or MP3
// 44-byte WAV header + 0.3s of 880Hz sine chime
$sampleRate = 22050;
$duration = 0.35;
$numSamples = (int) ($sampleRate * $duration);
$freq = 880;

$data = '';
for ($i = 0; $i < $numSamples; $i++) {
    $t = $i / $sampleRate;
    $envelope = exp(-$t * 8); // Decay
    $sample = sin(2 * M_PI * $freq * $t) * $envelope * 0.4;
    $val = (int) ($sample * 32767);
    $data .= pack('v', $val);
}

$header = 'RIFF'.pack('V', 36 + strlen($data)).'WAVEfmt '.pack('V', 16)
    .pack('v', 1).pack('v', 1).pack('V', $sampleRate).pack('V', $sampleRate * 2)
    .pack('v', 2).pack('v', 16).'data'.pack('V', strlen($data));

file_put_contents($dir.'/notification.mp3', $header.$data);
echo 'SOUND CREATED AT '.$dir.'/notification.mp3'."\n";
