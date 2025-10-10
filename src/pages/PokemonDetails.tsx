import { 
    useState, 
    useEffect 
} from 'react';

import { 
    useParams, 
    useNavigate, 
    useLocation 
} from 'react-router-dom';

import pokeapi from '../API/pokeapi';

import { 
    Pokemon 
} from '../types/pokemon';

import { 
    formatPokemonName } 
from '../utilities/formatPokemonName';

import './PokemonDetails.css';

export const PokemonDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const state = location.state as { pokemonIds?: number[]; source?: string } | null;
    let pokemonIds: number[] = [];
  
    if (state && state.pokemonIds) {
        pokemonIds = state.pokemonIds;
    }

    useEffect(() => {
        const fetchPokemon = async () => {
            if (!id) {
                setError('No Pokemon ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await pokeapi.get<Pokemon>(`/pokemon/${id}`);
                setPokemon(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch Pokemon details');
                console.error('Error fetching Pokemon:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemon();
    }, [id]);
    if (loading) {
        return <div className="pokemon-details-loading">Loading Pokemon Details...</div>;
    }
    if (error || !pokemon) {
        return <div className="pokemon-details-error">{error || 'Pokemon not found'}</div>;
    }
    let imageUrl = '';
    if (pokemon.sprites.front_default) {
        imageUrl = pokemon.sprites.front_default;
    }
    
    const handlePrevious = () => {
        if (pokemonIds.length > 0) {
            const currentIndex = pokemonIds.indexOf(pokemon.id);
            if (currentIndex > 0) {
                const previousId = pokemonIds[currentIndex - 1];
                navigate(`/pokemon/${previousId}`, {
                    state: { pokemonIds: pokemonIds, source: state && state.source }
                });
            }
        } else {
            const previousId = pokemon.id - 1;
            if (previousId >= 1) {
                navigate(`/pokemon/${previousId}`);
            }
        }
    };

    const handleNext = () => {
        if (pokemonIds.length > 0) {
            // Find current Pokemon in the list
            const currentIndex = pokemonIds.indexOf(pokemon.id);
            if (currentIndex < pokemonIds.length - 1) {
                const nextId = pokemonIds[currentIndex + 1];
                navigate(`/pokemon/${nextId}`, {
                    state: { pokemonIds: pokemonIds, source: state && state.source }
                });
            }
        }
    };
    
    // Check if Previous/Next should be disabled
    let isPreviousDisabled = false;
    let isNextDisabled = false;
    
    if (pokemonIds.length > 0) {
        const currentIndex = pokemonIds.indexOf(pokemon.id);
        isPreviousDisabled = currentIndex <= 0;
        isNextDisabled = currentIndex >= pokemonIds.length - 1;
    } else {
        isPreviousDisabled = pokemon.id <= 1;
        isNextDisabled = pokemon.id >= 151;
    }
    const getTypeColor = (type: string): string => {
        const typeColors: { [key: string]: string } = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC',
        };
        if (typeColors[type]) {
            return typeColors[type];
        } else {
            return '#777';
        }
    };
    const heightInMeters = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);
    return (
    <div className="pokemon-details-page">
        <div className="pokemon-details-navigation">
            <button onClick={handlePrevious} disabled={isPreviousDisabled} className="pokemon-details-nav-button">
                Previous
            </button>
            <button onClick={handleNext} disabled={isNextDisabled} className="pokemon-details-nav-button">
                Next
            </button>
        </div>
        <div className="pokemon-details-card">
            <div className="pokemon-details-header">
                <div className="pokemon-details-image-container">
                    <img src={imageUrl} alt={pokemon.name} className="pokemon-details-image"/>
                </div>
                <div className="pokemon-details-basic-info">
                    <h1 className="pokemon-details-name">
                        {formatPokemonName(pokemon.name)}
                    </h1>
                    <p className="pokemon-details-id"> 
                        #{String(pokemon.id).padStart(3, '0')}
                    </p>
                    <div className="pokemon-details-types">
                        {pokemon.types.map((typeInfo) => (
                            <span key={typeInfo.type.name} 
                                className="pokemon-details-type-badge" 
                                style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}>
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>
                    <div className="pokemon-details-measurements">
                        <div className="pokemon-details-measurement">
                            <span className="pokemon-details-measurement-label">Height</span>
                            <span className="pokemon-details-measurement-value">
                                {heightInMeters} m
                            </span>
                        </div>
                        <div className="pokemon-details-measurement">
                            <span className="pokemon-details-measurement-label">Weight</span>
                            <span className="pokemon-details-measurement-value">
                                {weightInKg} kg
                            </span>
                        </div>
                        <div className="pokemon-details-measurement">
                            <span className="pokemon-details-measurement-label">Base Exp</span>
                            <span className="pokemon-details-measurement-value">
                                {pokemon.base_experience}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pokemon-details-section">
                <h2 className="pokemon-details-section-title">Base Stats</h2>
                <div className="pokemon-details-stats">
                    {pokemon.stats.map((statInfo) => {
                        const statName = statInfo.stat.name.replace('-', ' ');
                        const statValue = statInfo.base_stat;
                        const maxStat = 255;
                        const percentage = (statValue / maxStat) * 100;
                    return (
                    <div key={statInfo.stat.name} className="pokemon-details-stat">
                        <span className="pokemon-details-stat-name">{statName}</span>
                        <span className="pokemon-details-stat-value">{statValue}</span>
                        <div className="pokemon-details-stat-bar-container">
                            <div
                                className="pokemon-details-stat-bar"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
        <div className="pokemon-details-section">
            <h2 className="pokemon-details-section-title">Abilities</h2>
            <div className="pokemon-details-abilities">
                {pokemon.abilities.map((abilityInfo) => {
                    let className = 'pokemon-details-ability';
                    if (abilityInfo.is_hidden) {
                        className = className + ' pokemon-details-ability-hidden';
                    }
                    return (
                    <span key={abilityInfo.ability.name} className={className}>
                        {abilityInfo.ability.name.replace('-', ' ')}
                        {abilityInfo.is_hidden && ' (Hidden)'}
                    </span>
                    );
                })}
            </div>
        </div>

        <div className="pokemon-details-section">
            <h2 className="pokemon-details-section-title">
                Moves ({pokemon.moves.length})
            </h2>
            <div className="pokemon-details-moves">
                {pokemon.moves.slice(0, 50).map((moveInfo) => (
                    <span key={moveInfo.move.name} className="pokemon-details-move">
                        {moveInfo.move.name.replace('-', ' ')}
                    </span>
                ))}
                {pokemon.moves.length > 50 && (
                    <span className="pokemon-details-move">
                        ... and {pokemon.moves.length - 50} more
                    </span>
                )}
                </div>
            </div>
        </div>
    </div>);
};