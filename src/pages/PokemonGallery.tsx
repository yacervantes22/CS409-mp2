import { 
    useState 
} from 'react';

import { 
    useNavigate 
} from 'react-router-dom';

import { 
    usePokemonList 
} from '../helpers/usePokemonList';

import { 
    PokemonTile 
} from '../components/PokemonTile';
import { 
    Pokemon, PokemonTypeName 
} from '../types/pokemon';

import './PokemonGallery.css';

export const PokemonGallery = () => {
    const { pokemonList, loading, error } = usePokemonList(151);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const navigate = useNavigate();
    const allTypes: PokemonTypeName[] = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
    if (loading) {
        return <div className="pokemon-gallery-loading">Loading Pokemon Gallery...</div>;
    }
    if (error) {
        return <div className="pokemon-gallery-error">{error}</div>;
    }
    const toggleTypeFilter = (type: string) => {
        if (selectedTypes.includes(type)) {
            const newTypes = selectedTypes.filter((t) => t !== type);
            setSelectedTypes(newTypes);
        } else {
            const newTypes = [...selectedTypes, type];
            setSelectedTypes(newTypes);
        }
    };
    const clearFilters = () => {
        setSelectedTypes([]);
    };
    
    let filteredPokemon = pokemonList;
    if (selectedTypes.length > 0) {
        filteredPokemon = pokemonList.filter((pokemon) => {
            const pokemonTypes = pokemon.types.map((t) => t.type.name);
            let hasSelectedType = false;
            for (let i = 0; i < pokemonTypes.length; i++) {
                if (selectedTypes.includes(pokemonTypes[i])) {
                    hasSelectedType = true;
                    break;
                }
            }
            return hasSelectedType;
        });
    }
    
    // Handle Pokemon click
    const handlePokemonClick = (pokemon: Pokemon) => {
        const pokemonIds = filteredPokemon.map((p) => p.id);
        navigate(`/pokemon/${pokemon.id}`, {
            state: { pokemonIds: pokemonIds, source: 'gallery' }
        });
    };
    return (
    <div className="pokemon-gallery-page">
        <h1 className="pokemon-gallery-page-title">Pokemon Gallery</h1>
        <div className="pokemon-gallery-filters">
            <h2 className="pokemon-gallery-filters-title">Filter by Type:</h2>
            <div className="pokemon-gallery-filters-grid">
                {allTypes.map((type) => {
                    const isActive = selectedTypes.includes(type);
                    let buttonClass = 'pokemon-gallery-filter-button';
                    if (isActive) {
                        buttonClass = buttonClass + ' pokemon-gallery-filter-button-active';
                    }
                    return (
                    <button key={type} onClick={() => toggleTypeFilter(type)} className={buttonClass}>
                        {type}
                    </button>
                    );
                })}
            </div>
            {selectedTypes.length > 0 && (
                <button onClick={clearFilters} className="pokemon-gallery-clear-button">
                    Clear All Filters ({selectedTypes.length})
                </button>
            )}
        </div>
        
        <p className="pokemon-gallery-count">
            Showing {filteredPokemon.length} Pokemon
            {selectedTypes.length > 0 && (
                <span> (filtered by: {selectedTypes.join(', ')})</span>
            )}
        </p>
        {/* I used guidance from this site for filtering:
            https://dev.to/nikola/getting-started-with-react-by-building-a-pokemon-search-application-3pm
        */}
        {filteredPokemon.length > 0 ? (
            <div className="pokemon-gallery-grid">
                {filteredPokemon.map((pokemon) => (
                    <PokemonTile
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                    />
                ))}
            </div>
        ) : (
        <div className="pokemon-gallery-no-results">
            No Pokemon found with the selected types. Try different filters!
        </div>
        )}
    </div>
    );
};