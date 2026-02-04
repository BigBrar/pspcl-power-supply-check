import React from 'react'
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import District from '../components/District';
import Division from '../components/Division';
import SubDivision from '../components/SubDivision';
import Typewriter from '../components/Typewriter';
import PowerStats from '../components/PowerStats';
import SEOHead from '../components/SEOHead';
import SemanticContent from '../components/SemanticContent';
import FAQSection from '../components/FAQSection';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#FEF9C3',          // light yellow background
        borderColor: state.isFocused ? '#FBBF24' : '#FCD34D', // darker yellow on focus
        boxShadow: state.isFocused ? '0 0 0 2px #FBBF24' : null,
        '&:hover': {
            borderColor: '#FBBF24',
        },
        borderRadius: '1rem',                // rounded corners
        padding: '2px 4px',
        minHeight: '48px',
        fontSize: '1rem',
        color: '#000'
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#FBBF24'
            : state.isFocused
                ? '#FEF3C7'
                : '#fff',
        color: '#000',
        padding: '10px 12px',
        cursor: 'pointer',
        borderRadius: '0' // Remove radius on individual options
    }),


    singleValue: (provided) => ({
        ...provided,
        color: '#000'
    }),

    menu: (provided) => ({
        ...provided,
        borderRadius: '1rem',
        overflow: 'hidden',     // This forces child options to respect rounding
        marginTop: '4px'
    }),

    placeholder: (provided) => ({
        ...provided,
        color: '#a3a3a3'
    }),

    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? '#FBBF24' : '#a3a3a3'
        // borderRadius: '50%'
    }),

    indicatorSeparator: () => ({
        display: 'none'
    }),

    menuList: (provided) => ({
        ...provided,
        padding: 0
    }),


    clearIndicator: (provided) => ({
        ...provided,
        color: '#a3a3a3',
        '&:hover': {
            color: '#FBBF24'
        }
    })
};

