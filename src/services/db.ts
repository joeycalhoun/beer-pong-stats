import { supabase } from "../lib/supabase";
import type { Shot, Player } from "../store/gameStore";

export async function logShot(shot: Shot): Promise<void> {
  // Omit id so Supabase generates it
  const { id, ...shotWithoutId } = shot;
  void id; // explicitly ignore id
  const { error } = await supabase.from("shots").insert([shotWithoutId]);
  if (error) {
    console.error("Failed to log shot to Supabase:", error);
    throw error;
  }
}

export async function getOrCreatePlayerByName(name: string): Promise<{ id: string; name: string }> {
  // Try to find existing player
  const { data: existing, error: findError } = await supabase
    .from("players")
    .select("id, name")
    .eq("name", name)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing;
  // Create new player
  const { data, error } = await supabase
    .from("players")
    .insert([{ name }])
    .select("id, name")
    .single();
  if (error) throw error;
  return data;
}

export async function createGame(name: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("games")
    .insert([{ started_at: new Date().toISOString(), name }])
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function getGamesForPlayer(playerId: string): Promise<{ id: string; started_at: string; name: string }[]> {
  const { data, error } = await supabase
    .from("shots")
    .select("game_id, games(id, started_at, name)")
    .eq("player_id", playerId);
  if (error) throw error;
  console.log('getGamesForPlayer data:', data); // Debug log
  const uniqueGames: Record<string, { id: string; started_at: string; name: string }> = {};
  for (const row of data as { game_id: string; games: { id: string; started_at: string; name: string } | { id: string; started_at: string; name: string }[] }[]) {
    const game = Array.isArray(row.games) ? row.games[0] : row.games;
    if (game && !uniqueGames[row.game_id]) {
      uniqueGames[row.game_id] = { id: game.id, started_at: game.started_at, name: game.name };
    }
  }
  return Object.values(uniqueGames);
}

export async function addPlayersToGame(gameId: string, playerIds: string[]): Promise<void> {
  const rows = playerIds.map(player_id => ({ game_id: gameId, player_id }));
  const { error } = await supabase.from("game_players").insert(rows);
  if (error) throw error;
}

export async function getPlayersForGame(gameId: string): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase
    .from("game_players")
    .select("player_id, players(id, name)")
    .eq("game_id", gameId);
  if (error) throw error;
  console.log("getPlayersForGame raw data:", JSON.stringify(data, null, 2));
  // Map to player objects, filter out undefined/null
  type GamePlayerRow = {
    player_id: string;
    players: Player | Player[] | null;
  };
  return (data as GamePlayerRow[])
    .map(row => {
      if (!row.players) return null;
      if (Array.isArray(row.players)) return row.players[0];
      return row.players;
    })
    .filter((p): p is Player => !!p);
}

// Get the most recent active game
export async function getActiveGame(): Promise<{ id: string; name: string } | null> {
  const { data, error } = await supabase
    .from("games")
    .select("id, name")
    .eq("active", true)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

// Mark a game as inactive
export async function endGame(gameId: string): Promise<void> {
  const { error } = await supabase
    .from("games")
    .update({ active: false })
    .eq("id", gameId);
  if (error) throw error;
}

// Mark all games as inactive
export async function setAllGamesInactive(): Promise<void> {
  const { error } = await supabase
    .from("games")
    .update({ active: false })
    .eq("active", true);
  if (error) throw error;
} 