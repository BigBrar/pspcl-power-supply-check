import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ district, division, subdivision }) => {
    const baseUrl = 'https://bijlipunjab.in';
    const currentPath = window.location.pathname;
    const currentUrl = `${baseUrl}${currentPath}`;

    // Helper to format district name (e.g., "Amritsar")
    const dName = district?.label || 'Punjab';

    // Helper to generate dynamic keywords for Schema
    const getKeywords = () => {
        const base = ['PSPCL power cut status', 'electricity outage tracker', 'bijli board updates'];
        if (district) {
            base.push(`Power cut in ${dName}`, `PSPCL ${dName} helpline`, `electricity shutdown ${dName}`);
        }
        if (division) {
            base.push(`${division.label} power supply`, `PSPCL grid status ${division.label}`);
        }
        if (subdivision) {
            base.push(`${subdivision.label} electricity board`, `JE contact ${subdivision.label}`);
        }
        return base.join(', ');
    };

    // --- Dynamic Content Logic (Matches FAQSection.jsx) ---
    const outageReasonAnswer = `Power cuts in ${dName} are usually caused by scheduled grid maintenance, technical faults, or local load shedding. You can check the specific reason and estimated restoration time for your area using our live tracker above.`;

    const helplineAnswer = subdivision
        ? `For immediate complaints in ${subdivision.label}, call 1912. You can also contact the Junior Engineer (JE) for ${subdivision.label} directly if their number is listed on your bill.`
        : `For electricity complaints in ${dName}, dial the 24x7 PSPCL helpline at 1912.`;

    // Static FAQ objects
    const faqData = [
        {
            question: "How can I check the live power cut status in my area?",
            answer: "You can check the live PSPCL power cut status by selecting your District, Division, and Subdivision on Bijli Punjab. Our real-time tracker provides the latest updates on scheduled maintenance and unscheduled outages across Punjab."
        },
        {
            question: "What is the PSPCL customer care number for power complaints?",
            answer: helplineAnswer
        },
        {
            question: `Why is there a power cut in ${dName} today?`,
            answer: outageReasonAnswer
        }
    ];

    // LOGIC: Metadata Generation based on Route Depth
    let title = 'Bijli Punjab - Live PSPCL Power Cut Tracker';
    let description = 'Live PSPCL Outage Tracker. Check live electricity status, active outages, and restoration times across Punjab.';

    // 1. Subdivision Level (Deepest)
    if (subdivision) {
        // Title follows District-first pattern as requested
        title = `Live: ${dName} Power Status`;
        // Description keeps all 3 levels
        description = `Live grid status for ${subdivision.label} in ${division.label}, ${dName}. Check power supply, active outages, and JE contact details for ${subdivision.label}.`;
    }
    // 2. Division Level
    else if (division) {
        title = `Live: ${dName} Power Status`;
        description = `Live status for ${division.label} in ${dName}. View active outages, feeder health, and estimated restoration times for ${division.label}.`;
    }
    // 3. District Level
    else if (district) {
        title = `Power Cut Status in ${dName}`;
        description = `Live PSPCL updates for ${dName}. Check if your division has power cuts and see live grid analytics for ${dName} district.`;
    }

    // Append Brand Name
    title = `${title} | Bijli Punjab`;

    // Dynamic Alt Text for Logo (used by parent if passed, but defined here for consistency)
    const logoAlt = district ? `PSPCL Power Cut Status in ${dName}` : 'Punjab Power Supply Logo';
    const logoImage = `${baseUrl}/logo.png`; // Using stable public path for OG tags
    const favIcon = `${baseUrl}/favicon.ico`;

    // JSON-LD Schema (Breadcrumb + Service)
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    district && {
                        "@type": "ListItem",
                        "position": 2,
                        "name": dName,
                        "item": `${baseUrl}/${district.label.toLowerCase().replace(/\s+/g, '-')}`
                    },
                    division && {
                        "@type": "ListItem",
                        "position": 3,
                        "name": division.label,
                        "item": `${baseUrl}/${district.label.toLowerCase().replace(/\s+/g, '-')}/${division.label.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')}`
                    }
                ].filter(Boolean)
            },
            {
                "@type": "Service",
                "name": title,
                "serviceType": "Public Utility Information",
                "provider": {
                    "@type": "Organization",
                    "name": "Bijli Punjab"
                },
                "areaServed": {
                    "@type": "administrativeArea",
                    "name": dName
                },
                "description": description,
                "keywords": getKeywords()
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqData.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            }
        ]
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={logoImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={logoImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEOHead;
