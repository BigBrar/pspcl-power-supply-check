import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../src/supabaseClient'
import districtData from '../src/assets/district+divisions+subdivisions.json'

const PowerStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    // 1. Safe Mapping for District Lookup
    const districtMap = useMemo(() => {
        const map = {}
        // Check if districtData exists and is an array
        if (!districtData || !Array.isArray(districtData)) return map;

        districtData.forEach(dist => {
            // Use optional chaining (?.) to prevent crashes on missing divisions
            dist.divisions?.forEach(div => {
                // Use optional chaining (?.) to prevent crashes on missing subdivisions
                div.subdivisions?.forEach(sub => {
                    map[sub.id] = dist.name
                })
            })
        })
        return map
    }, [])

    // Safer date parsing for "YYYY-MM-DD HH:MM AM/PM" format
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    useEffect(() => {
        const fetchDeepAnalytics = async () => {
            setLoading(true)
            try {
                const now = new Date()
                const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
                const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()

                const { data, error } = await supabase
                    .from('power_logs')
                    .select('*')
                    .gt('checked_on', twelveHoursAgo)
                    .order('checked_on', { ascending: false })

                if (error) throw error

                const currentData = data.filter(row => row.checked_on >= sixHoursAgo)
                const previousData = data.filter(row => row.checked_on < sixHoursAgo)

                const currentCuts = currentData.filter(r => !r.power_available)
                const prevCuts = previousData.filter(r => !r.power_available)

                // Weather
                const avgWind = currentCuts.length ? currentCuts.reduce((acc, r) => acc + (r.wind_speed || 0), 0) / currentCuts.length : 0
                const avgTemp = currentCuts.length ? currentCuts.reduce((acc, r) => acc + (r.temperature || 0), 0) / currentCuts.length : 0

                // Outage Types
                const types = { unplanned: 0, scheduled: 0 }
                currentCuts.forEach(r => {
                    const type = (r.outage_type || '').toLowerCase()
                    if (type.includes('unplanned') || type.includes('breakdown')) types.unplanned++
                    else types.scheduled++
                })

                // Duration Calculation
                const durations = currentCuts.map(r => {
                    const s = parseDate(r.start_time);
                    const e = parseDate(r.end_time);
                    return (s && e) ? (e - s) / (1000 * 60) : null;
                }).filter(v => v !== null && v > 0);

                const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0

                // District Reliability
                const distStats = {}
                currentData.forEach(row => {
                    const dName = districtMap[row.subdivision_id] || 'Other'
                    if (!distStats[dName]) distStats[dName] = { total: 0, ok: 0 }
                    distStats[dName].total++
                    if (row.power_available) distStats[dName].ok++
                })

                const districtReliability = Object.entries(distStats).map(([name, s]) => ({
                    name,
                    score: Math.round((s.ok / s.total) * 100),
                    outages: s.total - s.ok
                })).sort((a, b) => b.score - a.score)

                setStats({
                    totalCuts: currentCuts.length,
                    cutTrend: currentCuts.length - prevCuts.length,
                    avgWind: avgWind.toFixed(1),
                    avgTemp: Math.round(avgTemp),
                    avgDuration,
                    outageTypes: types,
                    topDistricts: districtReliability.slice(0, 3),
                    bottomDistricts: districtReliability.slice(-3).reverse(),
                    gridHealth: Math.round((currentData.filter(r => r.power_available).length / (currentData.length || 1)) * 100)
                })

            } catch (err) {
                console.error("Analytics Error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchDeepAnalytics()
    }, [districtMap])

    if (loading) return (
        <div className="max-w-4xl mx-auto mt-20 p-6 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Live Grid Data...</p>
        </div>
    )

    if (!stats) return null

    return (
        <div className='m-4 mt-24 w-full max-w-5xl mx-auto px-4 pb-20'>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b-2 border-yellow-200 pb-6">
                <div>
                    <h2 className='text-4xl font-black tracking-tighter text-gray-900 uppercase leading-none'>
                        Punjab Metrics
                    </h2>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Live data: Last 6 hours
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">State-wide Stability</span>
                    <div className={`px-4 py-1.5 rounded-xl text-sm font-black border ${stats.gridHealth > 90 ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                        {stats.gridHealth}% OPERATIONAL
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <StatCard
                    title="Active Outages" value={stats.totalCuts} unit="Subdivisions"
                    trend={stats.cutTrend} icon="⚡"
                />
                <StatCard
                    title="Avg Restoration" value={stats.avgDuration} unit="Mins"
                    icon="🕒"
                />
                <StatCard
                    title="Weather Impact" value={`${stats.avgWind} km/h`}
                    subtitle={`${stats.avgTemp}°C Avg Temp`} icon="🌪️"
                />
                <StatCard
                    title="Grid Uptime" value={`${stats.gridHealth}%`} unit="Stability"
                    icon="🛡️"
                />
            </div>

            {/* Detailed Cards */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xs font-black text-gray-400 uppercase mb-5 tracking-widest">Outage Types</h3>
                    <div className="space-y-5">
                        <ProgressBar label="Unplanned Cuts" count={stats.outageTypes.unplanned} total={stats.totalCuts} color="bg-red-500" />
                        <ProgressBar label="Scheduled Maint." count={stats.outageTypes.scheduled} total={stats.totalCuts} color="bg-amber-400" />
                    </div>
                </div>

                <div className="bg-green-50/40 border border-green-100 rounded-3xl p-6">
                    <h3 className="text-xs font-black text-green-600 uppercase mb-5 tracking-widest">Most Stable</h3>
                    <div className="space-y-3">
                        {stats.topDistricts.map(d => (
                            <div key={d.name} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
                                <span className="font-bold text-gray-800 text-sm">{d.name}</span>
                                <span className="text-green-600 font-black">{d.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6">
                    <h3 className="text-xs font-black text-red-600 uppercase mb-5 tracking-widest">Most Affected</h3>
                    <div className="space-y-3">
                        {stats.bottomDistricts.map(d => (
                            <div key={d.name} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
                                <span className="font-bold text-gray-800 text-sm">{d.name}</span>
                                <span className="text-red-600 font-black">{d.outages}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, unit, trend, icon, subtitle }) => (
    <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-3">
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
            {trend !== undefined && (
                <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend <= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {trend > 0 ? `+${trend}` : trend} Trend
                </div>
            )}
        </div>
        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
            <h4 className="text-3xl font-black text-gray-900">{value}</h4>
            <span className="text-xs font-bold text-gray-400">{unit}</span>
        </div>
        {subtitle && <p className="text-[10px] text-gray-500 mt-2 font-bold">{subtitle}</p>}
    </div>
)

const ProgressBar = ({ label, count, total, color }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    return (
        <div>
            <div className="flex justify-between text-[11px] font-black mb-2 uppercase">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900">{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
            </div>
        </div>
    )
}

export default PowerStats