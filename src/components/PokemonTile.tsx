import { 
    Pokemon 
} from '../types/pokemon';

import { 
    formatPokemonName 
} from '../utilities/formatPokemonName';

import './PokemonTile.css';

// PokemonTile component
interface PokemonTileProps {
    pokemon: Pokemon; // data
    onClick: () => void;
}

// Displays Pokemon image, name, ID, and type
export const PokemonTile = ({ pokemon, onClick }: PokemonTileProps) => {
    let imageUrl = '';
    if (pokemon.sprites.front_default) {
        imageUrl = pokemon.sprites.front_default;
    }
    return (
    <div onClick={onClick} className="pokemon-tile">
        {/* Pokemon Image */}
        <img src={imageUrl} alt={pokemon.name} className="pokemon-tile-image"/>
        {/* Pokemon Name */}
        <h3 className="pokemon-tile-name">
            {formatPokemonName(pokemon.name)}
        </h3>
        {/* Pokemon ID - 
            I looked at this documentation to understand padStart
             https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart*/
        }
        <p className="pokemon-tile-id">
            {String(pokemon.id).padStart(3, '0')}
        </p>
        {/* Pokemon Types */}
        <div className="pokemon-tile-types">
            {pokemon.types.map((typeInfo) => (
                <span 
                    key={typeInfo.type.name}
                    className={`pokemon-tile-type-badge type-${typeInfo.type.name}`}> 
                    {typeInfo.type.name}
                </span>
            ))}
        </div>
    </div>
    );
};