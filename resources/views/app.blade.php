<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Winduo') }}</title>

        <meta name="description" content="Winduo — Discover certified kitesurfing instructors &amp; premier kite centers worldwide. Direct bookings, live wind telemetry, and verified standards.">

        <!-- Favicons -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Winduo">
        <meta property="og:title" content="Winduo — Certified Kitesurf Instructors &amp; Premier Kite Centers">
        <meta property="og:description" content="Discover certified kitesurfing instructors &amp; premier kite centers worldwide. Direct bookings, live wind telemetry, and verified standards.">
        <meta property="og:image" content="{{ asset('og-image.png') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Winduo — Certified Kitesurf Instructors &amp; Premier Kite Centers">
        <meta name="twitter:description" content="Discover certified kitesurfing instructors &amp; premier kite centers worldwide. Direct bookings, live wind telemetry, and verified standards.">
        <meta name="twitter:image" content="{{ asset('og-image.png') }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-[#070b12] dark:text-white min-h-screen">
        @inertia
    </body>
</html>
