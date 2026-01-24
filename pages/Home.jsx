import React from 'react'
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';

import District from '../components/District';
import Division from '../components/Division';
import SubDivision from '../components/SubDivision';
import Typewriter from '../components/Typewriter';
import PowerStats from '../components/PowerStats';

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
    const [divisionPlaceholder, setDivisionPlaceholder] = useState('Select district first');
    const [subDivisionPlaceholder, setSubDivisionPlaceholder] = useState('Select division first');

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

    useEffect(() => {
        console.log('second useEffect triggered');

        console.log('Districts:', districts);
        console.log('Divisions:', divisions);
        console.log('Subdivisions:', subdivisions);

        if (localStorage.getItem('selectedDistrict')) {
            const cacheDistrict = Number(localStorage.getItem('selectedDistrict'));
            const cacheDivision = Number(localStorage.getItem('selectedDivision'));
            const cacheSubdivision = Number(localStorage.getItem('selectedSubDivision'));

            // Districts from backend have id & name
            const districtObj = districts.find(d => d.id === cacheDistrict);
            setSelectedDistrict(
                districtObj ? { value: districtObj.id, label: districtObj.name } : null
            );
            console.log(districtObj ? districtObj.name : 'District not found');

            // Divisions/subdivisions are already value/label
            const divisionObj = divisions.find(d => d.value === cacheDivision);
            setSelectedDivision(divisionObj || null);
            console.log(divisionObj ? divisionObj.label : 'Division not found');

            const subDivisionObj = subdivisions.find(d => d.value === cacheSubdivision);
            setSelectedSubDivision(subDivisionObj || null);
            console.log(subDivisionObj ? subDivisionObj.label : 'Subdivision not found');
        }
    }, [districts]);


    useEffect(() => {
        if (selectedSubDivision && selectedSubDivision.value) {
            console.log('Fetching supply status for cached subdivision...');
            getData('supply', selectedSubDivision.value);
        }
    }, [selectedSubDivision]);






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
                <District setSelectedDistrict={setSelectedDistrict} selectedDistrict={selectedDistrict} customStyles={customStyles} setDistricts={setDistricts} districts={districts} getData={getData} />


                {/* SELECTING DIVISION */}
                <Division divisionPlaceholder={divisionPlaceholder} selectedDivision={selectedDivision} setSelectedDivision={setSelectedDivision} customStyles={customStyles} getData={getData} divisions={divisions} />



                {/* SELECTING SUBDIVISION */}
                <SubDivision subDivisionPlaceholder={subDivisionPlaceholder} selectedSubDivision={selectedSubDivision} setSubDivision={setSelectedSubDivision} customStyles={customStyles} subdivisions={subdivisions} getData={getData} />


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


        </div>
    )
}


export default Home