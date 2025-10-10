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
    Pokemon, 
    SortKey, 
    SortDir 
} from '../types/pokemon';

import './PokemonList.css';

export const PokemonList = () => {
    const { pokemonList, loading, error } = usePokemonList(151);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const navigate = useNavigate();
    if (loading) {
        return <div className="pokemon-list-loading">Loading Pokemon...</div>;
    }
    if (error) {
        return <div className="pokemon-list-error">{error}</div>;
    }
    // Filter Pokemon based on search query
    // Used this documentation for guidance:
    // https://www.w3schools.com/jsref/jsref_search.asp
    const filteredPokemon = pokemonList.filter((pokemon) => {
        const lowerQuery = searchQuery.toLowerCase();
        const lowerName = pokemon.name.toLowerCase();
        return lowerName.includes(lowerQuery);
    });
    // Sort Pokemon based on sortKey and sortDir
    const sortedPokemon = [...filteredPokemon].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;
        if (sortKey === 'name') {
            aValue = a.name;
            bValue = b.name;
        } else if (sortKey === 'id') {
            aValue = a.id;
            bValue = b.id;
        } else if (sortKey === 'height') {
            aValue = a.height;
            bValue = b.height;
        } else {
            aValue = a.weight;
            bValue = b.weight;
        }
        if (aValue < bValue) {
            if (sortDir === 'asc') {
                return -1;
            } else {
                return 1;
            }
        } else if (aValue > bValue) {
            if (sortDir === 'asc') {
                return 1;
            } else {
                return -1;
            }
        } else {
            return 0;
        }
    });
    const toggleSortDir = () => {
        if (sortDir === 'asc') {
            setSortDir('desc');
        } else {
            setSortDir('asc');
        }
    };
    
    // Handle Pokemon click
    const handlePokemonClick = (pokemon: Pokemon) => {
        const pokemonIds = sortedPokemon.map((p) => p.id);
        navigate(`/pokemon/${pokemon.id}`, {
            state: { pokemonIds: pokemonIds, source: 'list' }
        });
    };
    return (
    <div className="pokemon-list-page">
        <h1 className="pokemon-list-page-title">Pokemon List</h1>
        <input type="text" placeholder="Search Pokemon by name..." value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pokemon-list-search-bar"
        />
        <div className="pokemon-list-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="pokemon-list-sort-select">
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="height">Height</option>
                <option value="weight">Weight</option>
                </select>
                <button onClick={toggleSortDir} className="pokemon-list-sort-button">
                    Order: {sortDir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
                </button>
        </div>
        <p className="pokemon-list-count">
            Showing {sortedPokemon.length} Pokemon
        </p>
        <div className="pokemon-list-grid">
            {sortedPokemon.map((pokemon) => (
                <PokemonTile key={pokemon.id} pokemon={pokemon} onClick={() => handlePokemonClick(pokemon)}/>
            ))}
        </div>
    </div>
    );
};