const Home = () => {
    // React Router hooks
    const { route_district, route_division, route_subdivision } = useParams();
    const navigate = useNavigate();

    const [districts, setDistricts] = useState([])
    const [divisions, setDivisions] = useState([])
    const [subdivisions, setSubDivisions] = useState([])
    const [supplyStatus, setSupplyStatus] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // useStates to control selected options
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedSubDivision, setSelectedSubDivision] = useState(null);

    // useStates to control the placeholder text for select tags
    const [districtPlaceholder, setDistrictPlaceholder] = useState('Loading districts...');
    const [divisionPlaceholder, setDivisionPlaceholder] = useState('Select district first');
    const [subDivisionPlaceholder, setSubDivisionPlaceholder] = useState('Select division first');

    // useRef to prevent duplicate supply fetches
    const lastFetchedSupplyId = useRef(null);

    // useEffect(() => {
    // setDivisions([]);
    // setSubDivisions([]);
    // setSupplyStatus(null);
    // }, [districts]);

    // useEffect(() => {
    // setSubDivisions([]);
    // setSupplyStatus(null);
    // }, [divisions]);

    useEffect(() => {
        if (localStorage.getItem('selectedDistrict')) {

            setDistricts(JSON.parse(localStorage.getItem('districts')) || []);
            // console.log(localStorage.getItem('districts'));

            setDivisions(JSON.parse(localStorage.getItem('divisions')) || []);
            setSubDivisions(JSON.parse(localStorage.getItem('subdivisions')) || []);

        }
    }, [])

    // Route-to-State Synchronization (District Level)
    useEffect(() => {
        if (districts.length === 0) return;

        console.log('Route sync useEffect triggered');
        console.log('Route params:', { route_district, route_division, route_subdivision });
        console.log('Districts:', districts);

        // CASE 1: Route exists - Route takes priority
        if (route_district) {
            const districtObj = districts.find(d => toSlug(d.name) === route_district);

            if (districtObj) {
                console.log('Matched district from route:', districtObj.name);
                setSelectedDistrict({ value: districtObj.id, label: districtObj.name });

                // Check if cache has divisions for this district
                const cacheDistrictId = Number(localStorage.getItem('selectedDistrict'));
                const cachedDivisions = JSON.parse(localStorage.getItem('divisions')) || [];

                // VALIDATE CACHE: If route wants a specific division, cache MUST have it
                let isCacheValid = cacheDistrictId === districtObj.id && cachedDivisions.length > 0;

                if (isCacheValid && route_division) {
                    const cachedMatch = cachedDivisions.find(d => toSlug(d.label) === route_division);
                    if (!cachedMatch) {
                        console.log('Cache mismatch: Route division not found in stored divisions. Fetching fresh.');
                        isCacheValid = false;
                    }
                }

                if (isCacheValid) {
                    // Use cached divisions instead of fetching
                    console.log('Using cached divisions for this district');
                    setDivisions(cachedDivisions);
                } else {
                    // Fetch divisions for this district
                    console.log('Fetching divisions for', districtObj.name);
                    getData('div', districtObj.id);
                }
            } else {
                // Invalid district in route - redirect to home
                console.log('Invalid district in route, redirecting to /');
                navigate('/');
            }
        }
        // CASE 2: No route but cache exists - Build URL from cache and navigate
        else if (localStorage.getItem('selectedDistrict')) {
            const cacheDistrict = Number(localStorage.getItem('selectedDistrict'));
            const cacheDivision = Number(localStorage.getItem('selectedDivision'));
            const cacheSubdivision = Number(localStorage.getItem('selectedSubDivision'));

            const districtObj = districts.find(d => d.id === cacheDistrict);

            if (districtObj) {
                console.log('Building URL from cache for:', districtObj.name);

                // Get cached lists to build URL (but don't set state yet)
                const cachedDivisions = JSON.parse(localStorage.getItem('divisions')) || [];
                const cachedSubdivisions = JSON.parse(localStorage.getItem('subdivisions')) || [];

                const divisionObj = cachedDivisions.find(d => d.value === cacheDivision);
                const subdivisionObj = cachedSubdivisions.find(d => d.value === cacheSubdivision);

                // Build URL path from cache
                let urlPath = `/${toSlug(districtObj.name)}`;
                if (divisionObj) {
                    urlPath += `/${toSlug(divisionObj.label)}`;
                }
                if (subdivisionObj) {
                    urlPath += `/${toSlug(subdivisionObj.label)}`;
                }

                console.log('Navigating to cached path:', urlPath);
                // Navigate and let the route-based logic handle the rest
                navigate(urlPath, { replace: true });
            }
        }
    }, [districts, route_district]);


    // Route-to-State Synchronization (Division Level)
    useEffect(() => {
        // Only proceed if we have a route_division to match
        if (!route_division || divisions.length === 0) return;

        console.log('Division route sync triggered');
        console.log('Matching route_division:', route_division);
        console.log('Available divisions:', divisions);

        const divisionObj = divisions.find(d => toSlug(d.label) === route_division);

        if (divisionObj) {
            console.log('Matched division from route:', divisionObj.label);
            setSelectedDivision(divisionObj);

            // Check if cache has subdivisions for this division
            const cacheDivisionId = Number(localStorage.getItem('selectedDivision'));
            const cachedSubdivisions = JSON.parse(localStorage.getItem('subdivisions')) || [];

            // VALIDATE CACHE: If route wants a specific subdivision, cache MUST have it
            let isCacheValid = cacheDivisionId === divisionObj.value && cachedSubdivisions.length > 0;

            if (isCacheValid && route_subdivision) {
                const cachedMatch = cachedSubdivisions.find(d => toSlug(d.label) === route_subdivision);
                if (!cachedMatch) {
                    console.log('Cache mismatch: Route subdivision not found in stored subdivisions. Fetching fresh.');
                    isCacheValid = false;
                }
            }

            if (isCacheValid) {
                // Use cached subdivisions instead of fetching
                console.log('Using cached subdivisions for this division');
                setSubDivisions(cachedSubdivisions);
            } else {
                // Fetch subdivisions for this division
                console.log('Fetching subdivisions for', divisionObj.label);
                getData('subdiv', divisionObj.value);
            }
        } else {
            // Invalid division in route - redirect to district only
            console.log('Invalid division in route, redirecting to district');
            if (selectedDistrict) {
                navigate(`/${toSlug(selectedDistrict.label)}`);
            }
        }
    }, [divisions, route_division]);

    // Route-to-State Synchronization (Subdivision Level)
    useEffect(() => {
        // Only proceed if we have a route_subdivision to match
        if (!route_subdivision || subdivisions.length === 0) return;

        console.log('Subdivision route sync triggered');
        console.log('Matching route_subdivision:', route_subdivision);
        console.log('Available subdivisions:', subdivisions);

        const subdivisionObj = subdivisions.find(d => toSlug(d.label) === route_subdivision);

        if (subdivisionObj) {
            console.log('Matched subdivision from route:', subdivisionObj.label);
            setSelectedSubDivision(subdivisionObj);

            // Only fetch if we haven't already fetched for this subdivision
            if (lastFetchedSupplyId.current !== subdivisionObj.value) {
                console.log('Fetching supply status for', subdivisionObj.label);
                lastFetchedSupplyId.current = subdivisionObj.value;
                getData('supply', subdivisionObj.value);
            } else {
                console.log('Supply already fetched for', subdivisionObj.label);
            }
        } else {
            // Invalid subdivision in route - redirect to district/division
            console.log('Invalid subdivision in route, redirecting to district/division');
            if (selectedDistrict && selectedDivision) {
                navigate(`/${toSlug(selectedDistrict.label)}/${toSlug(selectedDivision.label)}`);
            }
        }
    }, [subdivisions, route_subdivision]);

    // Auto-fetch supply status when subdivision is selected (for cache restoration scenario)
    useEffect(() => {
        // Skip if we're in a route-driven flow (route_subdivision exists means the above useEffect handles it)
        if (route_subdivision) return;

        if (selectedSubDivision && selectedSubDivision.value) {
            console.log('Fetching supply status for selected subdivision...');
            getData('supply', selectedSubDivision.value);
        }
    }, [selectedSubDivision]);


    // function to handle route naming, converting everything to '-'
    const toSlug = (text) => {
        return text
            ?.toString()
            .toLowerCase()
            .replace(/\//g, '-')       // 1. Specifically turn / into -
            .replace(/[^a-z0-9 -]/g, '') // 2. Remove dots, commas, etc (like S/D. becomes sd)
            .trim()
            .replace(/\s+/g, '-')      // 3. Turn spaces into -
            .replace(/-+/g, '-');      // 4. Remove double dashes (-- becomes -)
    };


    const getData = (mode, Id) => {
        console.log('sending /divisions request');
        let url;
        if (mode == 'div') {
            url = 'https://backend-pspcl-power-supply-check.onrender.com/divisions'
            setSubDivisions([])
            setSelectedSubDivision(null)
            setSelectedDivision(null)
            setDivisions([])
            setSupplyStatus(null)
            setDivisionPlaceholder('Loading...')
            console.log('saving to localstorage the id of the district:');

            localStorage.setItem('selectedDistrict', Id)
            localStorage.setItem('districts', JSON.stringify(districts))
        } else if (mode == 'subdiv') {
            url = 'https://backend-pspcl-power-supply-check.onrender.com/subdivisions'
            setSubDivisions([])
            setSelectedSubDivision(null)
            setSubDivisionPlaceholder('Loading...')
            localStorage.setItem('selectedDivision', Id)
            localStorage.setItem('divisions', JSON.stringify(divisions))
        } else if (mode == 'supply') {
            setIsLoading(true)
            localStorage.setItem('selectedSubDivision', Id)
            localStorage.setItem('subdivisions', JSON.stringify(subdivisions))
            url = 'https://backend-pspcl-power-supply-check.onrender.com/check_supply'
        }

        // setSelectedDivision(divisions[districtId])
        axios.get(url, {
            params: {
                id: Id
            }
        }).then(response => {
            console.log(response.data);
            if (mode == 'div') {
                setDivisionPlaceholder('Select your division')
                setDivisions(
                    response.data.map(d => ({
                        value: d.id,
                        label: d.name
                    }))
                )
                console.log('divisions:', response.data);

            }
            else if (mode == 'subdiv') {
                setSubDivisionPlaceholder('Select your subdivision')
                setSubDivisions(
                    response.data.map(d => ({
                        value: d.id,
                        label: d.name
                    }))
                )
            }
            else if (mode == 'supply') {
                setIsLoading(false)
                const data = JSON.parse(response.data);

                if (data["0"]?.status === "ok") {
                    setSupplyStatus({ type: "ok", reason: data["0"].reason });
                    localStorage.setItem('supplyStatus', JSON.stringify({ type: "ok", reason: data["0"].reason }));
                }
                else {
                    const entries = Object.values(data);
                    setSupplyStatus({ type: "cuts", entries });
                    localStorage.setItem('supplyStatus', JSON.stringify({ type: "cuts", entries }));
                }
            }
            // console.log('type of data received:', response.data['response']);

        })
            .catch(error => {
                console.error('Error fetching districts:', error);

            })
    }
    return (
        <div className='mt-8 text-center'>
            {/* SEO and Semantic Components */}
            <SEOHead
                district={selectedDistrict}
                division={selectedDivision}
                subdivision={selectedSubDivision}
            />
            <SemanticContent
                district={selectedDistrict}
                division={selectedDivision}
                subdivision={selectedSubDivision}
            />

            <div className='text-lg font-medium text-amber-400 opacity-90 tracking-wide h-8 flex justify-center items-center'>
                <Typewriter
                    phrases={[
                        "Check if your division has a power cut",
                        "Check when the power will be restored",
                        "Check if your feeder is affected",
                        "Check PSPCL supply live"
                    ]}
                />
            </div>


            <div>


                {/* SELECTING DISTRICT */}
                <District setSelectedDistrict={setSelectedDistrict} selectedDistrict={selectedDistrict} customStyles={customStyles} setDistricts={setDistricts} districts={districts} getData={getData} navigate={navigate} toSlug={toSlug} districtPlaceholder={districtPlaceholder} setDistrictPlaceholder={setDistrictPlaceholder} />


                {/* SELECTING DIVISION */}
                <Division divisionPlaceholder={divisionPlaceholder} selectedDivision={selectedDivision} setSelectedDivision={setSelectedDivision} customStyles={customStyles} getData={getData} divisions={divisions} navigate={navigate} toSlug={toSlug} selectedDistrict={selectedDistrict} />



                {/* SELECTING SUBDIVISION */}
                <SubDivision subDivisionPlaceholder={subDivisionPlaceholder} selectedSubDivision={selectedSubDivision} setSubDivision={setSelectedSubDivision} customStyles={customStyles} subdivisions={subdivisions} getData={getData} navigate={navigate} toSlug={toSlug} selectedDistrict={selectedDistrict} selectedDivision={selectedDivision} />


                {/* SUPPLY STATUS */}


                <h2 className='gap-4 text-2xl m-3 font-bold text-center'>Supply status</h2>

                {/* LOADING STATE */}
                {isLoading && (
                    <p className='text-center animate-pulse font-bold text-amber-300 py-4'>
                        ⚡ Checking live grid status...
                    </p>
                )}



                {/* OK STATUS */}
                {!isLoading && supplyStatus?.type === 'ok' && (
                    <p className='text-center'>✅ Electricity supply is working fine: {supplyStatus.reason}</p>
                )}

                {/* POWER CUTS LIST */}
                {!isLoading && supplyStatus?.type === 'cuts' && (
                    <div className='flex flex-col items-center'>
                        <p className='mb-2 text-center'>🚨 Power cuts reported in the following areas:</p>
                        {supplyStatus.entries.map((entry, idx) => (
                            <div key={idx} className='border p-4 w-full rounded-2xl bg-yellow-100 text-black mb-4 shadow-sm'>
                                <p className='text-lg font-black border-b border-yellow-300 pb-1 mb-2 uppercase'>⚡ {entry.feeder}</p>

                                <div className='space-y-1'>
                                    <p><strong>Outage Type:</strong> <span className='text-red-700 font-bold'>{entry.cat}</span></p>
                                    <p><strong>Subdivision:</strong> {entry.subdivision}</p>
                                    <p><strong>Start:</strong> {entry.starttime_Display}</p>
                                    <p><strong>End:</strong> {entry.endtime_Display}</p>
                                    <p><strong>Areas affected:</strong> {entry.areasaffected}</p>
                                    <p className='text-xs mt-1 text-gray-600 border-t border-yellow-200 pt-1'><strong>JE(s):</strong> {entry.je}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* <PowerStats /> */}
            <PowerStats selectedDistrict={selectedDistrict?.label} />

            {/* FAQ SECTION */}
            <FAQSection
                district={selectedDistrict}
                division={selectedDivision}
                subdivision={selectedSubDivision}
            />


        </div>
    )
}


export default Home