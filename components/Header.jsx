import { useParams } from 'react-router';
import logo from '../src/assets/logo.png';

const Header = () => {
    const { route_district } = useParams();

    // Helper to format slug to name (e.g., "amritsar" -> "Amritsar")
    const formatDistrict = (slug) => {
        if (!slug) return 'Punjab';
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const districtName = formatDistrict(route_district);
    const logoAlt = districtName !== 'Punjab'
        ? `PSPCL Power Cut Status in ${districtName}`
        : 'Punjab Power Supply Logo';

    return (
        <header className="sticky top-0 z-50 w-full bg-[#16192a]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16 gap-3">
                    <img src={logo} alt={logoAlt} title={logoAlt} className="h-10 w-auto" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        Punjab Power Supply
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
