import React from 'react';

const SemanticContent = ({ district, division, subdivision }) => {
    // Generate the H1 title based on depth
    const getH1Title = () => {
        if (subdivision) return `Live: ${subdivision.label} Power Status`;
        if (division) return `${division.label} Power Supply Status`;
        if (district) return `Power Cut Status in ${district.label}`;
        return 'Bijli Punjab - Live PSPCL Power Cut Tracker';
    };

    const h1Title = getH1Title();
    const districtName = district?.label || 'Punjab';

    return (
        <>
            {/* Hidden H1 for Structure - Placed at top of hierarchy visually via CSS order or absolute positioning if needed, 
                but here it just renders first in the DOM if placed at top of Home */}
            <h1 className="sr-only">
                {h1Title}
            </h1>

            {/* Semantic Footer with Related Searches */}
            <div className="sr-only">
                <h2>Related Searches for {districtName}</h2>
                <ul>
                    <li>PSPCL customer care number {districtName}</li>
                    <li>Power cut in {districtName} today</li>
                    <li>PSPCL bill check {districtName}</li>
                    <li>Bijli outage schedule {districtName}</li>
                    <li>PSPCL complaint number {districtName}</li>
                    {division && <li>{division.label} grid status</li>}
                    {subdivision && <li>JE contact {subdivision.label}</li>}
                </ul>
            </div>
        </>
    );
};

export default SemanticContent;
