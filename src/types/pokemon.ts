
// Pokemon Type Info
export type PokemonType = {
    slot: number;
    type: { 
        name: string;
        url: string;
    };
};

// Pokemon Sprites (Images)
export type PokemonSprites = {
    front_default: string | null;
};

// Pokemon Ability Info
export type PokemonAbility = {
    ability: { 
        name: string; // Ability name 
        url: string;
    };
    is_hidden: boolean;
    slot: number;
};

// Pokemon Stat Info (HP, Attack, Defense)
export type PokemonStat = {
    base_stat: number;
    effort: number;
    stat: { 
        name: string;
        url: string;
    };
};

// Pokemon Move Info
export type PokemonMove = {
    move: { 
        name: string; // Move name
        url: string;
    };
};


// Complete Pokemon data
export type Pokemon = {
    id: number; // Pokedex number
    name: string; // Pokemon name 
    height: number; // Height in decimeters 
    weight: number; // Weight in hectograms
    base_experience: number; // Base experience gained when defeated
    types: PokemonType[]; // Pokemon types (1-2 types)
    sprites: PokemonSprites;
    abilities: PokemonAbility[]; // Pokemon abilities
    stats: PokemonStat[];
    moves: PokemonMove[];
    species: { 
        name: string;
        url: string;
    };
    order: number;
    is_default: boolean;
};


// Simplified Pokemon for list/gallery views
export type SimplePokemon = {
    id: number;
    name: string;
    sprites: PokemonSprites;
    types: PokemonType[];
    height: number;
    weight: number;
};


// Response from pokemon endpoint 
export type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: { 
        name: string;
        url: string;
    }[];
};


// Valid keys for sorting Pokemon
export type SortKey = "name" | "id" | "height" | "weight";

// Sort direction
export type SortDir = "asc" | "desc";

// All valid Pokemon type names - for filtering in gallery view
export type PokemonTypeName = 
    | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
    | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
    | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";