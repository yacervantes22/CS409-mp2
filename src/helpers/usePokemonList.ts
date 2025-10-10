import { 
    useState, 
    useEffect 
} from 'react';

import pokeapi from '../API/pokeapi';

import { 
    Pokemon, 
    PokemonListResponse 
} from '../types/pokemon';

// Looked at this link for guidance on calling the api:
// https://stackoverflow.com/questions/62110181/pokeapi-fetching-pokemon-data
export const usePokemonList = (limit: number = 151) => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                const listResponse = await pokeapi.get<PokemonListResponse>(
                    `/pokemon?limit=${limit}`
                );
                const pokemonPromises = listResponse.data.results
                    .map(async (pokemon) => {
                        const response = await pokeapi.get<Pokemon>(`/pokemon/${pokemon.name}`);
                        return response.data;
                    });
                const allPokemon = await Promise.all(pokemonPromises);
                
                setPokemonList(allPokemon);
                setError(null);
 
            } catch (err) {
                setError('Failed to fetch Pokemon. Please try again.');
                console.error('Error fetching Pokemon:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonList();
    }, [limit]);
    return { pokemonList, loading, error };
};